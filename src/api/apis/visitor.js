import axios from "../axios"

export default {
      // 查询详情
      findByVisitCode(params) {
          return axios.get('/visit/findByVisitCode/'+params)
     },
      // 放行管理分页查询
      visitFindPage(params) {
          return axios.post('/visit/findPage',params)
     },
     // 放行记录分页查询
     visitFindPageLog(params) {
          return axios.post('/visit/findPageLog',params)
     },
     // 放行
     visitUpdate(params) {
          return axios.get('/visit/update',{params})
     },
      // 批量放行
      visitUpdateBatch(params) {
          return axios.post('/visit/updateBatch',params)
     },
     // 批量取消
     userUpdateCancel(params) {
          return axios.get('/visit/updateCancel?ids='+params)
     },
     // 获取枚举
     userGetEnum(params) {
          return axios.get('/visit/getEnum',params)
     },
}