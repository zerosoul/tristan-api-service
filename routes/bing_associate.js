// const axios = require("axios").default;
const axios = require("axios").default;
const boom = require("@hapi/boom");
const bingAssoRoute = {
  method: "GET",
  path: "/service/bing/ass",
  handler: async ({ query }, h) => {
    const { w } = query;
    let words = [];

    try {
      const res = await axios.get(
        `https://sg1.api.bing.com/qsonhs.aspx?type=json&q=${encodeURIComponent(
          w
        )}`
      );

      console.log(res.data);
      const {
        AS: { FullResults, Results },
      } = res.data;
      if (FullResults == 1) {
        const [{ Suggests }] = Results;
        words = Suggests.map((s) => s.Txt);
      }
    } catch (error) {
      console.error(error);
      return boom.serverUnavailable("必应联想词服务暂不可用");
    }

    const resp = h.response({
      code: 0,
      msg: "正常响应",
      data: words,
    });
    resp.type("application/json");
    resp.header("from", "tristan-service-bingAsso");
    return resp;
  },
};
module.exports = [bingAssoRoute];
