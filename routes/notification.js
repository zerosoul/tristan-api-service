const axios = require('axios').default;
const boom = require('@hapi/boom');
const webpush = require('web-push');
// web push
const publicVapidKey = 'BMrfFtMtL9IWl9vchDbbbYzJlbQwplyZ_fbv8Pei8gPNna_Dr1O-Ng7U7fy0LLqz5RKIxEytTIzyk6TLrcKbN30';
const privateVapidKey = 'E5gpbs9Y6r5TscHC64Ce9-hXojA9I1qQL0kuvX8Jz5Y';
// VAPID keys should only be generated only once.
// const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails('mailto:yanggc888@163.com', publicVapidKey, privateVapidKey);

// authing management
const { ManagementClient } = require('authing-js-sdk');
const managementClient = new ManagementClient({
  userPoolId: '6034a31382f5d09e3b5a15fa',
  secret: process.env.AUTHING_SECRET,
});
const notificationPostRoute = {
  method: 'POST',
  path: '/service/notification/{username?}',
  handler: async ({ params, payload }, h) => {
    let { username = 'notification' } = params;
    username = username || 'notification';
    const currUser = await managementClient.users.find({ username });
    console.log({ params });
    try {
      if (currUser) {
        await managementClient.users.setUdfValue(currUser.id, {
          notification: JSON.stringify(payload),
        });
        return h.response({
          code: 0,
          msg: '订阅成功',
          data: payload,
        });
      } else {
        return boom.badRequest('请求有误');
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable('服务暂不可用');
    }
  },
};
const notificationDeleteRoute = {
  method: 'DELETE',
  path: '/service/notification/{username?}',
  handler: async ({ params }, h) => {
    let { username = 'notification' } = params;
    username = username || 'notification';
    const currUser = await managementClient.users.find({ username });
    console.log({ params });
    try {
      if (currUser) {
        await managementClient.users.setUdfValue(currUser.id, {
          notification: '',
        });
        return h.response({
          code: 0,
          msg: '退订成功',
          data: null,
        });
      } else {
        return boom.badRequest('请求有误');
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable('服务暂不可用');
    }
  },
};
const testPushRoute = {
  method: 'GET',
  path: '/service/notification/test/{username?}',
  handler: async ({ params }, h) => {
    let { username = 'notification' } = params;
    username = username || 'notification';
    try {
      const currUser = await managementClient.users.find({ username });
      if (currUser) {
        const { notification = null } = await managementClient.users.getUdfValue(currUser.id);
        console.log(currUser.id, { params, notification });
        if (notification) {
          const notify = { title: 'Hey, this is a push notification!' };
          let webpushConfig =
            process.env.NODE_ENV == 'development'
              ? {
                  proxy: 'http://127.0.0.1:8118',
                }
              : {};
          console.log({ webpushConfig });
          const pushResp = await webpush.sendNotification(
            JSON.parse(notification),
            JSON.stringify(notify),
            webpushConfig,
          );
          console.log({ pushResp });
          return h.response({
            code: 0,
            msg: '发送成功',
            data: null,
          });
        } else {
          return h.response({
            code: -1,
            msg: '该用户未订阅通知',
            data: null,
          });
        }
      } else {
        return boom.badRequest('请求有误');
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable('服务暂不可用');
    }
  },
};
module.exports = [testPushRoute, notificationPostRoute, notificationDeleteRoute];
