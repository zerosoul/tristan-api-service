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
const veraHistoryUserListRoute = {
  method: 'GET',
  path: '/service/authing/vera/{username}/userlist',
  handler: async ({ params }, h) => {
    const { username = '' } = params;
    try {
      const currUser = await managementClient.users.find({ username });
      console.log({ username, currUser });
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
      let tmp = [];
      try {
        tmp = JSON.parse(udfData[key]);
      } catch (error) {
        tmp = [];
      }
      let users = [];
      tmp.forEach((t) => {
        console.log({ t });
        let { host = null, username = null, participants = [] } = t;
        let uns = [...new Set([host, username, ...participants])];
        users.push(...uns);
      });
      users = [...new Set(users)].filter((u) => {
        return u && u !== username;
      });
      let promises = users.map((u) => {
        return managementClient.users.find({ username: u });
      });
      const resps = await Promise.all(promises);
      const tracerIds = Object.values(
            await managementClient.users.getUdfValueBatch(resps.map((it) => it.id))
          ).map((it) => it.notification ? it.notification : '');

      return h.response({
        code: 0,
        data: resps.map((user, idx) => {
          let { username, name, nickname, photo } = user;
          return {
            username,
            name,
            nickname,
            photo,
            tracerId: tracerIds[idx]
          };
        }),
        msg: '获取用户列表成功',
      });
      // try {
      //   await managementClient.users.setUdfValue(currUser.id, {
      //     [key]: JSON.stringify(tmp.sort((a, b) => b.timestamp - a.timestamp)),
      //   });
      //   return h.response({
      //     code: 0,
      //     data: tmp,
      //     msg: '追加成功',
      //   });
      // } catch (error) {
      //   let { code, message } = error;
      //   return h.response({
      //     code,
      //     data: null,
      //     msg: message,
      //   });
      // }
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
module.exports = [udfGetRoute, appendVeraHistoryRoute, veraHistoryUserListRoute];
