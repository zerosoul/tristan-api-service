const axios = require('axios').default;
const boom = require('@hapi/boom');
const { StreamChat } = require('stream-chat');
// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
const serverClient = new StreamChat('fwcuynkafsqt', process.env.STREAM_API_SECRET);
serverClient.updateAppSettings({
  disable_permissions_checks: true,
});
const streamChatRoute = {
  method: 'GET',
  path: '/service/chat/token/{uid}',
  handler: async ({ params, query }, h) => {
    const { uid = '' } = params;
    console.log({ uid });
    if (uid) {
      try {
        // generate a token for the user with id 'john'
        const token = serverClient.createToken(uid);
        if (token) {
          return h.response({
            code: 0,
            msg: '正常响应',
            data: token,
          });
        } else {
          return boom.badRequest('请求有误');
        }
      } catch (error) {
        console.log({ error });
        return boom.serverUnavailable('服务暂不可用');
      }
    } else {
      return boom.badRequest('请求有误');
    }
  },
};
module.exports = [streamChatRoute];
