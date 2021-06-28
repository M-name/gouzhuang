
import axios from "../axios"
export default {
  // 处理回复接口
  dealReply (data) {
    return axios.post('/suggest/dealReply', data)
  },
  // 分页查询投诉建议列表
  suggestFindPage (data) {
    return axios.post('/suggest/findPage', data)
  },
  // 查询详情
  suggestFindOne (data) {
    return axios.get("/suggest/findOne/"+data)
  },
}

