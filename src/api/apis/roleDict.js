import axios from "../axios"

export default {
     // 用户字典查询
     roleList(params) {
          return axios.get("/role/allList", { params })
     },
     // 新增用户字典
     roleCreate(params) {
          return axios.post("/role/create", params)
     },
     //删除用户
     roleDelDict(data) {
          return axios.get("/role/delDict"+ '/' + data)
     },
     //查询详情
     roleFinDict(data) {
          return axios.get("/role/findDict"+ '/' + data)
     },
     //修改用户
     roleUpdateDict(data) {
          return axios.post("/role/updateDict", data)
     },
     // 查询系统菜单列表
     roleMenuList(params) {
          return axios.get("/role/menu/list", { params })
     },
     // 新增系统菜单
     roleMenuCreate(params) {
          return axios.post("/role/menu/create", params)
     },
     // 修改系统菜单
     roleMenuUpdate(params) {
          return axios.post("/role/menu/update", params)
     },
     //删除系统菜单
     roleDelMenu(data) {
          return axios.get("/role/delMenu/"+ data)
     },
     //查询详情
     roleFindMenu(data) {
          return axios.get("/role/findMenu/"+ data)
     },
     // 返回枚举类
     roleGetEnum(params) {    
          return axios.get("/role/getEnum", { params })
     },

     // 查询路由树形菜单(已拥有)
     roleTreeMenu(params) {
          return axios.get("/role/tree/menu", { params })
     },
     // 查询路由树形菜单(未拥有)
     roleNotMenu(params) {
          return axios.get("/role/not/Menu", { params })
     },
     // 权限分配提交
     roleTreeCreate(params) {
          return axios.post("/role/tree/create", params)
     },
}