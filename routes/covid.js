const axios = require("axios").default;
const boom = require("@hapi/boom");
const covidDataRoute = {
  method: "GET",
  path: "/service/covid/overall",
  handler: async ({ params, query }, h) => {
    const { days = 1 } = params;
    console.log({ params });
    try {
      const resp = await axios.get(
        // mkt=cn-zh
        `https://lab.isaaclin.cn/nCoV/api/overall?latest=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log({ resp });
      const { results, success } = resp.data;
      if (success) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data: results,
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
