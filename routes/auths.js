const axios = require("axios").default;
const boom = require("@hapi/boom");
const { getToken } = require("../oauth/github");

// github 授权处理
const code = "7e07b3a29c193c026af9";
// const cid = "f3505bc46977fad4bb33";
// const rd = 'http://localhost:3000/one-stop-nav/auth';
const secret = "ab5cff13f4e1208258bb218522690f86a6d4bb5a";
const clients = {
  portal: "f3505bc46977fad4bb33",
};
console.log(process.env.NODE_ENV);
const authRoute = {
  method: "GET",
  path: "/oauth/github/{app?}",
  handler: async ({ params }, h) => {
    const { app = null } = params;
    if (!app || !clients[app]) {
      return boom.badData("缺少client参数");
    }
    try {
      const { status, data } = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: clients[app],
          client_secret: secret,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (status == 200) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data,
        });
      } else {
        return boom.badRequest("请求有误");
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("GitHub oauth 服务暂不可用");
    }
  },
};
module.exports = [authRoute];
