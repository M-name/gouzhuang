import axios from "../axios"

export default {
      // 查询费用类别字典(一级)
      feeAllFirst(params) {
          return axios.get('/fee/allFirst',{params})
     },
      // 查询费用类别字典(二级)
      feeAllSecond(params) {
          return axios.get('/fee/allSecond',{params})
     },
      // 新增费用类别字典(一级)
      feeCreateFirst(params) {
          return axios.post('/fee/createFirst',params)
     },
      // 新增费用类别字典(二级)
      feeCreateSecond(params) {
          return axios.post('/fee/createSecond',params)
     },
      // 删除一级字典
      feeDelFirst(params) {
          return axios.get('/fee/delFirst/'+params)
     },
      // 删除二级字典
      feeDelSecond(params) {
          return axios.get('/fee/delSecond/'+params)
     },
      // 查询某一个字典
      feeFind(params) {
          return axios.get('/fee/find/'+params)
     },
     // 查询费用字典所需枚举
     feeFindEnum(params) {
          return axios.get('/fee/findEnum',{params})
     },
     // 修改字典
     feeUpdate(params) {
          return axios.post('/fee/update',params)
     },
}