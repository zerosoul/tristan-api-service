const axios = require("axios").default;
const boom = require("@hapi/boom");

const douyinHotRoute = {
  method: "GET",
  path: "/service/douyin/hot",
  handler: async ({}, h) => {
    try {
      const resp = await axios.get(
        "https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/aweme/",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log({ resp });
      const { status_code, aweme_list } = resp.data;
      if (status_code == 0) {
        return h.response({
          code: 0,
          msg: "正常响应",
          data: aweme_list.map((item) => {
            const {
              // aweme_info,
              aweme_info: {
                desc,
                share_url,
                video: {
                  play_addr,
                  dynamic_cover: { url_list },
                },
              },
              hot_value,
            } = item;
            return {
              title: desc,
              play_url: play_addr.url_list[0],
              cover: url_list[0],
              link: share_url,
              heat: hot_value,
            };
          }),
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
module.exports = [douyinHotRoute];
