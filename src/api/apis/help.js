import axios from "../axios"

export default {
     //查询帮助中心列表
     helpList(params) {
          return axios.get("/help/list", { params })
     },
     //删除帮助中心
     helpDel(params) {
          return axios.get("/help/del", { params })
     },
     //新增帮助中心
     helpCreate(params) {
          return axios.post("/help/create",  params )
     },
     //查询详情
     helpFind(params) {
          return axios.get("/help/find/"+ params )
     },
     //修改帮助中心
     helpUpdate(params) {
          return axios.post("/help/update",  params )
     },
}
