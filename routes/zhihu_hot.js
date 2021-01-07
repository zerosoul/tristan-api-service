// const cheerioReq = require("cheerio-req");
const boom = require("@hapi/boom");
const axios = require("axios").default;

// 知乎热榜 total zvideo science digital sport fashion film school car depth depth focus
const zhihuHotRoute = {
  method: "GET",
  path: "/service/zhihu/hot/{cate?}",
  handler: async ({ params }, h) => {
    const { cate = "total" } = params;
    // https://www.zhihu.com/api/v3/feed/topstory/hot-lists/digital?limit=50&desktop=true
    try {
      const resp = await axios.get(
        `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/${cate}?limit=20&desktop=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const {
        data: { data, paging, fresh_text },
      } = resp;
      console.log({ resp, data, fresh_text, paging });
      return h.response({
        code: 0,
        data: data.map((d) => {
          const {
            target: { id, title, excerpt },
            detail_text,
            children: [{ thumbnail }],
          } = d;
          console.log({ d });
          return {
            id,
            title,
            intro: excerpt,
            thumbnail,
            url: `//www.zhihu.com/question/${id}`,
            hot_count: parseFloat(detail_text),
          };
        }),
        msg: fresh_text,
      });
    } catch (error) {
      console.log({ error });
      return h.response({
        code: -1,
        msg: "请求有误",
      });
    }
    // if (error) {
    // }
  },
};
const zhihuHotListRoute = {
  method: "GET",
  path: "/service/zhihu/hot/tabs",
  handler: async (req, h) => {
    // https://www.zhihu.com/api/v3/feed/topstory/hot-lists/digital?limit=50&desktop=true
    try {
      const resp = await axios.get(
        `https://www.zhihu.com/api/v3/feed/topstory/hot-lists`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const {
        data: { data },
      } = resp;
      console.log({ data });
      return h.response({
        code: 0,
        data: data.map((d) => {
          const { name, identifier } = d;
          return {
            name,
            identifier,
          };
        }),
        msg: "获取tabs内容成功",
      });
    } catch (error) {
      console.log({ error });
      return h.response({
        code: -1,
        msg: "请求有误",
      });
    }
    // if (error) {
    // }
  },
};
module.exports = [zhihuHotRoute, zhihuHotListRoute];
