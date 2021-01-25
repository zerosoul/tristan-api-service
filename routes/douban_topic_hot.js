const cheerioReq = require("cheerio-req");
// const boom = require("@hapi/boom");
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
    cheerioReq(
      {
        url: "https://www.douban.com/gallery/",
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
        let nodes = $(".trend>li");
        console.log({ cache });
        let hots = [];

        for (let i = 0; i < nodes.length; ++i) {
          let currNode = nodes.eq(i);

          let link = currNode.find("a").attr("href");
          let topic = currNode.find("a").text();
          let trends = currNode.find(".trend_icon_block i[class='trend_icon']")
            .length;
          let views = currNode.find(">span").text();
          hots.push({
            topic,
            link,
            trends,
            views,
          });
        }
        // 刷新缓存
        cache = { [`${key}`]: hots };
        resovle({ error: false, data: hots });
      }
    );
  });
};
const doubanTopicHotRoute = {
  method: "GET",
  path: "/service/douban/topic/hot",
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
module.exports = [doubanTopicHotRoute];
