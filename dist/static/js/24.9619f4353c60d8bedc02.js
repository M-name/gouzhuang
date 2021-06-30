(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{"0kka":function(t,e,a){"use strict";a.r(e);var n=a("EPZ6"),o=a.n(n),r={name:"userControl",data:function(){var t=this;return{form:{},open:!1,title:"",loading:!1,single:!0,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"撤销订单",icon:"iconfont icon-backout",handler:function(e){return t.handleDelete(e)}},{label:"开具收据",icon:"iconfont icon-receipt",handler:function(e){return t.writeReceipt(e)},isShow:function(t){return 0==t.receiptStatus&&1==t.tradeStatus}},{label:"收据查看",icon:"el-icon-tickets",handler:function(e){return t.receiptCheak(e)},isShow:function(t){return 2==t.receiptStatus}},{label:"退款",icon:"iconfont icon-refund",handler:function(e){return t.refund(e)},isShow:function(t){return 4==t.paymentStatus||1==t.tradeStatus}}],commonSearchList:[{prop:"uniformOrderCode",label:"订单编号"},{prop:"subOrderCodes",label:"子订单编号"},{prop:"tradeStatus",label:"交易状态",type:"select",options:[]},{prop:"paymentMethod",label:"支付方式",type:"select",options:[]},{prop:"receiptStatus",label:"收据状态",type:"select",options:[]},{prop:"receiptCode",label:"收据编码"},{prop:"times",label:"支付时间段",type:"datePicker"}],column:[{prop:"paidTime",label:"支付时间"},{prop:"uniformOrderCode",label:"统一订单编号"},{prop:"tradeNo",label:"流水号"},{prop:"paymentDetail",label:"支付描述"},{prop:"paymentMethod",label:"支付方式",formatter:function(e,a,n){return t.selectDictLabel(t.dicList.payTypeEnum,e.paymentMethod)}},{prop:"tradeStatus",label:"交易状态",formatter:function(e,a,n){return t.selectDictLabel(t.dicList.dealStatusEnum,e.tradeStatus)}},{prop:"payer",label:"支付人（账号）"},{prop:"amountPaid",label:"支付金额"},{prop:"paymentRemark",label:"支付备注"},{prop:"receiptStatus",label:"收据状态",formatter:function(e,a,n){return t.selectDictLabel(t.dicList.receiptStatusEnum,e.receiptStatus)}},{prop:"receiptCode",label:"收据编码"}],rules:{refundReason:[{required:!0,message:"退款原因不能为空",trigger:"change"}]},tableData:[],total:0,ids:[],dicList:[],params:{page:1,pageSize:20,times:void 0,endTime:void 0,startTime:void 0,receiptCode:void 0,receiptStatus:void 0,paymentMethod:void 0,tradeStatus:void 0,uniformOrderCode:void 0}}},created:function(){var t=this;this.$request.orderGetEnum().then((function(e){t.dicList=e.data.data,t.commonSearchList.forEach((function(e){"select"==e.type&&"paymentMethod"==e.prop&&t.dicList.payTypeEnum.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"receiptStatus"==e.prop&&t.dicList.receiptStatusEnum.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"tradeStatus"==e.prop&&t.dicList.dealStatusEnum.map((function(t){e.options.push({label:t.value,value:t.type})}))}))})),this.getList()},methods:{reset:function(){this.form={uniformOrderCode:void 0,refundReason:void 0,refundAmount:void 0,refundTo:void 0,paymentMethod:void 0}},submitForm:function(){var t=this;this.$refs.form.validate((function(e){e&&t.$request.createRefund(t.form).then((function(e){200===e.data.status?(t.msgSuccess("退款成功"),t.open=!1,t.getList(),t.$refs.form.resetFields()):t.$message.error(e.data.msg)}))}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},selectDictLabel:function(t,e){var a=[];return o()(t).map((function(n){if(t[n].type==""+e)return a.push(t[n].value),!1})),a.join("")},handleSelectionChange:function(t){this.ids=t.map((function(t){return t.newsCode})),this.single=1!=t.length},handleQuery:function(){this.params.page=1,this.params.times?(this.params.startTime=this.params.times[0],this.params.endTime=this.params.times[1]):(this.params.startTime=void 0,this.params.endTime=void 0),this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,times:void 0,endTime:void 0,startTime:void 0,receiptCode:void 0,receiptStatus:void 0,paymentMethod:void 0,tradeStatus:void 0,uniformOrderCode:void 0},this.handleQuery()},getList:function(){var t=this;console.log(this.params),this.loading=!0,this.$request.getPayment(this.params).then((function(e){200==e.data.status?(t.tableData=e.data.data.rows,t.total=e.data.data.records,t.params.page=e.data.data.page,t.loading=!1):(t.loading=!1,t.$message.error(e.data.msg))}))},handleDelete:function(t){var e=this;this.$confirm("是否确认撤销该支付记录?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$request.revocationPay(t.uniformOrderCode).then((function(t){200==t.data.status?(e.getList(),e.msgSuccess("撤销成功")):e.$message.error(t.data.msg)}))})).catch((function(){}))},refund:function(t){this.reset(),this.open=!0,this.form.uniformOrderCode=t.uniformOrderCode,this.form.refundTo=t.payer,this.form.refundAmount=t.amountPaid,this.form.paymentMethod=t.paymentMethod},writeReceipt:function(t){var e=this;this.$confirm("是否确认开具收据?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$request.orderDownloadPdf(t.uniformOrderCode).then((function(t){200==t.data.status?(e.getList(),e.msgSuccess("开具成功"),window.open(t.data.data)):e.$message.error(t.data.msg)}))})).catch((function(){}))},importExcel:function(){this.$request.orderPaymentDownloadExcel(this.params)},statistics:function(){this.$router.push({path:"/payRecordDetail",name:"payRecordDetail"})},receiptCheak:function(t){var e=this;this.$request.orderDownloadPdf(t.uniformOrderCode).then((function(t){200==t.data.status?window.open(t.data.data):e.$message.error(t.data.msg)}))}}},i=(a("dKyN"),a("SsL+")),s=Object(i.a)(r,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:t.params,searchList:t.commonSearchList},on:{resetQuery:t.resetQuery,handleQuery:t.handleQuery,"update:queryParams":function(e){t.params=e},"update:query-params":function(e){t.params=e}}})],1),t._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-upload2",size:"mini"},on:{click:t.importExcel}},[t._v("导出支付记录")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.statistics}},[t._v("统计分析")])],1)],1)],1),t._v(" "),a("CommonTable",{attrs:{total:t.total,loading:t.loading,defColumns:t.column,dataList:t.tableData,options:t.tableOptions,page:t.params.page,limit:t.params.pageSize,operations:t.tableOperations},on:{pagination:t.getList,"update:page":function(e){return t.$set(t.params,"page",e)},"update:limit":function(e){return t.$set(t.params,"pageSize",e)},"selection-change":t.handleSelectionChange}})],1),t._v(" "),a("el-dialog",{attrs:{title:t.title,"before-close":t.cancel,visible:t.open,width:"600px","append-to-body":""},on:{"update:visible":function(e){t.open=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,rules:t.rules,"label-width":"140px"}},[a("el-form-item",{attrs:{label:"接收退款用户："}},[a("p",[t._v(t._s(t.form.refundTo))])]),t._v(" "),a("el-form-item",{attrs:{label:"退款金额："}},[a("p",[t._v(t._s(t.form.refundAmount))])]),t._v(" "),a("el-form-item",{attrs:{label:"退款原因：",prop:"refundReason"}},[a("el-input",{attrs:{placeholder:"请输入退款原因"},model:{value:t.form.refundReason,callback:function(e){t.$set(t.form,"refundReason",e)},expression:"form.refundReason"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:t.submitForm}},[t._v("确 定")]),t._v(" "),a("el-button",{on:{click:t.cancel}},[t._v("取 消")])],1)],1)],1)}),[],!1,null,"42a10a0c",null);e.default=s.exports},"4lVe":function(t,e,a){},"8DEy":function(t,e,a){var n=a("MhL/"),o=a("S5+y");a("k6n4")("keys",(function(){return function(t){return o(n(t))}}))},EPZ6:function(t,e,a){t.exports={default:a("xSEk"),__esModule:!0}},dKyN:function(t,e,a){"use strict";a("4lVe")},k6n4:function(t,e,a){var n=a("fCtq"),o=a("zpmP"),r=a("mf7F");t.exports=function(t,e){var a=(o.Object||{})[t]||Object[t],i={};i[t]=e(a),n(n.S+n.F*r((function(){a(1)})),"Object",i)}},xSEk:function(t,e,a){a("8DEy"),t.exports=a("zpmP").Object.keys}}]);
//# sourceMappingURL=24.9619f4353c60d8bedc02.js.map