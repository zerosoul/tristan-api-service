const cheerioReq = require('cheerio-req');
const boom = require('@hapi/boom');
// 公众号热文
let cache = {};
const getLinks = () => {
  return new Promise((resovle, reject) => {
    let date = new Date();
    // 每隔一小时请求一次
    let key = `${date.getMonth() + 1}${date.getDate()}${date.getHours()}`;
    if (cache[key]) {
      resovle({
        error: false,
        data: cache[key].map((obj) => {
          obj.cache = true;
          return obj;
        }),
      });
      return;
    }
    cheerioReq('https://qnmlgb.tech/', (err, $) => {
      if (err) {
        console.error(err);
        reject({ error: true, msg: '出错啦' });
      }
      // let $links = [...$("#pl_top_realtimehot .td-02 a")].map((link) => {
      //   return { title: link.innerText, link: link.href };
      // });
      let $links = $('.hot-a');
      let hots = [];
      for (let i = 0; i < $links.length; ++i) {
        let href = $links.eq(i).attr('href');
        let txt = $links.eq(i).text();
        hots.push({
          title: txt,
          link: href,
        });
        // console.log($links.eq(i).text(), $links.eq(i).attr("href"));
      }
      // 刷新缓存
      cache = { [`${key}`]: hots };
      resovle({ error: false, data: hots });
    });
  });
};
const mpHotRoute = {
  method: 'GET',
  path: '/service/mp/hot',
  handler: async (req, h) => {
    const { error, data, msg } = await getLinks();
    if (error) {
      return h.response({
        code: -1,
        msg: msg,
      });
    }
    return h.response({
      code: 0,
      data: data,
      msg: '请求成功',
    });
  },
};
module.exports = [mpHotRoute];
