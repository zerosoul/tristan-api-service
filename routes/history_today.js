const cheerioReq = require("cheerio-req");
// const boom = require("@hapi/boom");
let cache = {};
const getDetail = (url) => {
  return new Promise((resolve, reject) => {
    cheerioReq(
      {
        url,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        },
      },
      (err, $) => {
        if (err) {
          console.error(err);
          reject(null);
        }
        let title = $(".sec-title");
        let contents = $(".event-detail article p");
        let arrTxt = [];
        for (let i = 0; i < contents.length; ++i) {
          let currNode = contents.eq(i);

          let txt = currNode.text().trim();
          if (txt) {
            arrTxt.push(txt);
          }
        }
        console.log({ title });
        let obj = {
          title: title.text(),
          content: arrTxt,
        };
        resolve(obj);
      }
    );
  });
};
const getLinks = (d) => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    // 每隔一天请求一次
    let key = `${date.getMonth() + 1}${date.getDate()}`;
    if (cache[key]) {
      resolve({
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
        url: `https://m.8684.cn/today_d${d}`,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        },
      },
      async (err, $) => {
        if (err) {
          console.error(err);
          reject({ error: true, msg: "出错啦" });
        }
        let nodes = $(".event-list ol li");
        console.log({ nodes });
        let events = [];
        // let details=[];
        for (let i = 0; i < nodes.length; ++i) {
          let currNode = nodes.eq(i);
          let date = currNode.find(".date").text();
          let event = currNode.find(".event").attr("title");
          let link = currNode.find(".event").attr("href");

          events.push({
            date,
            event,
            link: `https://m.8684.cn${link}`,
          });
          // details.push(getDetail(`https://m.8684.cn${link}`));
        }
        let newData = await Promise.all(
          events.map(async (evt) => {
            const tmp = await getDetail(evt.link);
            evt.detail = tmp;
            return evt;
          })
        );
        // 刷新缓存
        cache = { [`${key}`]: events };
        resolve({ error: false, data: newData });
      }
    );
  });
};
const getTodayDate = () => {
  let tmp = new Date();
  let m = tmp.getMonth() + 1;
  let date = tmp.getDate();
  let mStr = m < 10 ? `0${m}` : m;
  let dateStr = date < 10 ? `0${date}` : date;
  return `${mStr}${dateStr}`;
};
const historyTodayRoute = {
  method: "GET",
  path: "/service/history/today/{date?}",
  handler: async ({ params }, h) => {
    let d = getTodayDate();
    const { date = d } = params;
    const { error, data, msg } = await getLinks(date);
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
module.exports = [historyTodayRoute];
