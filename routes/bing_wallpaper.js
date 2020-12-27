const axios = require("axios").default;
const boom = require("@hapi/boom");
const bilibiliHotRoute = {
  method: "GET",
  path: "/service/bing/wp/{days?}",
  handler: async ({ params, query }, h) => {
    const { days = 1 } = params;
    console.log({ params });
    try {
      const resp = await axios.get(
        // mkt=cn-zh
        `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=${
          days || 1
        }`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log({ resp });
      const { images = [], tooltips } = resp.data;
      if (images.length !== 0) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data: images,
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
module.exports = [bilibiliHotRoute];
