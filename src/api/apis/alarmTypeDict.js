import axios from "../axios"

export default {
     // 字典查询
     alarmTypeDictFindQuery(params) {
          return axios.post( "/alarmTypeDict/findQuery",  params )
     },
     // 新增字典
     alarmTypeDictAddDict(params) {
          return axios.post("/alarmTypeDict/addDict", params)
     },
     //删除字典
     alarmTypeDictDelete(data) {
          return axios.delete("/alarmTypeDict/delete", {data})
     },
     //查询详情
     alarmTypeDictFindOne(data) {
          return axios.get("/alarmTypeDict/findOne"+ '/' + data)
     },
     //修改
     alarmTypeDictUpdate(data) {
          return axios.post("/alarmTypeDict/update", data)
     },
      // 查看所有子类型
      alarmTypeDictFindSub(params) {
          return axios.post("/alarmTypeDict/findSub", params)
     },
     //查询详情
     alarmTypeDictFindSubCode(data) {
          return axios.get("/alarmTypeDict/findSubCode/" + data)
     },
}