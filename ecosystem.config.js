//pm2 配置文件
module.exports = {
  apps: [
    {
      name: "tristan-api-service",
      script: "./index.js",
      cwd: `${__dirname}`,
      watch: true,
      // ignore_watch: ["frontend/*"],
      exec_mode: "cluster",
    },
  ],
};
