const path = require('path');
// const fs = require("fs");
const dotenv = require('dotenv');
const fs = require('fs');
const Hapi = require('@hapi/hapi');
const router = require('hapi-router');

const hapio = require('hapio');

const { setupSocket } = require('./ws/notification');

const devEnvFile = `${__dirname}/.env.local`;
const proEnvFile = `${__dirname}/.env`;

// 检查配置文件
if (process.env.NODE_ENV == 'production') {
  console.log('运行在pro环境');
  if (!fs.existsSync(proEnvFile)) {
    console.error('production配置文件不存在');
    process.exit(-1);
  }
}
if (process.env.NODE_ENV == 'development') {
  console.log('运行在dev环境');
  if (!fs.existsSync(devEnvFile)) {
    console.error('development配置文件不存在');
    process.exit(-1);
  }
}
dotenv.config({
  path: process.env.NODE_ENV == 'development' ? devEnvFile : proEnvFile,
});
// 跨域请求设置
const AllowDomains = process.env.NODE_ENV == 'development' ? ['*'] : ['*'];
//  'chrome-extension://ccegbnlnelhgaefimiaklaindffpfcmh',
//   'https://zerosoul.github.io',
//   'https://yangerxiao.com',
//   'https://*.yangerxiao.com',
//   'https://nicegoodthings.com',
//   'https://*.nicegoodthings.com',
const init = async () => {
  const server = Hapi.server({
    port: 3008,
    host: 'localhost',
    routes: {
      state: {
        failAction: 'log',
      },
      cors: {
        origin: AllowDomains,
      },
    },
  });
  await server.register({
    plugin: router,
    options: {
      routes: 'routes/*.js', // uses glob to include files
    },
  });
  
  await server.register(hapio);

  setupSocket(server.plugins.hapio.io);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
