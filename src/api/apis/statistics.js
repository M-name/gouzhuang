
import axios from "../axios"
export default {
  // 垃圾桶首页统计
  countWS(params) {
    return axios.get("/statistics/countWS", { params })
  },
  // 井盖首页统计
  countCover(params) {
    return axios.get("/statistics/countCover", { params })
  },
  // 设备运行状态
  pieDevice(params) {
    return axios.get("/statistics/pieDevice", { params })
  },
   // 设备建设
  countDevice(params) {
    return axios.get("/statistics/countDevice", { params })
  },
  // 车辆
  countCar(params) {
    return axios.get("/statistics/countCar", { params })
  },
   // 人员
   countPerson(params) {
    return axios.get("/statistics/countPerson", { params })
  },
    // 垃圾桶详情
    shakeDetail(params) {
      return axios.get("/statistics/shakeDetail", { params })
    },
    // 井盖详情
    coverDetail(params) {
      return axios.get("/statistics/coverDetail", { params })
    },
}

