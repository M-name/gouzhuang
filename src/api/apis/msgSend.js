import axios from "../axios"

export default {
     // 消息批次列表
     msgSendBatchList(params) {
          return axios.post('/msg/send/batchList', params)
     },
     // 消息发送记录
     msgSendDetailList(params) {
          return axios.post('/msg/send/detailList', params)
     },
     // 发送普通消息
     msgSendPlain(params) {
          return axios.post('/msg/send/plain', params)
     },
     // 发送模板消息
     msgSendTemplate(params) {
          return axios.post('/msg/send/template', params)
     },
     // 左侧发送统计
     msgSendLeftCensus(params) {
          return axios.get('/msg/send/leftCensus', { params })
     },
      // 右侧发送统计
      msgSendRightCensus(params) {
          return axios.get('/msg/send/rightCensus', { params })
     },
     // 查询某一个模板消息
     msgSendFind(params) {
          return axios.get('/msg/send/find/'+params)
     },
}