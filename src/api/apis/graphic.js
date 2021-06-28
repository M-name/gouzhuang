import axios from "../axios"

export default {
     // 上传
     upload(params) {
          return axios.post('/cos/upload', params)
     },
     // 删除新闻
     deleteNews(params) {
          return axios.post("/news/delete" + '/' + params)
     },
     // 统计新闻分享次数
     countNews(params) {
          return axios.post("/news/count", params)
     },
     //批量删除新闻
     deleteBatch(data) {
          return axios.post("/news/deleteBatch", data)
     },
     //查询枚举
     findAlleuemsNews(params) {
          return axios.get("/news/findAlleuems", { params })
     },
     //查询新闻
     findByPageNews(params) {
          return axios.post("/news/findByPage", params)
     },
     //创建新闻
     saveNews(params) {
          return axios.post("/news/save", params)
     },
     //创建并发布新闻
     publishNews(params) {
          return axios.post("/news/publish", params)
     },
     //修改新闻
     updateNews(params) {
          return axios.post("/news/update", params)
     },
     //修改并发布新闻
     publisUpdateNews(params) {
          return axios.post("/news/publishupdate", params)
     },
     //查询新闻(管理员)
     findByIdNews(params) {
          return axios.get("/news/findById" + '/' + params)
     },
     //下线
     offLineUpdate(params) {
          return axios.post("/news/offLineUpdate", params)
     },
}
