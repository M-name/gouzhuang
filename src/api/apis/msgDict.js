import axios from "../axios"

export default {
     // 查询消息类型(一级)字典
     msgDictAllFirst(params) {
          return axios.get('/msg/dict/allFirst', { params })
     },
     // 查询消息类型(二级)字典
     msgDictAllSecond(params) {
          return axios.get('/msg/dict/allSecond', { params })
     },
     // 新增消息类型(一级)字典
     msgDictCreateFirst(params) {
          return axios.post('/msg/dict/createFirst', params)
     },
     // 新增消息类型(二级)字典
     msgDictCreateSecond(params) {
          return axios.post('/msg/dict/createSecond', params)
     },
     // 删除一级字典
     msgDictDelFirst(params) {
          return axios.get('/msg/dict/delFirst/'+params)
     },
     // 删除二级字典
     msgDictDelSecond(params) {
          return axios.get('/msg/dict/delSecond/'+params)
     },
     // 查询某一个字典
     msgDictFindDict(params) {
          return axios.get('/msg/dict/findDict/'+params)
     },
     // 修改字典
     msgDictUpdateDict(params) {
          return axios.post('/msg/dict/updateDict', params)
     },
}