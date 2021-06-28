import axios from "../axios"

export default {
  //车位区域
  parkingAreaSelect(params) {
    return axios.get("/parking/zone/list", { params })
  },
  parkingAreaAdd(params) {
    return axios.post("/parking/zone/create", params)
  },
  parkingAreaDelete(data) {
    return axios.get("/parking/zone/del" + '/' + data)
  },
  getParkingArea(data) {
    return axios.get("/parking/zone/find" + '/' + data)
  },
  parkingAreaUpdate(params) {
    return axios.post("/parking/zone/update", params)

  },
  //车位列表
  parkingSelect(params) {
    return axios.post("/parking/info/list", params)
  },
  //新增车位
  parkingAdd(params) {
    return axios.post("/parking/info/create", params)
  },
  //修改车位
  parkingInfoUpdate(params) {
    return axios.post("/parking/info/update", params)
  },
  //删除车位
  parkingDel(params) {
    return axios.get("/parking/info/del" + '/' + params)
  },
  //查询车位信息所需枚举
  parkingInfoFindEnum(params) {
    return axios.get("/parking/info/findEnum", params)
  },
  //查询某一个车位信息
  parkingInfoFind(params) {
    return axios.get("/parking/info/find" + '/' + params)
  },
  // 用户车位管理所需枚举
  parkingFindEnum(params) {
    return axios.get('/user/parking/findEnum', params)
  },
  // 查询用户车位管理列表
  parkingAll(params) {
    return axios.post('/user/parking/all', params)
  },
  // 修改用户车位信息
  parkingUpdate(params) {
    return axios.post('/user/parking/update', params)
  },
  // 新增用户车位信息
  parkingCreate(params) {
    return axios.post('/user/parking/create', params)
  },
  // 查询某一个用户车位信息
  parkingFind(params) {
    return axios.get('/user/parking/find/' + params)
  },
  // 新增车位出租记录
  parkingCreateRent(params) {
    return axios.post('/user/parking/createRent', params)
  },
  // 新增车位过户记录
  parkingCreateTransfer(params) {
    return axios.post('/user/parking/createTransfer', params)
  },
  // 新建车辆档案
  parkingCreateCar(params) {
    return axios.post('/user/parking/createCar', params)
  },
  // 修改车位出租记录
  parkingUpdateRent(params) {
    return axios.post('/user/parking/updateRent', params)
  },
  // 修改车辆档案
  parkingUpdateCar(params) {
    return axios.post('/user/parking/updateCar', params)
  },
  // 查询车位出租记录
  parkingRentList(params) {
    return axios.get('/user/parking/rentList', { params })
  },
  // 查询某一条出租信息
  parkingFindRent(params) {
    return axios.get('/user/parking/findRent/' + params)
  },
  // 查询某一条过户信息
  parkingFindTransfer(params) {
    return axios.get('/user/parking/findTransfer/' + params)
  },
  // 查询车位过户记录
  parkingTransferList(params) {
    return axios.get('/user/parking/transferList', { params })
  },
  // 删除车位出租信息
  parkingDelRent(params) {
    return axios.get('/user/parking/delRent/' + params)
  },
  // 删除车辆档案
  parkingDelCar(params) {
    return axios.get('/user/parking/delCar/' + params)
  },
  // 查询一车一档列表
  parkingCarList(params) {
    return axios.post('/user/parking/carList', params)
  },
  // 查询某一条车辆档案
  parkingFindCar(params) {
    return axios.get('/user/parking/findCar/' + params)
  },
  // 导出用户车位管理列表
  parkingDownloadExcel(params) {
    axios
      .post('/user/parking/downloadExcel',
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
          downloadElement.download = '用户车位管理列表' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
  },
  // 导出一车一档列表
  parkingDownloadCarExcel(params) {
    axios
      .post('/user/parking/downloadCarExcel',
        params,
        { responseType: 'blob' }
      )
      .then(res => {

        var blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        console.log(blob)
        // 针对于IE浏览器的处理, 因部分IE浏览器不支持createObjectURL
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, res.fileName)
        } else {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          console.log(href)
          downloadElement.href = href
          downloadElement.download = '一车一档列表' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
  },
  // 查询一人一档车辆信息
  parkingFindInfo(params) {
    return axios.get('/user/parking/findInfo/' + params)
  },
  // 根据车位编码查询租用人信息
  parkingFindParkingCode(params) {
    return axios.get("/user/parking/findParkingCode" + '/' + params)
  },
  // 查询首页车辆信息
  parkingCar(params) {
    return axios.get('/user/parking/car', { params })
  },
  // 查询车位过户记录
  parkingTransferList(params) {
    return axios.get('/user/parking/transferList', { params })
  },
}


