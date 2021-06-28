import axios from "../axios"

export default {
     // 部门字典查询
     deptList(params) {
          return axios.get( "/dept/allList", { params })
     },
     // 新增部门字典
     deptCreate(params) {
          return axios.post("/dept/create", params)
     },
     //删除部门
     deptDelDict(data) {
          return axios.get("/dept/delDict"+ '/' + data)
     },
     //查询详情
     deptFinDict(data) {
          return axios.get("/dept/findDict"+ '/' + data)
     },
     //修改部门
     deptUpdateDict(data) {
          return axios.post("/dept/updateDict", data)
     },
}