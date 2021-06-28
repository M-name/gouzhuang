import axios from "../axios"

export default {
     // 复核数据统计
     orderStatisticsReview(params) {
          return axios.get('/order/statisticsReview', { params })
     },
     // 单个复核
     orderReview(params) {
          return axios.post('/order/review', params)
     },

     // 批量复核
     orderReviewBatch(params) {
          return axios.post('/order/reviewBatch', params)
     },
     // 批量发布
     orderPublishBatch(params) {
          return axios.post('/order/publishBatch', params)
     },
     // 返回枚举类
     orderGetEnum(params) {
          return axios.post('/order/getEnum', params)
     },
     // 删除
     orderDelete(params) {
          return axios.delete('/order/delete/' + params)
     },
     // 生成数据统计
     orderStatisticsCreate(params) {
          return axios.get('/order/statisticsCreate', { params })
     },
     // 单个发布
     orderPublish(params) {
          return axios.post('/order/publish', params)
     },
     // 批量提交
     orderSubmitBatch(params) {
          return axios.post('/order/submitBatch', params)
     },
     // 获取改费用对应字典信息
     orderGetFeeDict(params) {
          return axios.get('/order/getFeeDict', { params })
     },
     // 查询全部数据
     orderFindAll(params) {
          return axios.post('/order/findAll', params)
     },
     // 获取能耗费和住宅管理费列表（全部）
     orderFindQuery(params) {
          return axios.post('/order/findQuery', params)
     },
     // 获取能耗费和住宅管理费列表（已生成）
     orderFindQueryAlready(params) {
          return axios.post('/order/findQueryAlready', params)
     },
     // 获取能耗费和住宅管理费列表（未生成）
     orderFindQueryNot(params) {
          return axios.post('/order/findQueryNot', params)
     },

     // 获取车位管理费用户信息列表（全部）
     orderFindParkingQuery(params) {
          return axios.post('/order/findParkingQuery', params)
     },
     // 获取车位管理费用户信息列表（已生成）
     orderFindParkingQueryAlready(params) {
          return axios.post('/order/findParkingQueryAlready', params)
     },
     // 获取车位管理费用户信息列表（未生成）
     orderFindParkingQueryNot(params) {
          return axios.post('/order/findParkingQueryNot', params)
     },

     // 获取车位租赁费用户信息列表（全部）
     orderRentByQuery(params) {
          return axios.post('/order/rentByQuery', params)
     },
     // 获取车位租赁费用户信息列表（已生成）
     orderRentByQueryAlready(params) {
          return axios.post('/order/rentByQueryAlready', params)
     },
     // 获取车位租赁费用户信息列表（未生成）
     orderRentByQueryNot(params) {
          return axios.post('/order/rentByQueryNot', params)
     },

     // 一键生成能耗费和住宅管理费账单
     orderSaveAllt(params) {
          return axios.post('/order/saveAll', params)
     },
     //批量生成能耗费和住宅管理费账单
     orderSaveBatch(params) {
          return axios.post('/order/saveBatch', params)
     },
     // 一键生成车位管理费账单
     orderSaveAllParkingt(params) {
          return axios.post('/order/saveAllParking', params)
     },
     // 批量生成车位管理费账单
     orderSaveBatchParkingt(params) {
          return axios.post('/order/saveBatchParking', params)
     },

     // 一键生成车位租赁费账单
     orderSaveAllRent(params) {
          return axios.post('/order/saveAllRent', params)
     },
     // 批量生成车位租赁费账单
     orderSaveBatchRent(params) {
          return axios.post('/order/saveBatchRent', params)
     },
     // 物业缴费列表
     orderList(params) {
          return axios.get('/order/list', { params })
     },

     // 创建收费
     orderPaymentCreateOrder(params) {
          return axios.post('/orderPayment/createOrder', params)
     },
     // 发起支付
     orderPaymentCreatPay(params) {
          return axios.post('/orderPayment/creatPay', params)
     },
     // 现金支付
     orderPaymentCashPay(params) {
          return axios.post('/orderPayment/cashPay', params)
     },
     // 转账支付
     orderPaymentTransferPay(params) {
          return axios.post('/orderPayment/transferPay', params)
     },
     // 支付宝查单
     queryAliPay(params) {
          return axios.get('/orderPayment/queryAliPay/' + params)
     },
     // 微信查单
     queryWXPay(params) {
          return axios.get('/orderPayment/queryWXPay/' + params)
     },
     // 撤销订单
     revocationPay(params) {
          return axios.get('/orderPayment/revocationPay/' + params)
     },
     // 费用支付记录
     getPayment(params) {
          return axios.post('/orderPayment/getPayment', params)
     },
     // 返回枚举类
     orderGetEnum(params) {
          return axios.get('/orderPayment/getEnum', { params })
     },
     // 查看收据
     orderDownloadPdf(params) {
          return axios.get('/orderPayment/downloadPdf/' + params)
     },
     // 查询收据列表
     receiptList(params) {
          return axios.post('/orderPayment/receipt/list', params)
     },
     // 导出收据列表
     downloadReceiptExcel(params) {
          axios
               .post('/orderPayment/downloadReceiptExcel',
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
                         downloadElement.download = '收据列表' // 下载后文件名
                         document.body.appendChild(downloadElement)
                         downloadElement.click() // 点击下载
                         document.body.removeChild(downloadElement) // 下载完成移除元素
                         window.URL.revokeObjectURL(href) // 释放掉blob对象
                    }
               })
     },
     // 返回楼栋列表
     orderGetBuilding(params) {
          return axios.get('/order/getBuilding', { params })
     },
     // 返回车位区域列表
     orderGetParking(params) {
          return axios.get('/order/getParking', { params })
     },
     // 退款
     createRefund(params) {
          return axios.post('/orderPayment/createRefund', params)
     },
     // 收据作废
     orderPaymentCancelled(params) {
          return axios.get('/orderPayment/cancelled', { params })
     },
     // 一键复核
     orderReviewAll(params) {
          return axios.post('/order/reviewAll', params)
     },
     // 一键提交
     orderSubmitAll(params) {
          return axios.post('/order/SubmitAll', params)
     },
     //  一键发布
     orderPublishAll(params) {
          return axios.post('/order/publishAll', params)
     },
     // 导出缴费账单表
     orderDownloadExcel(params) {
     axios
       .post("/order/downloadExcel",
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
           downloadElement.download = '缴费账单表' // 下载后文件名
           document.body.appendChild(downloadElement)
           downloadElement.click() // 点击下载
           document.body.removeChild(downloadElement) // 下载完成移除元素
           window.URL.revokeObjectURL(href) // 释放掉blob对象
         }
       })
     // return axios.get(downloadExcel, data, 'blob')
   },
    // 导出费用支付记录报表
    orderPaymentDownloadExcel(params) {
     axios
       .post("/orderPayment/downloadExcel",
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
           downloadElement.download = '费用支付记录表' // 下载后文件名
           document.body.appendChild(downloadElement)
           downloadElement.click() // 点击下载
           document.body.removeChild(downloadElement) // 下载完成移除元素
           window.URL.revokeObjectURL(href) // 释放掉blob对象
         }
       })
     // return axios.get(downloadExcel, data, 'blob')
   },
   //导入账单
   orderUploadExcel(params) {
     return axios.post('/order/uploadExcel', params)
},
// 统计分析
orderPaymentStatistics(params) {
     return axios.post('/orderPayment/statistics', params)
},
}