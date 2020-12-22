const cheerioReq = require("cheerio-req");
const boom = require("@hapi/boom");

const getLinks = () => {
  return new Promise((resovle, reject) => {
    cheerioReq("https://s.weibo.com/top/summary?cate=realtimehot", (err, $) => {
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
        hots.push({
          title: txt,
          link: href,
          hot: tag,
          heat,
        });
        // console.log($links.eq(i).text(), $links.eq(i).attr("href"));
      }
      resovle({ error: false, data: hots });
    });
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
