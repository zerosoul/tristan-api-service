const axios = require("axios").default;
const boom = require("@hapi/boom");
const covidDataRoute = {
  method: "GET",
  path: "/service/animals/{ani?}",
  handler: async ({ params, query }, h) => {
    const { ani = "shibes" } = params;
    const { count = 10 } = query;
    console.log({ params });
    try {
      const resp = await axios.get(
        `https://shibe.online/api/${ani}?count=${count}&urls=false`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const results = resp.data;
      if (results) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data: results.map((r) => `https://cdn.shibe.online/${ani}/${r}.jpg`),
        });
      } else {
        return boom.badRequest("请求有误");
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("服务暂不可用");
    }
  },
};
module.exports = [covidDataRoute];
