const Hapi = require("@hapi/hapi");
const router = require("hapi-router");

const init = async () => {
  const server = Hapi.server({
    port: 3008,
    host: "localhost",
  });
  await server.register({
    plugin: router,
    options: {
      routes: "routes/**/*.js", // uses glob to include files
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
