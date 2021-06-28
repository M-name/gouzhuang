import axios from "../axios"

export default {
     // 订阅条件查询
     alarmTypeSubscribeFindQuery(params) {
          return axios.post( "/alarmTypeSubscribe/findQuery",  params )
     },
     // 新增订阅
     alarmTypeSubscribeAdd(params) {
          return axios.post("/alarmTypeSubscribe/add", params)
     },
     //告警订阅删除
     alarmTypeSubscribeDelete(data) {
          return axios.delete("/alarmTypeSubscribe/delete", {data})
     },
     //告警订阅修改
     alarmTypeSubscribeUpdate(params) {
          return axios.get("/alarmTypeSubscribe/update", {params})
     },
     //查询详情
     alarmTypeSubscribeSelect(data) {
          return axios.get("/alarmTypeSubscribe/updateSelect"+ '/' + data)
     },
     //字典查询
     alarmTypeSubscribeGetEnum(data) {
          return axios.get("/alarmTypeSubscribe/getEnum", data)
     },
}