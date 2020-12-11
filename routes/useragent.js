const { parse } = require("../services/ua");

const uaRoute = {
  method: "GET",
  path: "/service/ua",
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
};
module.exports = [uaRoute];
