(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{"8DEy":function(e,t,a){var r=a("MhL/"),i=a("S5+y");a("k6n4")("keys",(function(){return function(e){return i(r(e))}}))},DI3i:function(e,t,a){},EPZ6:function(e,t,a){e.exports={default:a("xSEk"),__esModule:!0}},fflP:function(e,t,a){"use strict";a.r(t);var r=a("EPZ6"),i=a.n(r),o={name:"userControl",data:function(){var e=this;return{staffList:[],loading:!1,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"查看",icon:"el-icon-tickets",handler:function(t){return e.handleEdit(t)}},{label:"回访",icon:"iconfont icon-reuisit",handler:function(t){return e.handleUpdate(t)},isShow:function(e){return 0==e.revisitStatus}}],commonSearchList:[{prop:"buildingCode",label:"房屋编码 "},{prop:"userName",label:" 住户姓名"},{prop:"mobile",label:"住户手机"},{prop:"repaireCode",label:"工单编号"},{prop:"managerName",label:"维修员工"},{prop:"times",label:"完成时间",type:"datePicker"}],open:!1,title:"",column:[{prop:"createTime",label:"提交时间 "},{prop:"repaireCode",label:"工单编号",widht:"180"},{prop:"repairType",label:"报修类型",widht:"180"},{prop:"buildingCodeStr",label:"房屋编码"},{prop:"userName",label:"住户信息",render:function(e,t){return e("div",[t.row.userName+"/ "+t.row.mobile])}},{prop:"repaireStatus",label:"处理状态",formatter:function(t,a,r){return e.selectDictLabel(e.roleStatus,t.repaireStatus)}},{prop:"revisitStatusValue",label:"回访状态"},{prop:"finishTime",label:"完成时间"}],tableData:[],total:0,form:{},rules:{revisitTime:[{required:!0,message:"回访时间未选择",trigger:"change"}],revisitContent:[{required:!0,message:"回访内容不能为空",trigger:"change"}],createBy:[{required:!0,message:"回访人不能为空",trigger:"change"}]},roleStatus:[],params:{page:1,pageSize:20,userName:void 0,mobile:void 0,repaireCode:void 0,repaireStatus:60,buildingCode:void 0,times:void 0,endTime:void 0,startTime:void 0}}},created:function(){var e=this;this.$request.alarmGetStaff().then((function(t){for(var a=t.data.data,r=[],o=0;o<i()(a).length;o++){var s={label:"",options:[]};s.label=i()(a)[o];for(var n=0;n<a[i()(a)[o]].length;n++)s.options.push({value:a[i()(a)[o]][n].realName+","+a[i()(a)[o]][n].userCode,label:a[i()(a)[o]][n].realName});r.push(s)}e.staffList=r})),this.$request.findRepairAlleuems().then((function(t){for(var a=[],r=t.data.data,i=0;i<r.repaireProgressEnum.length;i++){var o={};o.value=r.repaireProgressEnum[i].type,o.label=r.repaireProgressEnum[i].value,a.push(o)}e.roleStatus=a})),this.getList()},methods:{selectDictLabel:function(e,t){var a=[];return i()(e).map((function(r){if(e[r].value==""+t)return a.push(e[r].label),!1})),a.join("")},handleQuery:function(){this.params.page=1,this.params.times?(this.params.startTime=this.params.times[0],this.params.endTime=this.params.times[1],this.params.times=void 0):(this.params.startTime=void 0,this.params.endTime=void 0),this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,userName:void 0,mobile:void 0,repaireCode:void 0,repaireStatus:60,buildingCode:void 0,times:void 0,endTime:void 0,startTime:void 0},this.handleQuery()},handleUpdate:function(e){this.reset(),this.open=!0,this.form.repaireCode=e.repaireCode,this.title="回访"},handleEdit:function(e){this.$router.push({path:"/detailInfo",name:"detailInfo",params:{type:2,code:e.repaireCode}})},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},submitForm:function(){var e=this;console.log(this.form),this.$refs.form.validate((function(t){t&&e.$request.saveRepaireRevisit(e.form).then((function(t){200===t.data.status?(e.msgSuccess("回访成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):that.$message.error(t.data.msg)}))}))},reset:function(){this.form={repaireCode:void 0,revisitTime:void 0,revisitContent:void 0,createBy:void 0}},Export:function(){this.$request.downloadExcel(this.params)},getList:function(){var e=this;this.loading=!0,this.$request.getRepairList(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.$message.error(t.data.msg),e.loading=!1)}))}}},s=(a("oeTG"),a("SsL+")),n=Object(s.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-download",size:"mini"},on:{click:e.Export}},[e._v("导出Excel")])],1)],1)],1),e._v(" "),a("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)}}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"750px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"回访时间:",prop:"revisitTime"}},[a("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.form.revisitTime,callback:function(t){e.$set(e.form,"revisitTime",t)},expression:"form.revisitTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"回访内容:",prop:"revisitContent"}},[a("el-input",{attrs:{type:"textarea",rows:3,placeholder:"请输入回访内容"},model:{value:e.form.revisitContent,callback:function(t){e.$set(e.form,"revisitContent",t)},expression:"form.revisitContent"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"回访人:",prop:"createBy"}},[a("el-select",{attrs:{placeholder:"请选择回访人"},model:{value:e.form.createBy,callback:function(t){e.$set(e.form,"createBy",t)},expression:"form.createBy"}},e._l(e.staffList,(function(t){return a("el-option-group",{key:t.label,attrs:{label:t.label}},e._l(t.options,(function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)})),1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)}),[],!1,null,"7f6825c9",null);t.default=n.exports},k6n4:function(e,t,a){var r=a("fCtq"),i=a("zpmP"),o=a("mf7F");e.exports=function(e,t){var a=(i.Object||{})[e]||Object[e],s={};s[e]=t(a),r(r.S+r.F*o((function(){a(1)})),"Object",s)}},oeTG:function(e,t,a){"use strict";a("DI3i")},xSEk:function(e,t,a){a("8DEy"),e.exports=a("zpmP").Object.keys}}]);
//# sourceMappingURL=28.8ceb62df1d26a38c5a93.js.map