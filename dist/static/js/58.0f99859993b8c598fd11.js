(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{"/VW3":function(t,e,a){"use strict";var s=a("gQAK");a.n(s).a},"7UDS":function(t,e,a){"use strict";a.r(e);var s=a("MT78"),i=a.n(s),o={data:function(){return{batchCodes:void 0,loading:!1,single:!0,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[],commonSearchList:[{prop:"msgParentCode",label:"消息类型",type:"select",options:[]},{prop:"msgTypeCode",label:"消息子类型",type:"select",options:[]},{prop:"msgTitle",label:"消息标题"},{prop:"sendStatus",label:"发送状态",type:"select",options:[]},{prop:"sendChannel",label:"发送渠道",type:"select",options:[]},{prop:"isRead",label:"读取状态",type:"select",options:[]},{prop:"times",label:"发送时间段",type:"datePicker"}],column:[{prop:"msgParentCodeStr",label:"消息大类"},{prop:"msgTypeCodeStr",label:"消息子类"},{prop:"msgTitle",label:"消息标题"},{prop:"isUseTemplateStr",label:"是否使用模板"},{prop:"templateCode",label:"模板编码"},{prop:"isBatchSendStr",label:"是否批量发送"},{prop:"batchCode",label:"发送批次号"},{prop:"currBatchCode",label:"发送编码"},{prop:"sendAccount",label:"接收账号"},{prop:"isReadStr",label:"是否已读"},{prop:"sendChannelStr",label:"发送渠道"},{prop:"sendStatusStr",label:"发送状态"},{prop:"sendCount",label:"发送次数"},{prop:"sendTime",label:"发送时间"},{prop:"readTime",label:"读取时间"},{prop:"sendBy",label:"发送员工"}],tableData:[],total:0,ids:[],params:{page:1,pageSize:20,batchCode:void 0,times:void 0,endTime:void 0,startTime:void 0,msgParentCode:void 0,msgTypeCode:void 0,templateCode:void 0,sendStatus:void 0,sendChannel:void 0,isRead:void 0},pieData:{title:"全部发送记录统计",data:[]},barData:{title:"渠道发送记录统计",data:[]}}},watch:{"params.msgParentCode":{handler:function(t,e){var a=this;t&&(this.params.msgTypeCode=void 0,this.$request.msgTemplateTypeList({type:1,msgTypeCode:t}).then((function(t){a.commonSearchList.forEach((function(e){"select"==e.type&&"msgTypeCode"==e.prop&&(e.options=[],t.data.data.map((function(t){e.options.push({label:t.msgTypeName,value:t.msgTypeCode})})))}))})))},deep:!0,immediate:!0}},created:function(){var t=this;this.$request.msgTemplateTypeList({type:0}).then((function(e){t.commonSearchList.forEach((function(t){"select"==t.type&&"msgParentCode"==t.prop&&e.data.data.map((function(e){t.options.push({label:e.msgTypeName,value:e.msgTypeCode})}))}))})),this.$request.msgTemplateFindEnum().then((function(e){t.dicList=e.data.data,t.commonSearchList.forEach((function(e){"select"==e.type&&"sendStatus"==e.prop&&t.dicList.msgSendStatus.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"sendChannel"==e.prop&&t.dicList.templateChannelEnum.map((function(t){e.options.push({label:t.value,value:t.type})})),"select"==e.type&&"isRead"==e.prop&&t.dicList.msgIsReadEnum.map((function(t){e.options.push({label:t.value,value:t.type})}))}))}))},mounted:function(){var t=this;this.$route.params.code?(localStorage.setItem("batchCodes",this.$route.params.code),this.params.batchCode=this.$route.params.code,this.batchCodes=this.$route.params.code):(this.params.batchCode=localStorage.getItem("batchCodes"),this.batchCodes=localStorage.getItem("batchCodes")),this.$request.msgSendLeftCensus({batchCode:this.batchCodes}).then((function(e){t.pieData.data=e.data.data.map((function(t){return{name:t.name,value:t.num}})),t.creatPie()})),this.$request.msgSendRightCensus({batchCode:this.batchCodes}).then((function(e){t.barData.data=e.data.data,t.creatBar()}));var e=i.a.init(document.getElementById("bar")),a=i.a.init(document.getElementById("pie"));setTimeout((function(){window.addEventListener("resize",(function(){a.resize(),e.resize()}))}),50),this.getList()},methods:{creatPie:function(){i.a.init(document.getElementById("pie")).setOption({color:["#5470c6","#91cc75","#fac858"],title:{text:this.pieData.title,left:"center"},tooltip:{trigger:"item"},legend:{orient:"vertical",left:"right"},series:[{type:"pie",radius:"50%",data:this.pieData.data,emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})},creatBar:function(){var t=[],e=[],a=[],s=[];this.barData.data.map((function(i){t.push(i.name),i.list.map((function(t){"待发送"==t.name?e.push(t.num):"发送成功"==t.name?s.push(t.num):"发送失败"==t.name&&a.push(t.num)}))})),console.log(e,a,s),i.a.init(document.getElementById("bar")).setOption({color:["#5470c6","#91cc75","#fac858","#73c0de"],title:{text:this.barData.title},tooltip:{trigger:"axis"},legend:{data:["待发送","发送成功","发送失败"]},grid:{bottom:"30"},calculable:!0,xAxis:[{type:"category",data:t}],yAxis:[{type:"value"}],series:[{name:"待发送",type:"bar",barGap:"0",data:e},{name:"发送成功",type:"bar",data:s},{name:"发送失败",type:"bar",data:a}]})},handleSelectionChange:function(t){this.ids=t.map((function(t){return t.newsCode})),this.single=1!=t.length},handleQuery:function(){this.params.page=1,this.params.times?(this.params.startTime=this.params.times[0],this.params.endTime=this.params.times[1],this.params.times=void 0):(this.params.startTime=void 0,this.params.endTime=void 0),this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,batchCode:void 0,times:void 0,endTime:void 0,startTime:void 0,msgParentCode:void 0,msgTypeCode:void 0,templateCode:void 0,sendStatus:void 0,sendChannel:void 0,isRead:void 0},this.params.batchCode=this.batchCodes,this.handleQuery()},getList:function(){var t=this;this.loading=!0,this.$request.msgSendDetailList(this.params).then((function(e){200===e.data.status?(t.tableData=e.data.data.rows,t.total=e.data.data.records,t.params.page=e.data.data.page,t.loading=!1):(t.loading=!1,t.$message.error(e.data.msg))}))}}},n=(a("/VW3"),a("KHd+")),r=Object(n.a)(o,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content"},[a("div",{staticClass:"static"},[a("i",{staticClass:"el-icon-menu",staticStyle:{"font-size":"16px",color:"#409eff"}}),t._v(" "),a("span",{staticClass:"info"},[t._v("统计信息")]),t._v(" "),a("el-divider"),t._v(" "),t._m(0),t._v(" "),t._m(1)],1),t._v(" "),a("div",{staticClass:"list"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:t.params,searchList:t.commonSearchList},on:{resetQuery:t.resetQuery,handleQuery:t.handleQuery,"update:queryParams":function(e){t.params=e},"update:query-params":function(e){t.params=e}}})],1),t._v(" "),a("div",{staticClass:"operation"},[a("CommonTable",{attrs:{total:t.total,loading:t.loading,defColumns:t.column,dataList:t.tableData,options:t.tableOptions,page:t.params.page,limit:t.params.pageSize,operations:t.tableOperations},on:{pagination:t.getList,"update:page":function(e){return t.$set(t.params,"page",e)},"update:limit":function(e){return t.$set(t.params,"pageSize",e)},"selection-change":t.handleSelectionChange}})],1)])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"static-pie"},[e("div",{staticStyle:{height:"240px"},attrs:{id:"pie"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"static-bar"},[e("div",{staticStyle:{height:"240px"},attrs:{id:"bar"}})])}],!1,null,"732ce154",null);e.default=r.exports},gQAK:function(t,e,a){}}]);
//# sourceMappingURL=58.0f99859993b8c598fd11.js.map