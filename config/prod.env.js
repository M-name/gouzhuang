'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_HOST:'"http://47.118.43.170:8080/api"', //正式
  //  API_HOST:'"http://47.118.43.170:8080/api"', // 测试
  VERSION_CONTROL: false  // yarn build 开启版本控制,开启之后缓存就得每次重新创建,build 的时候得不到优化
}
