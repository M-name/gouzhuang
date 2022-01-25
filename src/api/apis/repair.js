
import axios from "../axios"

export default {
  // 查询工单处理及完成列表
  getRepairList(params) {
    return axios.post("/repair/selectByStatusPage", params)
  },
  // 工单处理完成
  repairProcessed(params) {
    return axios.post("/repair/processed", params)
  },
  // 查询工单列表
  getRepairProcessList(data) {
    return axios.post("/repair/selectList" + '?page=' + data.page + '&pageSize=' + data.pageSize, data)
  },
  // 查询枚举
  findRepairAlleuems(data) {
    return axios.get("/repair/findAlleuems", data)
  },
  // 查询工作人员历史工单记录
  selectByCodePage(data) {
    return axios.post("/repair/selectByCodePage" + '?page=' + data.page + '&pageSize=' + data.pageSize, data)
  },
  // 查询工单详情及编辑数据回显
  selectOrderDetails(data) {
    return axios.get("/repair/selectOrderDetails" + '/' + data)
  },
  // 导出报表
  downloadExcel(data) {
    axios
      .get("/repair/downloadExcel", {
        params: data,
        responseType: 'blob'
      })
      .then(res => {
        var blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        // 针对于IE浏览器的处理, 因部分IE浏览器不支持createObjectURL
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, res.fileName)
        } else {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = '报修处理记录' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
    // return axios.get(downloadExcel, data, 'blob')
  },
  // 创建工单
  saveRepair(data) {
    return axios.post("/repair/save", data)
  },
  // 编辑工单
  repairUpdateRepair(data) {
    return axios.post("/repair/updateRepair", data)
  },
  // 退回工单
  cancelRepair(data) {
    return axios.post("/repair/cancel", data)
  },
  // 创建报事
  repairAdd(data) {
    return axios.post("/repair/add", data)
  },
  // 编辑报事
  repairUpdateBusiness(data) {
    return axios.post("/repair/updateBusiness", data)
  },
  // 条件查询报事列表
  repairFindBusinessQuery(data) {
    return axios.post("/repair/findBusinessQuery", data)
  },
  // 查询报事详情
  repairFindBusiness(params) {
    return axios.get("/repair/findBusiness",{params})
  },
  // 查询报事事件类型
  repairGetBusinessDict(data) {
    return axios.get("/repair/getBusinessDict",  data )
  },
   // 导出报事报表
   downloadExcelBusiness(data) {
    axios
      .get("/repair/downloadExcelBusiness", {
        params: data,
        responseType: 'blob'
      })
      .then(res => {
        var blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        // 针对于IE浏览器的处理, 因部分IE浏览器不支持createObjectURL
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, res.fileName)
        } else {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = '业主报修列表' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
    // return axios.get(downloadExcel, data, 'blob')
  },
   // 报修回访
   saveRepaireRevisit(data) {
    return axios.post("/repair/saveRepaireRevisit", data)
  },
}
