import axios from "../axios"

export default {
     // 人员进出记录
     findPersonEntranceLog(params) {
          return axios.post("/face/selectPersonEntranceLog", params)
     },
     //车辆进出记录
     findVehicleEntranceLog(data) {
          return axios.post("/face/selectVehicleEntranceLog", data)
     },
     //查询首页车辆进出数据
     faceVehicle(data) {
          return axios.get("/face/vehicle", data)
     },
     //查询首页车辆进出趋势
     vehicleTrend(data) {
          return axios.get("/face/vehicle/trend?type=" + data)
     },
}