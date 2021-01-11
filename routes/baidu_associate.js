// const axios = require("axios").default;
const axios = require("axios").default;
const iconv = require("iconv-lite");
const jsonEval = require("json-eval");
const boom = require("@hapi/boom");
const baiduAssoRoute = {
  method: "GET",
  path: "/service/baidu/ass",
  handler: async ({ query }, h) => {
    const { w } = query;
    let words = [];

    try {
      const res = await axios.get(
        `http://suggestion.baidu.com/su?wd=${encodeURIComponent(
          w
        )}&cb=window.bdsug.sug`,
        {
          // headers: {
          //   Accept: "text/javascript; charset=gbk",
          // },
          responseType: "arraybuffer",
          transformResponse: [
            function (data) {
              let str = iconv.decode(Buffer.from(data), "gbk");
              str = iconv.encode(str, "utf8").toString();

              return str;
            },
          ],
        }
      );
      // const obj = await res.json();
      // console.log({ obj });
      // const { code, data } = obj;
      // if (code == 1) {
      //   words = data;
      // }

      console.log(res);
      const respText = res.data;
      console.log({ respText });

      const re = /\([^\)]+\)/g;
      let tmpStr = respText.match(re)[0] || null;
      if (!tmpStr) throw new Error("invalid JSONP response");
      tmpStr = tmpStr.substring(1, tmpStr.length - 1);
      const obj = jsonEval(tmpStr);
      console.log({ tmpStr, obj });
      words = obj.s;
      console.log({ words });
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
module.exports = [baiduAssoRoute];
