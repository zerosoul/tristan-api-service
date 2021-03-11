// const boom = require('@hapi/boom');
const { ManagementClient } = require('authing-js-sdk');
const managementClient = new ManagementClient({
  userPoolId: '6034a31382f5d09e3b5a15fa',
  secret: process.env.AUTHING_SECRET,
});
// uid:603776f87f8900ee938a6419
// authing 相关的接口
const authingRoute = {
  method: 'GET',
  path: '/service/authing/{username}/udf/{key?}',
  handler: async ({ params }, h) => {
    const { username = '', key = 'widget_data' } = params;
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
    // try {
    const resp = await managementClient.users.getUdfValue(currUser.id);
    // } catch (error) {
    //   console.log({ error });
    // }
    // console.log(resp);
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
    return h.response({
      code: -1,
      msg: msg,
    });
  },
};
module.exports = [authingRoute];
