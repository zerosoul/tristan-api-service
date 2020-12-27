// const axios = require("axios").default;
const boom = require("@hapi/boom");
const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

const douyinHotRoute = {
  method: "GET",
  path: "/service/pwa",
  handler: async ({ query, payload }, h) => {
    const { url } = query;
    console.log({ url });
    try {
      const chrome = await chromeLauncher.launch({
        chromeFlags: ["--headless"],
      });
      const options = {
        logLevel: "info",
        output: "html",
        // output: "json",
        onlyCategories: ["pwa"],
        port: chrome.port,
      };
      const runnerResult = await lighthouse(url, options);

      // const reportJson = runnerResult.report;
      // `.report` is the HTML report as a string
      const reportHtml = runnerResult.report;
      // fs.writeFileSync("lhreport.html", reportHtml);

      // // `.lhr` is the Lighthouse Result as a JS object
      // console.log("Report is done for", runnerResult.lhr.finalUrl);
      // console.log(
      //   "Performance score was",
      //   runnerResult.lhr.categories.performance.score * 100
      // );

      await chrome.kill();
      // return h.response({
      //   code: 0,
      //   msg: "正常响应",
      //   data: JSON.parse(reportJson),
      // });
      return h.response(reportHtml).type("text/html");
    } catch (error) {
      console.log({ error });
      return boom.serverUnavailable("服务暂不可用");
    }
  },
};
module.exports = [douyinHotRoute];
