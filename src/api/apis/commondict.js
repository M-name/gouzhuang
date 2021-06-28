import axios from "../axios"

export default {
  // 通用字典（一级）查询
  allFirst (params) {
    return axios.get("/common/allFirst",{params})
  },
  // 删除字典（一级）
  delFirst (data) {
    return axios.post("/common/delFirst" +'/'+data)
  },
  //获取字典详情（一，二级）
  findDict (data) {
    return axios.get("/common/findDict"+'/'+data)
  },
  //新增字典（一级）
  createFirst (params) {
    return axios.post("/common/createFirst", params)
  },
  //修改字典（一，二级）
  updateDict (params) {
    return axios.post("/common/updateDict", params)
  },
  // 通用字典（二级）查询
  allSecond (params) {
    return axios.get("/common/allSecond", {params})
  },
  // 删除字典（二级）
  delSecond (data) {
    return axios.post("/common/delSecond" +'/'+data)
  },
  //新增字典（二级）
  createSecond (params) {
    return axios.post("/common/createSecond", params)
  },
}