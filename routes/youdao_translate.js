// const axios = require("axios").default;
const boom = require("@hapi/boom");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");

function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}
const appKey = "66bbde25d0dd3edf";
const key = process.env.YOUDAO_PORTAL_SECRET; //注意：暴露appSecret，有被盗用造成损失的风险
const salt = uuidv4();
const curtime = Math.floor(Date.now() / 1000) + "";
const q_string = "您好，欢迎再次使用有道智云文本翻译API接口服务";
// 多个q_string可以用\n连接  如 q_string='apple\norange\nbanana\npear'

const from = "zh-CHS";
const to = "en";
const str1 = appKey + truncate(q_string) + salt + curtime + key;
const sign = SHA256(str1).toString(CryptoJS.enc.Hex);

console.log("加密后的内容", { key, sign });
const translateYoudaoRoute = {
  method: "GET",
  path: "/service/translate/youdao",
  handler: async ({ query }, h) => {
    // const { content } = query;
    // console.log({ content });
    console.log("start youdao");
    const data = {
      q: q_string,
      appKey,
      salt,
      from,
      to,
      sign,
      signType: "v3",
      curtime,
    };
    console.log({ data });
    try {
      const resp = await axios.post("https://openapi.youdao.com/api", data);
      console.log({ resp });
      return h.response({
        code: 0,
        data: resp,
        msg: "请求成功",
      });
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("服务暂不可用");
    }
  },
};
module.exports = [translateYoudaoRoute];
