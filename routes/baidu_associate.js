// const axios = require("axios").default;
const fetch = require("node-fetch");
const boom = require("@hapi/boom");

const uaRoute = {
  method: "GET",
  path: "/service/baidu/ass",
  handler: async ({ query }, h) => {
    const { w } = query;
    let words = [];

    try {
      const res = await fetch(
        `https://api.oioweb.cn/api/baidu_keyword.php?key=${encodeURIComponent(
          w
        )}`
      );
      const obj = await res.json();
      console.log({ obj });
      const { code, data } = obj;
      if (code == 1) {
        words = data;
      }
      // const respText = await res.text();
      // console.log({ respText });

      // const re = /\([^\)]+\)/g;
      // let tmpStr = respText.match(re)[0] || null;
      // if (!tmpStr) throw new Error("invalid JSONP response");
      // tmpStr = tmpStr.substring(1, tmpStr.length - 1);

      // words = JSON.parse(tmpStr).s;
      // console.log({ words });
    } catch (error) {
      console.error(error);
      return boom.serverUnavailable("百度联想词服务暂不可用");
    }

    const resp = h.response({
      code: 0,
      msg: "正常响应",
      data: words,
    });
    resp.type("application/json");
    resp.header("from", "tristan-service-ua");
    return resp;
  },
};
module.exports = [uaRoute];
