// const boom = require('@hapi/boom');
const { ManagementClient } = require('authing-js-sdk');
const managementClient = new ManagementClient({
  userPoolId: '6034a31382f5d09e3b5a15fa',
  secret: process.env.AUTHING_SECRET,
});
// uid:603776f87f8900ee938a6419
// authing 相关的接口
const udfGetRoute = {
  method: 'GET',
  path: '/service/authing/{username}/udf/{key?}',
  handler: async ({ params }, h) => {
    const { username = '', key = 'widget_data' } = params;
    try {
      const currUser = await managementClient.users.find({ username });
      console.log({ currUser });
      // let { users } = managementClient;
      // console.log({ username, managementClient, users });
      if (!currUser) {
        return h.response({
          code: -1,
          data: null,
          msg: '用户不存在',
        });
      }
      const resp = await managementClient.users.getUdfValue(currUser.id);
      try {
        resp[key] = JSON.parse(resp[key]);
      } catch (error) {
        resp[key] = null;
      }
      if (resp) {
        return h.response({
          code: 0,
          data: resp[key],
          msg: '请求成功',
        });
      }
    } catch (error) {
      console.log({ error });
      let { code, message } = error;
      return h.response({
        code,
        data: null,
        msg: message,
      });
    }

    return h.response({
      code: -1,
      msg: msg,
    });
  },
};
const appendVeraHistoryRoute = {
  method: 'PUT',
  path: '/service/authing/{username}/udf/vera',
  handler: async ({ params, payload }, h) => {
    const { username = '' } = params;
    try {
      const currUser = await managementClient.users.find({ username });
      console.log({ username, currUser, payload });
      if (!currUser) {
        return h.response({
          code: -1,
          data: null,
          msg: '用户不存在',
        });
      }
      const udfData = await managementClient.users.getUdfValue(currUser.id);
      console.log({ udfData });
      let key = 'vera';
      let tmp = null;
      try {
        tmp = JSON.parse(udfData[key]);
      } catch (error) {
        tmp = [];
      }
      tmp.unshift(payload);
      try {
        await managementClient.users.setUdfValue(currUser.id, {
          [key]: JSON.stringify(tmp.sort((a, b) => b.timestamp - a.timestamp)),
        });
        return h.response({
          code: 0,
          data: tmp,
          msg: '追加成功',
        });
      } catch (error) {
        let { code, message } = error;
        return h.response({
          code,
          data: null,
          msg: message,
        });
      }
    } catch (error) {
      console.log({ error });
      let { code, message } = error;
      return h.response({
        code,
        data: null,
        msg: message,
      });
    }
  },
};
module.exports = [udfGetRoute, appendVeraHistoryRoute];
