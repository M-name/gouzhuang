(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{Bb9q:function(e,t,r){"use strict";var a=r("Z/37");r.n(a).a},Cbie:function(e,t,r){"use strict";r.r(t);var a=r("YEIV"),i=r.n(a),o={name:"userControl",data:function(){var e,t=this;return{header:{"Content-Type":"multipart/form-data"},fileImg:[],rentOutFileImg:[],ownerShipFileImg:[],dialogImageUrl:"",chooseTableData:[],chooseColumn:[{prop:"userName",label:"用户姓名"},{prop:"certificateTypeIdStr",label:"证件类型"},{prop:"certificateCode",label:"证件号码"},{prop:"userSexStr",label:"性别"},{prop:"contactMethod",label:"联系人电话"},{prop:"mobile",label:"电话"},{prop:"liveStatusStr",label:"居住状态"}],chooseShow:!1,dialogVisible:!1,isOutPeople:!1,loading:!1,chooseLoading:!1,isAddress:!1,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},chooseTableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1,border:!1},tableOperations:[{label:"查看",icon:"el-icon-tickets",handler:function(e){return t.handleCheak(e)}},{label:"关联",icon:"iconfont icon-lick",handler:function(e){return t.handleEdit(e)}},{label:"修改",icon:"el-icon-edit",handler:function(e){return t.handleUpdate(e)}},{label:"出租",icon:"iconfont icon-rent",handler:function(e){return t.rentOut(e)}},{label:"过户",icon:"iconfont icon-transfer",handler:function(e){return t.ownerShip(e)}}],chooseTableOperations:[{label:"选择",icon:"el-icon-edit",handler:function(e){return t.choose(e)}}],commonSearchList:[{prop:"parkingCode",label:"车位编码"}],chooseSearchList:[{prop:"buildingCode",label:"房间编码"},{prop:"userName",label:"用户姓名"},{prop:"certificateCode",label:"身份证号"},{prop:"mobile",label:"电话号码"},{prop:"hao",label:"门禁号"},{prop:"liveType",label:"证件类型",type:"select",options:[]},{prop:"liveStatus",label:"居住状态",type:"select",options:[]},{prop:"liveTypeId",label:"住户类型",type:"select",options:[]}],open:!1,rentOutOpen:!1,ownerShipOpen:!1,title:"",postStatusList:[],deptList:[],roleList:[],areaList:[],userStatusList:[],column:[{prop:"zoneName",label:"车位区域"},{prop:"parkingCode",label:"车位编码",widht:"180"},{prop:"parkingStatusStr",label:"车位状态",widht:"180"},{prop:"parkingUsingStatusStr",label:"使用情况"},{prop:"parkingBelongTypeIdStr",label:"所有人类型"},{prop:"userName",label:"所有人姓名"}],tableData:[],total:0,chooseTotal:0,form:{},rentOutForm:{},ownerShipForm:{},rules:{parkingBelongTypeId:[{required:!0,message:"所有人类型未选择",trigger:"change"}],mobile:[{required:!0,message:"手机号不能为空",trigger:"change"},this.$rules.mobile(void 0,"blur")],userName:[{required:!0,message:"姓名不能为空",trigger:"change"}],certificateTypeId:[{required:!0,message:"证件类型不能为空",trigger:"change"}],certificateNo:[{required:!0,message:"证件号码不能为空",trigger:"change"}],userAddr:[{required:!0,message:"地址不能为空",trigger:"change"}],buyTime:[{required:!0,message:"购买时间不能为空",trigger:"change"}],parkingStatus:[{required:!0,message:"车位状态未选择",trigger:"change"}],parkingUsingStatus:[{required:!0,message:"使用情况未选择",trigger:"change"}]},rentOutRules:{tenantTypeId:[{required:!0,message:"租用人类型未选择",trigger:"change"}],mobile:[{required:!0,message:"手机号不能为空",trigger:"change"},this.$rules.mobile(void 0,"blur")],userName:[{required:!0,message:"姓名不能为空",trigger:"change"}],certificateTypeId:[{required:!0,message:"证件类型不能为空",trigger:"change"}],certificateNo:[{required:!0,message:"证件号码不能为空",trigger:"change"}],tenantAddr:[{required:!0,message:"地址不能为空",trigger:"change"}],rentBeginTime:[{required:!0,message:"起始时间不能为空",trigger:"change"}],rentEndTime:[{required:!0,message:"截止时间不能为空",trigger:"change"}]},ownerShipRules:{currTypeId:[{required:!0,message:"所有人类型未选择",trigger:"change"}],currMobile:[{required:!0,message:"手机号不能为空",trigger:"change"},this.$rules.mobile(void 0,"blur")],currUserName:[{required:!0,message:"姓名不能为空",trigger:"change"}],currCertificateTypeId:[{required:!0,message:"证件类型不能为空",trigger:"change"}],currCertificateNo:[{required:!0,message:"证件号码不能为空",trigger:"change"}],currUserAddr:[{required:!0,message:"地址不能为空",trigger:"change"}],transferTime:[{required:!0,message:"过户时间不能为空",trigger:"change"}]},ids:[],parkingCode:void 0,preUserCode:void 0,dicList:[],dicLists:[],chooseParams:(e={page:1,pageSize:10,newsTitle:void 0,publishStatus:void 0},i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),e),params:{page:1,pageSize:20,zoneName:"",parkingStatus:"",parkingCode:void 0,parkingUsingStatus:""}}},watch:{"form.parkingBelongTypeId":{handler:function(e,t){47==e||49==e?this.isOutPeople=!0:(this.isOutPeople=!1,this.isAddress=!1)},deep:!0,immediate:!0},"rentOutForm.tenantTypeId":{handler:function(e,t){50==e?this.isOutPeople=!0:(this.isOutPeople=!1,this.isAddress=!1)},deep:!0,immediate:!0},"ownerShipForm.currTypeId":{handler:function(e,t){50==e?this.isOutPeople=!0:(this.isOutPeople=!1,this.isAddress=!1)},deep:!0,immediate:!0}},created:function(){var e=this;this.$request.areaListAll().then((function(t){e.areaList=t.data.data})),this.$request.detailFindEnum().then((function(t){e.dicLists=t.data.data;var r=t.data.data;e.chooseSearchList.forEach((function(e){"select"==e.type&&"liveStatus"==e.prop&&r.liveStatusEnum.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"liveTypeId"==e.prop&&r.reasonEnum.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"liveType"==e.prop&&r.certificateEnum.map((function(t){e.options.push({label:t.value,value:t.type})}))}))})),this.$request.parkingFindEnum().then((function(t){e.dicList=t.data.data})),this.getList(),this.chooseGetList()},methods:{choose:function(e){var t=this;this.$request.peopleFfindUser({id:e.id,userCode:e.userCode}).then((function(e){200==e.data.status?(t.open?(t.form.userName=e.data.data.userName,t.form.userCode=e.data.data.userCode,t.form.mobile=e.data.data.mobile,t.form.certificateTypeId=e.data.data.certificateTypeId,t.form.userAddr=e.data.data.userAddr,t.form.certificateNo=e.data.data.certificateCode):t.rentOutOpen?(t.rentOutForm.userName=e.data.data.userName,t.rentOutForm.userCode=e.data.data.userCode,t.rentOutForm.mobile=e.data.data.mobile,t.rentOutForm.certificateTypeId=e.data.data.certificateTypeId,t.rentOutForm.tenantAddr=e.data.data.userAddr,t.rentOutForm.certificateNo=e.data.data.certificateCode):t.ownerShipOpen&&(t.ownerShipForm.currUserName=e.data.data.userName,t.ownerShipForm.currUserCode=e.data.data.userCode,t.ownerShipForm.currMobile=e.data.data.mobile,t.ownerShipForm.currCertificateTypeId=e.data.data.certificateTypeId,t.ownerShipForm.currUserAddr=e.data.data.userAddr,t.ownerShipForm.currCertificateNo=e.data.data.certificateCode),t.chooseShow=!1,e.data.data.userAddr?t.isAddress=!0:t.isAddress=!1):t.$message.error(e.data.msg)}))},uploadSectionFile:function(e){var t=this,r=new FormData;r.append("file",e.file),this.$request.upload(r).then((function(e){var r={url:e.data.data.split(",")[1]};t.fileImg.push(r),null!=t.form.certificateImageCodes?t.form.certificateImageCodes=t.form.certificateImageCodes+","+e.data.data.split(",")[0]:t.form.certificateImageCodes=e.data.data.split(",")[0]}))},uploadFile:function(e){var t=this,r=new FormData;r.append("file",e.file),this.$request.upload(r).then((function(e){var r={url:e.data.data.split(",")[1]};t.rentOutFileImg.push(r),null!=t.rentOutForm.rentImageCodes?t.rentOutForm.rentImageCodes=t.rentOutForm.rentImageCodes+","+e.data.data.split(",")[0]:t.rentOutForm.rentImageCodes=e.data.data.split(",")[0]}))},ownerShipUploadFile:function(e){var t=this,r=new FormData;r.append("file",e.file),this.$request.upload(r).then((function(e){var r={url:e.data.data.split(",")[1]};t.ownerShipFileImg.push(r),null!=t.ownerShipForm.transferImageCodes?t.ownerShipForm.transferImageCodes=t.ownerShipForm.transferImageCodes+","+e.data.data.split(",")[0]:t.ownerShipForm.transferImageCodes=e.data.data.split(",")[0]}))},getLocalImg:function(e){var t=e.url;this.dialogImageUrl=t,this.dialogVisible=!0},Export:function(){this.$request.parkingDownloadExcel(this.params)},chooseHandleQuery:function(){this.chooseParams.page=1,this.chooseGetList()},handleQuery:function(){this.params.page=1,this.getList()},resetQuery:function(){this.params.parkingCode=void 0,this.handleQuery()},chooseResetQuery:function(){var e;this.chooseParams=(e={page:1,pageSize:10,newsTitle:void 0,publishStatus:void 0},i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),i()(e,"newsTitle",void 0),i()(e,"publishStatus",void 0),e),this.chooseHandleQuery()},handleUpdate:function(e){var t=this;if(e.parkingBelongTypeId||e.userName){this.reset();var r=e.parkingCode;this.parkingCode=e.parkingCode,this.$request.parkingFind(r).then((function(e){200==e.data.status?(t.form=e.data.data,t.open=!0,e.data.data.userAddr&&48!=e.data.data.parkingBelongTypeId?t.isAddress=!0:t.isAddress=!1,t.title="修改"):t.$message.error(e.data.msg)}))}else this.$message.error("请先关联用户")},choosePeople:function(){this.chooseShow=!0},handleCheak:function(e){this.$router.push({path:"/parkingDetail",name:"parkingDetail",params:{code:e.parkingCode}})},handleEdit:function(e){e.parkingBelongTypeId&&e.userName?this.$message.error("该车位已关联用户"):(this.reset(),this.isAddress=!1,this.parkingCode=e.parkingCode,this.open=!0,this.title="关联")},rentOut:function(e){e.parkingBelongTypeId||e.userName?(this.rentOutReset(),this.isAddress=!1,this.parkingCode=e.parkingCode,this.rentOutOpen=!0,this.title="出租"):this.$message.error("请先关联用户")},ownerShip:function(e){e.parkingBelongTypeId||e.userName?(this.ownerShipReset(),this.isAddress=!1,this.parkingCode=e.parkingCode,console.log(e.userCode),e.userCode?this.preUserCode=e.userCode:this.preUserCode="",this.ownerShipOpen=!0,this.title="过户"):this.$message.error("请先关联用户")},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},rentOutCancel:function(){this.rentOutOpen=!1,this.rentOutReset(),this.$refs.rentOutForm.resetFields()},ownerShipCancel:function(){this.ownerShipOpen=!1,this.ownerShipReset(),this.$refs.ownerShipForm.resetFields()},submitForm:function(){var e=this;console.log(this.form),this.$refs.form.validate((function(t){t&&(e.form.parkingCode=e.parkingCode,e.form.createTime?e.$request.parkingUpdate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("修改成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})):e.$request.parkingCreate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("关联成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})))}))},rentOutSubmitForm:function(){var e=this;this.$refs.rentOutForm.validate((function(t){t&&(e.rentOutForm.parkingCode=e.parkingCode,e.$request.parkingCreateRent(e.rentOutForm).then((function(t){200===t.data.status?(e.msgSuccess("出租成功"),e.rentOutOpen=!1,e.getList(),e.$refs.rentOutForm.resetFields()):e.$message.error(t.data.msg)})))}))},ownerShipSubmitForm:function(){var e=this;this.$refs.ownerShipForm.validate((function(t){t&&(e.ownerShipForm.parkingCode=e.parkingCode,e.ownerShipForm.preUserCode=e.preUserCode,console.log(e.ownerShipForm.preUserCode,e.preUserCode),e.$request.parkingCreateTransfer(e.ownerShipForm).then((function(t){200===t.data.status?(e.msgSuccess("过户成功"),e.ownerShipOpen=!1,e.getList(),e.$refs.ownerShipForm.resetFields()):e.$message.error(t.data.msg)})))}))},reset:function(e){this.form=e?{parkingBelongTypeId:e,userName:void 0,userCode:void 0,mobile:void 0,parkingCode:void 0,certificateTypeId:void 0,certificateNo:void 0,certificateImageCodes:void 0,userAddr:void 0,buyTime:void 0,parkingStatus:void 0,parkingUsingStatus:void 0,remark:void 0}:{parkingBelongTypeId:48,userName:void 0,userCode:void 0,mobile:void 0,certificateNo:void 0,parkingCode:void 0,certificateTypeId:void 0,certificateImageCodes:void 0,userAddr:void 0,buyTime:void 0,parkingStatus:void 0,parkingUsingStatus:void 0,remark:void 0}},rentOutReset:function(e){this.rentOutForm=e?{tenantTypeId:e,userName:void 0,userCode:void 0,mobile:void 0,parkingCode:void 0,certificateTypeId:void 0,certificateNo:void 0,rentImageCodes:void 0,tenantAddr:void 0,rentBeginTime:void 0,rentEndTime:void 0,remark:void 0}:{tenantTypeId:48,userName:void 0,userCode:void 0,mobile:void 0,parkingCode:void 0,certificateTypeId:void 0,certificateNo:void 0,rentImageCodes:void 0,tenantAddr:void 0,rentBeginTime:void 0,rentEndTime:void 0,remark:void 0}},ownerShipReset:function(e){this.ownerShipForm=e?{currTypeId:e,currUserName:void 0,currUserCode:void 0,userCode:void 0,currMobile:void 0,parkingCode:void 0,currCertificateTypeId:void 0,currCertificateNo:void 0,currUserAddr:void 0,transferTime:void 0,transferImageCodes:void 0,remark:void 0}:{currTypeId:48,currUserName:void 0,userCode:void 0,currMobile:void 0,parkingCode:void 0,currCertificateTypeId:void 0,currCertificateNo:void 0,currUserAddr:void 0,transferTime:void 0,transferImageCodes:void 0,remark:void 0}},getList:function(){var e=this;this.loading=!0,this.$request.parkingAll(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.loading=!1,e.$message.error(t.data.msg))}))},chooseGetList:function(){var e=this;this.chooseLoading=!0,this.$request.detailAll(this.chooseParams).then((function(t){200===t.data.status?(e.chooseTableData=t.data.data.rows,e.chooseTotal=t.data.data.records,e.chooseParams.page=t.data.data.page,e.chooseLoading=!1):(e.chooseLoading=!1,e.$message.error(t.data.msg))}))}}},s=(r("Bb9q"),r("KHd+")),n=Object(s.a)(o,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("div",{staticClass:"choose",staticStyle:{background:"#fff"}},[r("el-form",{attrs:{"label-width":"100px"}},[r("el-form-item",{attrs:{label:"车位区域:"}},[r("el-radio-group",{attrs:{"text-color":"#409EFF",fill:"#fff"},on:{change:e.getList},model:{value:e.params.zoneName,callback:function(t){e.$set(e.params,"zoneName",t)},expression:"params.zoneName"}},[r("el-radio-button",{attrs:{label:""}},[e._v("全部")]),e._v(" "),e._l(e.dicList.parkingZoneEnum,(function(e,t){return r("el-radio-button",{key:t,attrs:{label:e}})}))],2)],1),e._v(" "),r("el-form-item",{attrs:{label:"车位状态:"}},[r("el-radio-group",{attrs:{"text-color":"#409EFF",fill:"#fff"},on:{change:e.getList},model:{value:e.params.parkingStatus,callback:function(t){e.$set(e.params,"parkingStatus",t)},expression:"params.parkingStatus"}},[r("el-radio-button",{attrs:{label:""}},[e._v("全部")]),e._v(" "),e._l(e.dicList.parkingStatusEnum,(function(t,a){return r("el-radio-button",{key:a,attrs:{label:t.type}},[e._v(e._s(t.value))])}))],2)],1),e._v(" "),r("el-form-item",{attrs:{label:"使用情况:"}},[r("el-radio-group",{attrs:{"text-color":"#409EFF",fill:"#fff"},on:{change:e.getList},model:{value:e.params.parkingUsingStatus,callback:function(t){e.$set(e.params,"parkingUsingStatus",t)},expression:"params.parkingUsingStatus"}},[r("el-radio-button",{attrs:{label:""}},[e._v("全部")]),e._v(" "),e._l(e.dicList.parkingUsingStatusEnum,(function(t,a){return r("el-radio-button",{key:a,attrs:{label:t.type}},[e._v(e._s(t.value))])}))],2)],1)],1)],1),e._v(" "),r("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[r("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),r("div",{staticClass:"operation"},[r("div",{staticClass:"button"},[r("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[r("el-col",{attrs:{span:1.5}},[r("el-button",{attrs:{type:"primary",icon:"el-icon-download",size:"mini"},on:{click:e.Export}},[e._v("导出Excel")])],1)],1)],1),e._v(" "),r("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)}}})],1),e._v(" "),r("el-dialog",{attrs:{title:e.title,"before-close":e.ownerShipCancel,visible:e.ownerShipOpen,width:"700px","append-to-body":""},on:{"update:visible":function(t){e.ownerShipOpen=t}}},[r("el-form",{ref:"ownerShipForm",attrs:{model:e.ownerShipForm,rules:e.ownerShipRules,"label-width":"130px"}},[r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("新所有人基本信息")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{label:"所有人类型:",prop:"currTypeId"}},[r("el-radio-group",{on:{change:e.ownerShipReset},model:{value:e.ownerShipForm.currTypeId,callback:function(t){e.$set(e.ownerShipForm,"currTypeId",t)},expression:"ownerShipForm.currTypeId"}},e._l(e.dicList.rentPersonEnum,(function(t,a){return r("el-radio",{key:a,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),e.isOutPeople?r("el-form-item",{attrs:{label:"所有人姓名:",prop:"currUserName"}},[r("el-input",{staticClass:"elinput",attrs:{disabled:e.isOutPeople,placeholder:"请输入所有人姓名"},model:{value:e.ownerShipForm.currUserName,callback:function(t){e.$set(e.ownerShipForm,"currUserName",t)},expression:"ownerShipForm.currUserName"}}),e._v(" "),r("el-button",{staticClass:"btn-buka",attrs:{type:"primary"},on:{click:e.choosePeople}},[e._v("选择")])],1):r("el-form-item",{attrs:{label:"所有人姓名:",prop:"currUserName"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"请输入所有人姓名"},model:{value:e.ownerShipForm.currUserName,callback:function(t){e.$set(e.ownerShipForm,"currUserName",t)},expression:"ownerShipForm.currUserName"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人手机号:",prop:"currMobile"}},[r("el-input",{attrs:{placeholder:"所有入手机号"},model:{value:e.ownerShipForm.currMobile,callback:function(t){e.$set(e.ownerShipForm,"currMobile",t)},expression:"ownerShipForm.currMobile"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人证件类型:",prop:"currCertificateTypeId"}},[r("el-select",{attrs:{disabled:e.isOutPeople,placeholder:"请选择"},model:{value:e.ownerShipForm.currCertificateTypeId,callback:function(t){e.$set(e.ownerShipForm,"currCertificateTypeId",t)},expression:"ownerShipForm.currCertificateTypeId"}},e._l(e.dicList.certificateEnum,(function(e){return r("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人证件号码:",prop:"currCertificateNo"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"请输入证件号码"},model:{value:e.ownerShipForm.currCertificateNo,callback:function(t){e.$set(e.ownerShipForm,"currCertificateNo",t)},expression:"ownerShipForm.currCertificateNo"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人地址:",prop:"currUserAddr"}},[r("el-input",{attrs:{disabled:e.isAddress,placeholder:"请输入所有人地址"},model:{value:e.ownerShipForm.currUserAddr,callback:function(t){e.$set(e.ownerShipForm,"currUserAddr",t)},expression:"ownerShipForm.currUserAddr"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"过户时间:",prop:"transferTime"}},[r("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.ownerShipForm.transferTime,callback:function(t){e.$set(e.ownerShipForm,"transferTime",t)},expression:"ownerShipForm.transferTime"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"过户备注:",prop:"remark"}},[r("el-input",{attrs:{type:"textarea",autosize:"",placeholder:"请输入备注"},model:{value:e.ownerShipForm.remark,callback:function(t){e.$set(e.ownerShipForm,"remark",t)},expression:"ownerShipForm.remark"}})],1),e._v(" "),r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("过户证明材料")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{"label-width":"20px",label:"",prop:"rentImageCodes"}},[r("el-upload",{ref:"upload",attrs:{action:"uploadUrl","list-type":"picture-card","http-request":e.ownerShipUploadFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"file-list":e.ownerShipFileImg}},[r("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.ownerShipSubmitForm}},[e._v("提 交")]),e._v(" "),r("el-button",{on:{click:e.ownerShipCancel}},[e._v("取 消")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:e.title,"before-close":e.rentOutCancel,visible:e.rentOutOpen,width:"700px","append-to-body":""},on:{"update:visible":function(t){e.rentOutOpen=t}}},[r("el-form",{ref:"rentOutForm",attrs:{model:e.rentOutForm,rules:e.rentOutRules,"label-width":"130px"}},[r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("租用人基本信息")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{label:"租用人类型:",prop:"tenantTypeId"}},[r("el-radio-group",{on:{change:e.rentOutReset},model:{value:e.rentOutForm.tenantTypeId,callback:function(t){e.$set(e.rentOutForm,"tenantTypeId",t)},expression:"rentOutForm.tenantTypeId"}},e._l(e.dicList.rentPersonEnum,(function(t,a){return r("el-radio",{key:a,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),e.isOutPeople?r("el-form-item",{attrs:{label:"租用人姓名:",prop:"userName"}},[r("el-input",{staticClass:"elinput",attrs:{disabled:e.isOutPeople,placeholder:"请输入租用人姓名"},model:{value:e.rentOutForm.userName,callback:function(t){e.$set(e.rentOutForm,"userName",t)},expression:"rentOutForm.userName"}}),e._v(" "),r("el-button",{staticClass:"btn-buka",attrs:{type:"primary"},on:{click:e.choosePeople}},[e._v("选择")])],1):r("el-form-item",{attrs:{label:"租用人姓名:",prop:"userName"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"租用入所有人姓名"},model:{value:e.rentOutForm.userName,callback:function(t){e.$set(e.rentOutForm,"userName",t)},expression:"rentOutForm.userName"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用人手机号:",prop:"mobile"}},[r("el-input",{attrs:{placeholder:"租用入手机号"},model:{value:e.rentOutForm.mobile,callback:function(t){e.$set(e.rentOutForm,"mobile",t)},expression:"rentOutForm.mobile"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用人证件类型:",prop:"certificateTypeId"}},[r("el-select",{attrs:{disabled:e.isOutPeople,placeholder:"请选择"},model:{value:e.rentOutForm.certificateTypeId,callback:function(t){e.$set(e.rentOutForm,"certificateTypeId",t)},expression:"rentOutForm.certificateTypeId"}},e._l(e.dicList.certificateEnum,(function(e){return r("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"租用人证件号码:",prop:"certificateNo"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"请输入证件号码"},model:{value:e.rentOutForm.certificateNo,callback:function(t){e.$set(e.rentOutForm,"certificateNo",t)},expression:"rentOutForm.certificateNo"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用人地址:",prop:"tenantAddr"}},[r("el-input",{attrs:{disabled:e.isAddress,placeholder:"请输入租用人地址"},model:{value:e.rentOutForm.tenantAddr,callback:function(t){e.$set(e.rentOutForm,"tenantAddr",t)},expression:"rentOutForm.tenantAddr"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用起始:",prop:"rentBeginTime"}},[r("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.rentOutForm.rentBeginTime,callback:function(t){e.$set(e.rentOutForm,"rentBeginTime",t)},expression:"rentOutForm.rentBeginTime"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用截止:",prop:"rentEndTime"}},[r("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.rentOutForm.rentEndTime,callback:function(t){e.$set(e.rentOutForm,"rentEndTime",t)},expression:"rentOutForm.rentEndTime"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"租用备注:",prop:"remark"}},[r("el-input",{attrs:{type:"textarea",autosize:"",placeholder:"请输入备注"},model:{value:e.rentOutForm.remark,callback:function(t){e.$set(e.rentOutForm,"remark",t)},expression:"rentOutForm.remark"}})],1),e._v(" "),r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("租用证明材料")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{"label-width":"20px",label:"",prop:"rentImageCodes"}},[r("el-upload",{ref:"upload",attrs:{action:"uploadUrl","list-type":"picture-card","http-request":e.uploadFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"file-list":e.rentOutFileImg}},[r("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.rentOutSubmitForm}},[e._v("提 交")]),e._v(" "),r("el-button",{on:{click:e.rentOutCancel}},[e._v("取 消")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"700px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[r("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"130px"}},[r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("所有人基本信息")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{label:"所有人类型:",prop:"parkingBelongTypeId"}},[r("el-radio-group",{on:{change:e.reset},model:{value:e.form.parkingBelongTypeId,callback:function(t){e.$set(e.form,"parkingBelongTypeId",t)},expression:"form.parkingBelongTypeId"}},e._l(e.dicList.parkingBelongEnum,(function(t,a){return r("el-radio",{key:a,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),e.isOutPeople?r("el-form-item",{attrs:{label:"所有人姓名:",prop:"userName"}},[r("el-input",{staticClass:"elinput",attrs:{disabled:e.isOutPeople,placeholder:"请输入所有人姓名"},model:{value:e.form.userName,callback:function(t){e.$set(e.form,"userName",t)},expression:"form.userName"}}),e._v(" "),r("el-button",{staticClass:"btn-buka",attrs:{type:"primary"},on:{click:e.choosePeople}},[e._v("选择")])],1):r("el-form-item",{attrs:{label:"所有人姓名:",prop:"userName"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"请输入所有人姓名"},model:{value:e.form.userName,callback:function(t){e.$set(e.form,"userName",t)},expression:"form.userName"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人手机号:",prop:"mobile"}},[r("el-input",{attrs:{placeholder:"请输入手机号"},model:{value:e.form.mobile,callback:function(t){e.$set(e.form,"mobile",t)},expression:"form.mobile"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人证件类型:",prop:"certificateTypeId"}},[r("el-select",{attrs:{disabled:e.isOutPeople,placeholder:"请选择"},model:{value:e.form.certificateTypeId,callback:function(t){e.$set(e.form,"certificateTypeId",t)},expression:"form.certificateTypeId"}},e._l(e.dicList.certificateEnum,(function(e){return r("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人证件号码:",prop:"certificateNo"}},[r("el-input",{attrs:{disabled:e.isOutPeople,placeholder:"请输入证件号码"},model:{value:e.form.certificateNo,callback:function(t){e.$set(e.form,"certificateNo",t)},expression:"form.certificateNo"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"所有人地址:",prop:"userAddr"}},[r("el-input",{attrs:{disabled:e.isAddress,placeholder:"请输入所有人地址"},model:{value:e.form.userAddr,callback:function(t){e.$set(e.form,"userAddr",t)},expression:"form.userAddr"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"购买时间:",prop:"buyTime"}},[r("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.form.buyTime,callback:function(t){e.$set(e.form,"buyTime",t)},expression:"form.buyTime"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"车位状态：",prop:"parkingStatus"}},[r("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.parkingStatus,callback:function(t){e.$set(e.form,"parkingStatus",t)},expression:"form.parkingStatus"}},e._l(e.dicList.parkingStatusEnum,(function(e){return r("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"使用情况：",prop:"parkingUsingStatus"}},[r("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.parkingUsingStatus,callback:function(t){e.$set(e.form,"parkingUsingStatus",t)},expression:"form.parkingUsingStatus"}},e._l(e.dicList.parkingUsingStatusEnum,(function(e){return r("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"购买备注:",prop:"remark"}},[r("el-input",{attrs:{type:"textarea",autosize:"",placeholder:"请输入备注"},model:{value:e.form.remark,callback:function(t){e.$set(e.form,"remark",t)},expression:"form.remark"}})],1),e._v(" "),r("i",{staticClass:"el-icon-s-custom"}),e._v(" "),r("span",[e._v("证明材料")]),e._v(" "),r("el-divider"),e._v(" "),r("el-form-item",{attrs:{"label-width":"20px",label:"",prop:"certificateImageCodes"}},[r("el-upload",{ref:"upload",attrs:{action:"uploadUrl","list-type":"picture-card","http-request":e.uploadSectionFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"file-list":e.fileImg}},[r("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提 交")]),e._v(" "),r("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:"所有人选择",width:"800px",visible:e.chooseShow},on:{"update:visible":function(t){e.chooseShow=t}}},[r("div",{staticStyle:{"margin-top":"-20px"}},[r("CommonSearch",{attrs:{queryParams:e.chooseParams,searchList:e.chooseSearchList},on:{resetQuery:e.chooseResetQuery,handleQuery:e.chooseHandleQuery,"update:queryParams":function(t){e.chooseParams=t},"update:query-params":function(t){e.chooseParams=t}}})],1),e._v(" "),r("CommonTable",{attrs:{total:e.chooseTotal,loading:e.chooseLoading,tooltipShow:!0,defColumns:e.chooseColumn,dataList:e.chooseTableData,options:e.chooseTableOptions,page:e.chooseParams.page,limit:e.chooseParams.pageSize,operations:e.chooseTableOperations},on:{pagination:e.chooseGetList,"update:page":function(t){return e.$set(e.chooseParams,"page",t)},"update:limit":function(t){return e.$set(e.chooseParams,"pageSize",t)}}})],1),e._v(" "),r("el-dialog",{attrs:{width:"600px",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[r("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1)}),[],!1,null,"6afd2304",null);t.default=n.exports},"Z/37":function(e,t,r){}}]);
//# sourceMappingURL=50.f26c3fea3fb9bd06d48f.js.map