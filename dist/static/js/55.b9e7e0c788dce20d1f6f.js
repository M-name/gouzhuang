(window.webpackJsonp=window.webpackJsonp||[]).push([[55],{"6NbS":function(t,e,a){"use strict";var i=a("cb50");a.n(i).a},OaV8:function(t,e,a){"use strict";a.r(e);var i={name:"userControl",data:function(){var t=this;return{loading:!1,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"收据查看",icon:"el-icon-tickets",handler:function(e){return t.handleUpdate(e)}},{label:"收据作废",style:{color:"#F56C6C"},icon:"iconfont icon-cancel",handler:function(e){return t.cancellation(e)},isShow:function(t){return 2!=t.receiptStatus}}],commonSearchList:[{prop:"receiptCode",label:"收据编码"},{prop:"uniformOrderCode",label:"统一订单编码"},{prop:"receiptStatus",label:"收据状态",type:"select",options:[]},{prop:"times",label:"开收据时间段",type:"datePicker"},{prop:"createBy",label:"办理员工"}],column:[{prop:"receiptCode",label:"收据编码"},{prop:"uniformOrderCode",label:"统一订单编码",widht:"180"},{prop:"paymentTime",label:"支付日期",widht:"180"},{prop:"paidAmount",label:"支付金额"},{prop:"receiptStatusStr",label:"收据状态"},{prop:"receiptTime",label:"开具时间"},{prop:"paymentDetail",label:"支付描述"},{prop:"createTime",label:"办理时间"},{prop:"createBy",label:"办理员工"}],tableData:[],total:0,form:{},params:{page:1,pageSize:20,receiptCode:void 0,uniformOrderCode:void 0,times:void 0,endTime:void 0,startTime:void 0,createBy:void 0}}},created:function(){var t=this;this.$request.orderGetEnum().then((function(e){t.dicList=e.data.data,t.commonSearchList.forEach((function(e){"select"==e.type&&"receiptStatus"==e.prop&&t.dicList.receiptStatusEnum.map((function(t){e.options.push({label:t.value,value:t.type})}))}))})),this.getList()},methods:{handleQuery:function(){this.params.page=1,this.params.times?(this.params.startTime=this.params.times[0],this.params.endTime=this.params.times[1],this.params.times=void 0):(this.params.startTime=void 0,this.params.endTime=void 0),this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,receiptCode:void 0,uniformOrderCode:void 0,times:void 0,endTime:void 0,startTime:void 0,createBy:void 0},this.handleQuery()},handleUpdate:function(t){window.open(t.receiptUrl)},cancellation:function(t){var e=this;this.$prompt("请输入作废原因","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputPattern:/\S/,inputErrorMessage:"作废作废原因不能为空"}).then((function(a){var i=a.value;e.$request.orderPaymentCancelled({id:t.id,remark:i}).then((function(t){200==t.data.status?(e.$message.success("提交作废成功"),e.getList()):e.$message.error(t.data.msg)}))})).catch((function(){e.$message({type:"info",message:"取消作废"})}))},getList:function(){var t=this;this.loading=!0,this.$request.receiptList(this.params).then((function(e){200==e.data.status?(t.tableData=e.data.data.rows,t.total=e.data.data.records,t.params.page=e.data.data.page,t.loading=!1):(t.loading=!1,t.$message.error(e.data.msg))}))},importExcel:function(){this.$request.downloadReceiptExcel(this.params)}}},r=(a("6NbS"),a("KHd+")),o=Object(r.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:t.params,searchList:t.commonSearchList},on:{resetQuery:t.resetQuery,handleQuery:t.handleQuery,"update:queryParams":function(e){t.params=e},"update:query-params":function(e){t.params=e}}})],1),t._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-download",size:"mini"},on:{click:t.importExcel}},[t._v("导出Excel文件")])],1)],1)],1),t._v(" "),a("CommonTable",{attrs:{total:t.total,loading:t.loading,defColumns:t.column,dataList:t.tableData,options:t.tableOptions,page:t.params.page,limit:t.params.pageSize,operations:t.tableOperations},on:{pagination:t.getList,"update:page":function(e){return t.$set(t.params,"page",e)},"update:limit":function(e){return t.$set(t.params,"pageSize",e)}}})],1)])}),[],!1,null,"673a423c",null);e.default=o.exports},cb50:function(t,e,a){}}]);
//# sourceMappingURL=55.b9e7e0c788dce20d1f6f.js.map