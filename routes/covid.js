// const axios = require("axios").default;
const axios = require('axios').default;
const boom = require('@hapi/boom');
const covidRoute = {
  method: 'GET',
  path: '/service/covid',
  handler: async (params, h) => {
    let covid_data = null;
    function hello_covid_data(obj) {
      covid_data = obj.data;
      console.log({ covid_data });
    }
    try {
      const res = await axios.get(`http://43.250.238.179:9090/showData?callback=hello_covid_data`);

      console.log({ res });
      let { status, data } = res;
      if (status == 200) {
        eval(data);
      }
    } catch (error) {
      console.error(error);
      return boom.serverUnavailable('服务暂不可用');
    }

    const resp = h.response({
      code: 0,
      msg: '正常响应',
      data: covid_data,
    });
    resp.type('application/json');
    resp.header('from', 'tristan-service-ua');
    return resp;
  },
};
module.exports = [covidRoute];
