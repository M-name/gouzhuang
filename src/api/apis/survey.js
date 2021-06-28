import axios from "../axios"
export default {
  // 查询问卷列表
  surveyList (data) {
    return axios.post('/survey/list', data)
  },
  // 问卷调查所需枚举
  surveyFindEnum(data) {
    return axios.get('/survey/findEnum', data)
  },
  // 新增调查问卷
  surveyCreatet (data) {
    return axios.post('/survey/create', data)
  },
   // 删除调查问卷
   surveyDel (data) {
    return axios.get('/survey/del'+'/'+data)
  },
   // 修改调查问卷
   surveyUpdate (data) {
    return axios.post('/survey/update',data)
  },
  // 查询某一个调查问卷
  surveyFind(data) {
    return axios.get('/survey/find'+'/'+data)
  },
   // 重用调查问卷
   surveyReusing (data) {
    return axios.post('/survey/reusing',data)
  },
   // 发布或下线或作废调查问卷
   surveyUpdateStatus (params) {
    return axios.get('/survey/updateStatus',{params})
  },
  // 查询选项组
  surveyGroupList (params) {
    return axios.get('/survey/group/list', {params})
  },
  // 新增选项组
  surveyGroupCreate (data) {
    return axios.post('/survey/group/create', data)
  },
  // 删除选项组
  surveyDelGroup (data) {
    return axios.get('/survey/delGroup'+'/'+data)
  },
  // 新增题目和选项
  surveyQuestionCreate (data) {
    return axios.post('/survey/question/create', data)
  },
  // 修改题目和选项
  surveyQuestionUpdate (data) {
    return axios.post('/survey/question/update', data)
  },
  // 删除题目和选项
  surveyDelQuestion (data) {
    return axios.post('/survey/delQuestion'+'/'+data)
  },
  // 查询题目和选项
  surveyQuestionList (data) {
    return axios.get('/survey/question/list'+'/'+data)
  },
  // 查询统计分析
  surveyCensusLists (params) {
    return axios.get('/survey/census/list',{params})
  },
  // 查询统计分析更新
  surveyCensusUpdate (params) {
    return axios.get('/survey/census/update',{params})
  },
  // 查询提交记录
  surveyUserList (params) {
    return axios.get('/survey/user/list',{params})
  },
   // 导出问卷分析列表
   downloadCensusExcel(data) {
    axios
      .get('/survey/downloadCensusExcel',
     { params:data,
      responseType: 'blob' }
      )
      .then(res => {
        console.log(res);
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
          downloadElement.download = '问卷分析表' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
  },
   // 导出报表
   surveyDownloadUserExcell(data) {
    axios
      .get("/survey/downloadUserExcel", {
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
          downloadElement.download = '问卷明细表' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
    // return axios.get(downloadExcel, data, 'blob')
  },
}

