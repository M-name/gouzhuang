
import axios from "../axios"
export default {
  // 查询物业人员列表
  propertyAll (data) {
    return axios.post("/manage/all", data)
  },
  // 新增物业人员
  propertyCreate (data) {
    return axios.post("/manage/create", data)
  },
  // 返回所属部门和在岗状态枚举
  propertyFindEnum (data) {
    return axios.get("/manage/findAddEnum", data)
  },


  // 查询某一个物业人员信息
  propertyFindOne(data) {
    return axios.get("/manage/find"+ '/' + data)
  },
  // 修改物业人员信息
  propertyUpdate(data) {
    return axios.post("/manage/update", data)
  },
}

