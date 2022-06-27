import axios from "../axios"

export default {
     // 用户信息
     userAll(params) {
          return axios.post("/user/all", params)
     },
     // 用户角色和用户状态枚举
     findEnum(params) {
          return axios.get("/user/findEnum", params)
     },
     // 查询用户年龄分布
     ageStatistics(params) {
          return axios.get("/user/age/statistics", params)
     },
     // 查询用户列表
     detailAll(params) {
          return axios.post("/user/details/all", params)
     },
     genUrl(encoded, options) {
       const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });//返回的格式
       return window.URL.createObjectURL(dataBlob);
     },
     // 导出表格
     detailsDownload(params) {
          axios
               .post("/user/details/downloadExcel",
                    params,
                    // { responseType: 'blob' }
               )
               .then(res => {
                  const url = this.genUrl(res.data, {});//{}指的是表头，res.data.data.workhour_csv_data是后台返回来的数据
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "一人一房一档表.csv";
                    a.click();
                    window.URL.revokeObjectURL(url);
                    // var blob = new Blob([res.data], {
                    //      type: 'text/csv'
                    // })
                    // 针对于IE浏览器的处理, 因部分IE浏览器不支持createObjectURL
                    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    //      window.navigator.msSaveOrOpenBlob(blob, res.fileName)
                    // } else {
                    //      var downloadElement = document.createElement('a')
                    //      var href = window.URL.createObjectURL(blob) // 创建下载的链接
                    //      downloadElement.href = href
                    //      // downloadElement.download = '一人一房一档表' // 下载后文件名
                    //      downloadElement.setAttribute('download', '一人一房一档表' + '.csv')
                    //      document.body.appendChild(downloadElement)
                    //      downloadElement.click() // 点击下载
                    //      document.body.removeChild(downloadElement) // 下载完成移除元素
                    //      window.URL.revokeObjectURL(href) // 释放掉blob对象
                    // }
               })
          // return axios.get(downloadExcel, data, 'blob')
     },
     // 新增用户档案
     userCreate(params) {
          return axios.post("/user/details/create", params)
     },
     // 修改用户档案
     userUpdate(params) {
          return axios.post("/user/details/update", params)
     },
     // 新增用户房屋档案
     createOrUpdate(params) {
          return axios.post("/user/building/createOrUpdate", params)
     },
     // 查询某一个用户房屋档案
     userHouseFind(params) {
          return axios.get("/user/building/find?id=" + params)
     },
     // 解除绑定
     buildingUnbind(params) {
          return axios.get("/user/building/unbind" + '/' + params)
     },
     // 用户角色和用户状态枚举
     detailFindEnum(params) {
          return axios.get("/user/details/findEnum", params)
     },
     // 业主、成员、租客信息
     buildingPeopleList(params) {
          return axios.get("/user/building/peopleList", { params })
     },
     // 查询某一个用户档案
     peopleFind(params) {
          return axios.get("/user/details/find" + '/' + params)
     },
     // 查询用户车位管理所需数据
     peopleFfindUser(params) {
          return axios.get("/user/details/findUser", { params })
     },
     // 一人一档居住信息
     buildingFindInfo(params) {
          return axios.get("/user/building/findInfo" + '/' + params)
     },
     // 查看一人一档
     detailsFindInfo(params) {
          return axios.get("/user/details/findInfo" + '/' + params)
     },
     // 用户积分记录
     pointRecord(params) {
          return axios.post("/user/point/record", params)
     },
     // 返回签到所需枚举
     userPointEnum(params) {
          return axios.get("/user/pointEnum", { params })
     },
     // 查询某一个租户信息
     tenantInfo(params) {
          return axios.get("/user/building/tenantInfo/" + params)
     },
     // 住户搬出
     tenantMove(params) {
          return axios.post("/user/building/tenantMove", params)
     },
     // 健康自查列表
     healthList(params) {
          return axios.post("/user/health/list", params)
     },
     // 查询首页人口信息
     buildingPopulation(params) {
          return axios.get("/user/building/population", { params })
     },
     // 查询首页房屋信息
     buildingStatistics(params) {
          return axios.get("/user/building/statistics", { params })
     },
     // 查询租客登记列表
     userRenterList(params) {
          return axios.post("/user/details/renterList", params)
     },
     // 查询租客登记详情
     detailsFindRenter(params) {
          return axios.get("/user/details/find/" + params)
     },
     // 租客新增房屋档案
     buildingCreateRenter(params) {
          return axios.post("/user/building/createRenter", params)
     },
     // 修改租客登记状态
     detailsProcessStatus(params) {
          return axios.get("/user/details/processStatus", { params })
     },
     // 查询档案列表
     detailsList(params) {
          return axios.post("/user/details/list", params)
     },
     // 批量修改用户档案
     detailsUpdateBatch(params) {
          return axios.post("/user/details/updateBatch", params)
     },
     // 查询用户列表
     detailsLogList(params) {
          return axios.post("/user/details/logList", params)
     },
     // 删除
     detailsDelete(params) {
          return axios.delete("/user/details/delete?userCode=" + params)
     },
}