// const axios = require("axios").default;
const boom = require("@hapi/boom");
// const translate = require("@vitalets/google-translate-api");
// import translate from "google-translate-open-api";
const translate = require("google-translate-open-api").default;
const translateRoute = {
  method: "GET",
  path: "/service/translate",
  handler: async ({ query }, h) => {
    const { content } = query;
    console.log({ content });
    try {
      const data = await translate(content, {
        tld: "cn",
        to: "zh-CN",
      });
      // return h.response({
      //   code: 0,
      //   msg: "正常响应",
      //   data: JSON.parse(reportJson),
      // });
      return h.response({
        code: 0,
        data,
        msg: "请求成功",
      });
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("服务暂不可用");
    }
  },
};
module.exports = [translateRoute];
