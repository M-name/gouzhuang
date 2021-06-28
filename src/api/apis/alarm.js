import axios from "../axios"

export default {
     // 告警查询
     alarmFindQuery(params) {
          return axios.post( "/alarm/findQuery", { params })
     },
     //告警删除
     alarmDelete(data) {
          return axios.delete("/alarm/delete", data)
     },
     //告警处理
     alarmUpdate(data) {
          return axios.post("/alarm/update", data)
     },
     // 查看详情
     alarmFindDetails(params) {
          return axios.get( "/alarm/findDetails/"+params)
     },
     // 查看告警
     alarmFindOne(params) {
          return axios.get( "/alarm/findOne/"+params)
     },
     //告警统计
     alarmStatistics(data) {
          return axios.get("/alarm/statistics", data)
     },
     //字典查询
     alarmGetEnum(data) {
          return axios.get("/alarm/getEnum", data)
     },
     //员工查询
     alarmGetStaff(data) {
          return axios.get("/alarm/getStaff", data)
     },
}