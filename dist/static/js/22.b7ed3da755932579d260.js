(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{"B8/p":function(e,t,a){"use strict";a.r(t);var i=a("GQeE"),n=a.n(i),o={name:"userControl",data:function(){var e=this;return{loading:!1,single:!0,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!0},tableOperations:[{label:"查看",icon:"el-icon-tickets",handler:function(t){return e.handleCheck(t)}}],commonSearchList:[{prop:"buildingCode",label:"房间编码"},{prop:"userName",label:"用户姓名"},{prop:"certificateCode",label:"证件编号"},{prop:"mobile",label:"电话号码"},{prop:"processStatus",label:"处理状态",type:"select",options:[]}],column:[{prop:"buildingCode",label:"房屋编码"},{prop:"userName",label:"用户姓名"},{prop:"certificateTypeIdStr",label:"证件类型"},{prop:"certificateCode",label:"证件号码"},{prop:"userSexStr",label:"性别"},{prop:"contactMethod",label:"联系人电话"},{prop:"mobile",label:"电话"},{prop:"processStatusStr",label:"处理状态"},{prop:"createTime",label:"创建时间"}],tableData:[],total:0,ids:[],form:{},dicLists:{},params:{page:1,pageSize:20,buildingCode:void 0,userName:void 0,certificateCode:void 0,mobile:void 0,processStatus:void 0}}},created:function(){var e=this;this.$request.detailFindEnum().then((function(t){e.dicLists=t.data.data,e.commonSearchList.forEach((function(t){"select"==t.type&&"processStatus"==t.prop&&e.dicLists.processStatusEnum.map((function(e){t.options.push({label:e.value,value:e.type})}))}))})),this.getList()},methods:{selectDictLabel:function(e,t){var a=[];return n()(e).map((function(i){if(e[i].value==""+t)return a.push(e[i].label),!1})),a.join("")},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!=e.length},handleQuery:function(){this.params.page=1,this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,buildingCode:void 0,userName:void 0,certificateCode:void 0,mobile:void 0,processStatus:void 0},this.handleQuery()},handleCheck:function(e){this.$router.push({path:"/tenantDetail",name:"tenantDetail",params:{isOrNo:e.is,id:e.id}})},getList:function(){var e=this;this.loading=!0,this.$request.userRenterList(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.loading=!1,e.$message.error(t.data.msg))}))},handleDelete:function(e){var t=this;this.ids[0],this.$confirm("是否确认解除绑定?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$request.buildingUnbind(e.id).then((function(){200===res.data.status?(t.getList(),t.msgSuccess("解除成功")):t.$message.error(res.data.msg)}))})).catch((function(){}))}}},s=(a("OQCe"),a("KHd+")),r=Object(s.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)},"selection-change":e.handleSelectionChange}})],1)])}),[],!1,null,"a6825650",null);t.default=r.exports},GQeE:function(e,t,a){e.exports={default:a("iq4v"),__esModule:!0}},IU5k:function(e,t,a){},Mqbl:function(e,t,a){var i=a("JB68"),n=a("w6GO");a("zn7N")("keys",(function(){return function(e){return n(i(e))}}))},OQCe:function(e,t,a){"use strict";var i=a("IU5k");a.n(i).a},iq4v:function(e,t,a){a("Mqbl"),e.exports=a("WEpk").Object.keys},zn7N:function(e,t,a){var i=a("Y7ZC"),n=a("WEpk"),o=a("KUxP");e.exports=function(e,t){var a=(n.Object||{})[e]||Object[e],s={};s[e]=t(a),i(i.S+i.F*o((function(){a(1)})),"Object",s)}}}]);
//# sourceMappingURL=22.b7ed3da755932579d260.js.map