import axios from "../axios"

export default {
     // 返回所需枚举
     msgTemplateFindEnum(params) {
          return axios.get('/msg/template/findEnum', { params })
     },
     // 新增消息模板
     msgTemplateCreate(params) {
          return axios.post('/msg/template/create', params)
     },
     // 查询某一个模板
     msgTemplateFind(params) {
          return axios.get('/msg/template/find/'+params)
     },
     // 消息模板记录
     msgTemplateList(params) {
          return axios.post('/msg/template/list', params)
     },
     // 消息类型级联查询
     msgTemplateTypeList(params) {
          return axios.get('/msg/template/typeList', { params })
     },
     // 修改消息模板
     msgTemplateUpdate(params) {
          return axios.post('/msg/template/update', params)
     },
     // 是否启用消息模板
     msgTemplateIsEnabled(params) {
          return axios.get('/msg/template/isEnabled', { params })
     },
     
}