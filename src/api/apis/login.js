
import axios from "../axios"

export default {
  // 账号密码登陆
  fetchLogin (data) {
    return axios.post("/passport/login", data)
  }
}
