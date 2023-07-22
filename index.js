import Fastify from "fastify";
pro
const port = 8888;

const filterHeaders = [
  "host",
  "connection",
  "cf-ray",
  "cf-visitor",
  "x-forwarded-proto",
  "cdn-loop",
  "cookie",
  "x-real-ip",
];

const fastify = Fastify({
  //   logger: true,
  trustProxy: true,
});

// XX - Used for clients without country code data.
// T1 - Used for clients using the Tor network.

fastify.get("/", (req, reply) => {
  const result = {};
  for (let headerName in req.headers) {
    const value = req.headers[headerName];
    if (filterHeaders.includes(headerName)) continue;
    if (headerName == "cf-ipcountry") {
      result["country"] = value;
      continue;
    }
    if (headerName === "cf-connecting-ip") {
      result["ip"] = value;
      continue;
    }
    result[headerName] = value;
  }
  reply.send(result);
});

const start = async () => {
  try {
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
