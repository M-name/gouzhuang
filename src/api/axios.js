/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2019-01-02
 * Description: 文件描述
 */
import axios from "axios"
import QS from 'qs'
import Cookies from "js-cookie"
import NProgress from "nprogress"
import { Message } from "element-ui"
// axios默认配置
axios.defaults.timeout = 20000 // 超时时间
axios.defaults.baseURL = process.env.API_HOST

// http request 拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers["Content-Type"] = "application/json;charset=UTF-8"
  // if (Cookies.get("access_token")) {

  // }
  if (localStorage.getItem("userInfo")) {
    config.headers['headerLoginType'] = 0;
    config.headers['headerUserToken'] = JSON.parse(localStorage.getItem("userInfo")).userUniqueToken;
    config.headers['headerUserCode'] = JSON.parse(localStorage.getItem("userInfo")).userCode;
    config.headers['Access-Control-Allow-Origin'] = '*';
    
  }
  return config
},
  error => {
    console.log(error)
    return Promise.reject(error.response)
  })
// http response 拦截器
axios.interceptors.response.use(
  response => {
    
    NProgress.done()
    if (response.data.status == 499) {
      location.reload();
    Cookies.remove("token")
    }
    // if (response.config.responseType === 'blob') {
    //   const fileName = decodeURI(
    //     response.headers['content-disposition'].split('filename=')[1]
    //   )
    //   // 返回文件流内容，以及获取文件名, response.headers['content-disposition']的获取, 默认是获取不到的,需要对服务端webapi进行配置
    //   return Promise.resolve({ data: response.data, fileName: fileName })
    // }
    if (response.data.code === 11000) {
      Cookies.set("access_token", response.data.message, { expires: 1 / 12 })
      return Promise.resolve()
    } else if (response.data.code === 10000) { // 约定报错信息
      Message({
        message: response.data.message,
        type: "warning"
      })
      return Promise.reject(response)
    } else {
      return Promise.resolve(response)
    }
  },
  error => {
    console.log(error)
    if (error.response.status === 404) {
      Message({
        message: "请求地址出错",
        type: "warning"
      })
    } else
      if (error.response.status === 401) {
        Message({
          message: error.response.data.message,
          type: "warning"
        })
        Cookies.remove("access_token")
        setTimeout(() => {
          location.reload()
        }, 3000)
      }
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })
export function get(url, params, that) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType: that
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export default axios
