const axios = require("axios").default;
const boom = require("@hapi/boom");
const APIs = {
  must: {
    api:
      "https://api.bilibili.com/x/web-interface/popular/precious?page_size=100&page=1",
  },
  weekly: {
    api: "https://api.bilibili.com/x/web-interface/popular/series/one",
  },
  combined: {
    api: "https://api.bilibili.com/x/web-interface/popular?ps=20&pn=1",
  },
};
const getRespData = (type, data) => {
  if (type == "must" || type == "combined") {
    return data.list.map((item) => {
      const {
        pic,
        bvid,
        title,
        stat: { view, like },
      } = item;
      return {
        title,
        bvid,
        view,
        like,
        pic,
      };
    });
  }
  if (type == "weekly") {
    const {
      config: { number, label, subject, share_title, share_subtitle },
      list,
    } = data;
    return {
      info: {
        label,
        title: subject,
        share_title,
        share_subtitle,
        issue: number,
      },
      list: list.map((l) => {
        const {
          pic,
          bvid,
          title,
          stat: { view, like },
        } = l;
        return {
          title,
          bvid,
          view,
          like,
          pic,
        };
      }),
    };
  }
};
const bilibiliHotRoute = {
  method: "GET",
  path: "/service/bilibili/hot/{type?}",
  handler: async ({ params, query }, h) => {
    const { type = "must" } = params;
    const { issue = 91 } = query;
    try {
      const resp = await axios.get(APIs[type].api, {
        params: {
          number: issue,
        },
        headers: {
          Accept: "application/json",
        },
      });
      console.log({ resp });
      const { code, data } = resp.data;
      if (code == 0) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data: getRespData(type, data),
        });
      } else {
        return boom.badRequest("请求有误");
      }
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("服务暂不可用");
    }
  },
};
module.exports = [bilibiliHotRoute];
