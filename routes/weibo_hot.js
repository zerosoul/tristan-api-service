const cheerioReq = require("cheerio-req");
// const boom = require("@hapi/boom");
let cache = {};

const getLinks = () => {
  return new Promise((resovle, reject) => {
    let date = new Date();
    // 每隔半小时请求一次
    let key = `${date.getMonth() + 1}${date.getDate()}${date.getHours()}${
      date.getMinutes() < 30 ? 0 : 1
    }`;
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
    cheerioReq(
      {
        url: "https://s.weibo.com/top/summary?cate=realtimehot",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        },
      },
      (err, $) => {
        if (err) {
          console.error(err);
          reject({ error: true, msg: "出错啦" });
        }
        // let $links = [...$("#pl_top_realtimehot .td-02 a")].map((link) => {
        //   return { title: link.innerText, link: link.href };
        // });
        let $links = $("#pl_top_realtimehot .td-02");
        let $tags = $("#pl_top_realtimehot .td-03");
        let hots = [];
        for (let i = 0; i < $links.length; ++i) {
          let href = $links.eq(i).find("a").attr("href");
          if (href.startsWith("javascript")) {
            // 剔除广告
            continue;
          }
          let txt = $links.eq(i).find("a").text();
          let heat = $links.eq(i).find("span").text();
          let tag = $tags.eq(i).text();
          // 刷新缓存
          cache = { [`${key}`]: hots };
          hots.push({
            title: txt,
            link: href,
            hot: tag,
            heat,
          });
          // console.log($links.eq(i).text(), $links.eq(i).attr("href"));
        }
        resovle({ error: false, data: hots });
      }
    );
  });
};
const weiboHotRoute = {
  method: "GET",
  path: "/service/weibo/hot",
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
      msg: "请求成功",
    });
  },
};
module.exports = [weiboHotRoute];
