import axios from "../axios"

export default {
     // 楼栋字典查询
     houseList(params) {
          return axios.get("/build/allList", { params })
     },
     // 新增楼栋字典
     houseCreate(params) {
          return axios.post("/build/create", params)
     },
     //删除楼栋
     houseDelDict(data) {
          return axios.get("/build/delDict" + '/' + data)
     },
     //查询详情
     houseFinDict(data) {
          return axios.get("/build/findDict" + '/' + data)
     },
     //修改楼栋
     houseUpdateDict(data) {
          return axios.post("/build/updateDict", data)
     },
     //楼幢级联查询
     houseListAll(params) {
          return axios.get("/build/listAll", { params })
     },
     // 查询一房一档所需枚举
     buildFindEnum(data) {
          return axios.post('/build/findEnum', data)
     },
      // 查询一房一档列表
      buildCheckList(data) {
          return axios.post('/build/check/list', data)
     },
      // 新增排查记录
      buildCheckCreate(data) {
          return axios.post('/build/check/create', data)
     },
     //排查记录列表
     buildCheckLog(params) {
          return axios.get('/build/check/log', { params })
     },
      // 查询某一个房屋档案
      buildFindFiles(data) {
          return axios.get("/build/findFiles" + '/' + data)
     },
}