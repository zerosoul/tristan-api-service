const axios = require("axios").default;
const boom = require("@hapi/boom");

// weibo 授权处理
// const code = "7e07b3a29c193c026af9";
const clients = {
  portal: "1360860551",
};
console.log("weibo secret", process.env.WEIBO_PORTAL_SECRET);
const weiboRoute = {
  method: "POST",
  path: "/oauth/weibo/{app?}",
  handler: async ({ params, payload }, h) => {
    console.log({ payload });
    const { app = null } = params;
    const { code = null } = payload;
    if (!code) {
      return boom.badData("缺少code参数");
    }
    if (!app || !clients[app]) {
      return boom.badData("缺少client参数");
    }
    try {
      const postData = {
        client_id: clients[app],
        client_secret: process.env.WEIBO_PORTAL_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://m.izhaichao.com:3000/oauth/weibo",
      };
      console.log({ postData });
      const { data, status, ...rest } = await axios.post(
        "https://api.weibo.com/oauth2/access_token",
        postData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log({ data, status, rest });
      // if (status == 200) {
      //   console.log({ data });
      //   if (data.error && data.error == "incorrect_client_credentials") {
      //     return h.response({
      //       code: -1,
      //       msg: "服务器端Github OAuth 配置有误",
      //     });
      //   }
      //   if (data.error && data.error == "bad_verification_code") {
      //     return h.response({
      //       code: -1,
      //       msg: "Code不合法或已过期",
      //     });
      //   } else {
      //     return h.response({
      //       code: 0,
      //       msg: "正常响应",
      //       data,
      //     });
      //   }
      // } else {
      //   return boom.badRequest("请求有误");
      // }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("GitHub OAuth 服务暂不可用");
    }
  },
};
module.exports = [weiboRoute];
