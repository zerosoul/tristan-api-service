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
  path: '/service/authing/{userId}/udf/{key?}',
  handler: async ({ params }, h) => {
    const { userId = 0, key = 'widget_data' } = params;
    // let { users } = managementClient;
    // console.log({ userId, managementClient, users });

    // try {
    const resp = await managementClient.users.getUdfValue(userId);
    // } catch (error) {
    //   console.log({ error });
    // }
    console.log(resp);
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
