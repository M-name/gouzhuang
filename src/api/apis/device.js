import axios from "../axios"

export default {
     // 字典查询
     deviceGetEnum(params) {
          return axios.get( "/device/getEnum", { params })
     },
     // 设备告警数据
     deviceAlarmWS(params) {
          return axios.post("/device/alarmWS", params)
     },
     // 设备条件查询
     deviceFindByQuery(params) {
          return axios.post("/device/findByQuery", params)
     },
     // 井盖设备运行数据
     deviceFindCover(params) {
          return axios.post("/device/findCover", params)
     },
     // 分类垃圾桶设备运行数据
     deviceFindWS(params) {
          return axios.post("/device/findWS", params)
     },
     // 新增设备档案
     deviceSave(params) {
          return axios.post("/device/save", params)
     },
     // 修改
     deviceUpdate(params) {
          return axios.post("/device/update", params)
     },
      //设备统计数据
      deviceStatistics(params) {
          return axios.get("/device/statistics" + '/' + params)
     },
     //设备详情
     deviceFindOne(params) {
          return axios.get("/device/findOne" + '/' + params)
     },
}