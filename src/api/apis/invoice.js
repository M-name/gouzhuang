import axios from "../axios"

export default {
     // 发票上传
     invoiceCreate(params) {
          return axios.post('/invoice/create', params)
     },
     // 查询发票申请列表
     invoiceApplylist(params) {
          return axios.post('/invoice/apply/list', params)
     },
     //返回枚举类
     invoiceGetEnum(data) {
          return axios.get("/invoice/getEnum", data)
     },
     //发票作废
     invoiceCancelled(params) {
          return axios.get("/invoice/cancelled", { params })
     },
     // 导出收据列表
     downloadInvoiceExcel(params) {
          axios
               .post('/invoice/downloadInvoiceExcel',
                    params,
                    { responseType: 'blob' }
               )
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
                         downloadElement.download = '发票列表' // 下载后文件名
                         document.body.appendChild(downloadElement)
                         downloadElement.click() // 点击下载
                         document.body.removeChild(downloadElement) // 下载完成移除元素
                         window.URL.revokeObjectURL(href) // 释放掉blob对象
                    }
               })
     },
}
