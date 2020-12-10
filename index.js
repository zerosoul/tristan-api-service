const Hapi = require("@hapi/hapi");
const { parse } = require("./services/ua");
const { getToken } = require("./oauth/github");

const init = async () => {
  const server = Hapi.server({
    port: 3008,
    host: "localhost",
  });
  server.route([
    {
      method: "GET",
      path: "/",
      handler: (req, h) => {
        return h.view("index", { title: "首页" });
      },
    },
    {
      method: "GET",
      path: "/services/ua",
      handler: ({ headers }, h) => {
        const ua = headers["user-agent"] || "";
        const parsedUA = parse(ua);
        parsedUA["source"] = ua;
        console.log({ parsedUA });
        const resp = h.response(parsedUA);
        resp.type("application/json");
        resp.header("from", "tristan-service-ua");
        return resp;
      },
    },
    {
      method: "POST",
      path: "/oauth/github/{app?}",
      handler: ({ params }, h) => {
        const { app = null } = params;
        if (app) {
          console.log({ app });
          getToken();
          return `Hello from ${app}`;
        }
        return "no app param!";
      },
    },
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
