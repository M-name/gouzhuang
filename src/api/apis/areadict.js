import axios from "../axios"

export default {
  // 查询区域(市和区县)字典表
  allCity(params) {
    return axios.get("/area/allCity", { params })
  },
  // 查询区域(省)字典表
  allProvince(params) {
    return axios.get("/area/allProvince", { params })
  },
  // 新增区域（市和区县）
  createCity(data) {
    return axios.post("/area/createCity", data)
  },
  // 新增区域（省）
  createProvince(data) {
    return axios.post("/area/createProvince", data)
  },
  // 删除（省和市）
  delProvince(data) {
    return axios.get("/area/delProvince" + '/' + data)
  },
  // 删除（区）
  delCounty(data) {
    return axios.get("/area/delCounty" + '/' + data)
  },
  // 修改区域
  updatePlaceDict(params) {
    return axios.post("/area/updateDict", params)
  },
  // 获取详情
  findPlaceDict(data) {
    return axios.get("/area/findDict" + '/' + data)
  },
  // 省市县级联查询
  areaListAll(data) {
    return axios.get("/area/listAll", data)
  },
}