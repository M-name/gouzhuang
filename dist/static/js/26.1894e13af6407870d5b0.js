(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{"/tE4":function(e,t,a){"use strict";var s=a("TrsB");a.n(s).a},"0aV0":function(e,t,a){"use strict";a.r(t);var s=a("GQeE"),i=a.n(s),r={name:"userControl",data:function(){var e=this;return{open:!1,title:"",form:{},rules:{suggestContent:[{required:!0,message:"处理描述不能为空",trigger:"change"}]},single:!0,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"查看",icon:"el-icon-tickets",handler:function(t){return e.handleEdit(t)}},{label:"处理",icon:"iconfont icon-accept",handler:function(t){return e.handleUpdate(t)}}],commonSearchList:[{prop:"userName",label:" 住户姓名"},{prop:"mobile",label:" 住户手机号"},{prop:"suggestTitle",label:"问题"},{prop:"times",label:"提交时间段",type:"datePicker"},{prop:"suggestStatus",label:"处理状态",type:"select",options:[{value:0,label:"待处理"},{value:1,label:"已处理"}]}],column:[{prop:"visitorName",label:"住户信息 ",render:function(e,t){return e("div",[t.row.userName+"/ "+t.row.mobile])}},{prop:"suggestTitle",label:"问题"},{prop:"createTime",label:"提交日期"},{prop:"suggestImageCodes",label:"图片",type:"image"},{prop:"suggestStatus",label:"处理状态 ",formatter:function(e,t,a){return 0==e.suggestStatus?"待处理":"已处理"}}],isCheak:!1,tableData:[],total:0,ids:[],loading:!1,params:{page:1,pageSize:20,userName:void 0,mobile:void 0,suggestStatus:void 0,suggestTitle:void 0,times:void 0,endTime:void 0,startTime:void 0}}},created:function(){this.getList()},methods:{selectDictLabel:function(e,t){var a=[];return i()(e).map((function(s){if(e[s].value==""+t)return a.push(e[s].label),!1})),a.join("")},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!=e.length},reset:function(){this.form={suggestTitle:void 0,createTime:void 0,suggestImageCodes:void 0,suggestContent:void 0}},handleQuery:function(){this.params.page=1,this.params.times?(this.params.startTime=this.params.times[0],this.params.endTime=this.params.times[1],this.params.times=void 0):(this.params.startTime=void 0,this.params.endTime=void 0),this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,userName:void 0,mobile:void 0,suggestStatus:void 0,suggestTitle:void 0,times:void 0,endTime:void 0,startTime:void 0},this.handleQuery()},getList:function(){var e=this;this.loading=!0,this.$request.suggestFindPage(this.params).then((function(t){200==t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.$message.error(t.data.msg),e.loading=!1)}))},handleEdit:function(e){var t=this;this.reset();var a=e.suggestCode;this.$request.suggestFindOne(a).then((function(e){200==e.data.status?(t.form=e.data.data,t.open=!0,t.title="查看",t.isCheak=!0):t.$message.error(e.data.msg)}))},handleUpdate:function(e){var t=this;this.reset();var a=e.suggestCode;this.$request.suggestFindOne(a).then((function(e){200==e.data.status?(t.form=e.data.data,t.open=!0,t.isCheak=!1,t.title="处理"):t.$message.error(e.data.msg)}))},submitForm:function(){var e=this;this.$refs.form.validate((function(t){t&&e.$request.dealReply(e.form).then((function(t){200===t.data.status?(e.msgSuccess("处理成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)}))}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()}}},o=(a("/tE4"),a("KHd+")),n=Object(o.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)},"selection-change":e.handleSelectionChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"600px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"问题:",prop:"suggestTitle"}},[a("span",[e._v(e._s(e.form.suggestTitle))])]),e._v(" "),a("el-form-item",{attrs:{label:"日期:",prop:"createTime"}},[a("span",[e._v(e._s(e.form.createTime))])]),e._v(" "),a("el-form-item",{attrs:{label:"图片:",prop:"suggestImageCodes"}},[a("el-image",{staticStyle:{width:"100px",height:"100px"},attrs:{src:e.form.suggestImageCodes,"preview-src-list":[e.form.suggestImageCodes]}})],1),e._v(" "),e.isCheak?e._e():a("el-form-item",{attrs:{label:"处理描述",prop:"suggestContent"}},[a("el-input",{attrs:{type:"textarea",autosize:"",placeholder:"请输入处理描述"},model:{value:e.form.suggestContent,callback:function(t){e.$set(e.form,"suggestContent",t)},expression:"form.suggestContent"}})],1),e._v(" "),e.isCheak?a("el-form-item",{attrs:{label:"处理描述",prop:"suggestConten"}},[a("span",[e._v(e._s(e.form.suggestContent))])]):e._e()],1),e._v(" "),e.isCheak?e._e():a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)}),[],!1,null,"ca7b1d94",null);t.default=n.exports},GQeE:function(e,t,a){e.exports={default:a("iq4v"),__esModule:!0}},Mqbl:function(e,t,a){var s=a("JB68"),i=a("w6GO");a("zn7N")("keys",(function(){return function(e){return i(s(e))}}))},TrsB:function(e,t,a){},iq4v:function(e,t,a){a("Mqbl"),e.exports=a("WEpk").Object.keys},zn7N:function(e,t,a){var s=a("Y7ZC"),i=a("WEpk"),r=a("KUxP");e.exports=function(e,t){var a=(i.Object||{})[e]||Object[e],o={};o[e]=t(a),s(s.S+s.F*r((function(){a(1)})),"Object",o)}}}]);
//# sourceMappingURL=26.1894e13af6407870d5b0.js.map