(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{"1SZ3":function(t,e,a){"use strict";a.r(e);var n={name:"userControl",data:function(){var t=this;return{loading:!1,single:!0,tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"编辑",icon:"iconfont icon-edit",handler:function(e){return t.handleUpdate(e)}},{label:"结果排名",icon:"iconfont icon-rank",handler:function(e){return t.ranking(e)}},{label:"删除",style:{color:"#F56C6C"},icon:"el-icon-delete",handler:function(e){return t.handleDelete(e)},isShow:function(e){return t.isDelete(e)}},{label:"发布",icon:"iconfont icon-publish",handler:function(e){return t.handleIssue(e)},isShow:function(t){return 0==t.voteStatus}},{label:"下线",icon:"iconfont icon-offline",handler:function(e){return t.handleOffline(e)},isShow:function(t){return 1==t.voteStatus||0==t.voteStatus}}],commonSearchList:[{prop:"voteTitle",label:"标题"}],open:!1,detailOpen:!1,title:"",column:[{prop:"voteTitle",label:"标题"},{prop:"candidateTotalNum",label:"选手数量"},{prop:"voteTotalNum",label:"投票数"},{prop:"visitTotalNum",label:"访问数"},{prop:"voteStatusStr",label:"状态"},{prop:"voteBeginTime",label:"活动时间",render:function(t,e){return t("div",[t("div",{style:{color:"#666",display:"block"}},e.row.voteBeginTime),t("div",{style:{color:"#666",display:"block"}},e.row.voteEndTime)])}}],tableData:[],total:0,ids:[],params:{page:1,pageSize:20,voteTitle:void 0},satticsList:{}}},created:function(){this.getList(),this.getStatis()},methods:{isDelete:function(t){if(0==t.voteStatus||2==t.voteStatus)return!0;if(1==t.voteStatus){var e=new Date,a=t.voteBeginTime.replace("-","/");if(e<(a=new Date(Date.parse(a))))return!0}},getStatis:function(){var t=this;this.$request.voteStatistics().then((function(e){200==e.data.status?t.satticsList=e.data.data:t.$message.error(e.data.msg)}))},handleSelectionChange:function(t){this.ids=t.map((function(t){return t.id})),this.single=1!=t.length},handleQuery:function(){this.params.page=1,this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,voteTitle:void 0},this.handleQuery()},handleUpdate:function(t){this.$router.push({path:"/housingVoteDetail",name:"housingVoteDetail",params:{type:"update",voteCode:t.voteCode}})},ranking:function(t){this.$router.push({path:"/voteRanking",name:"voteRanking",params:{voteCode:t.voteCode}})},addList:function(){this.$router.push({path:"/housingVoteDetail",name:"housingVoteDetail",params:{type:"add"}})},getList:function(){var t=this;this.loading=!0,this.$request.voteList(this.params).then((function(e){200==e.data.status?(t.tableData=e.data.data.rows,t.total=e.data.data.records,t.params.page=e.data.data.page,t.loading=!1):(t.loading=!1,t.$message.error(e.data.msg))}))},handleDelete:function(t){var e=this;this.$confirm("是否确认删除该投票?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$request.voteDel(t.id).then((function(t){200==t.data.status?(e.getList(),e.msgSuccess("删除成功")):e.$message.error(t.data.msg)}))})).catch((function(){}))},handleIssue:function(t){var e=this;this.$confirm("是否确认发布该投票?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$request.voteUpdateStatus({voteCode:t.voteCode,voteStatus:1}).then((function(t){200==t.data.status?(e.getList(),e.msgSuccess("发布成功")):e.$message.error(t.data.msg)}))})).catch((function(){}))},handleOffline:function(t){var e=this;this.$confirm("是否确认下线该投票?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$request.voteUpdateStatus({voteCode:t.voteCode,voteStatus:2}).then((function(t){200==t.data.status?(e.getList(),e.msgSuccess("下线成功")):e.$message.error(t.data.msg)}))})).catch((function(){}))}}},i=(a("SnLC"),a("KHd+")),s=Object(i.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content"},[a("div",{staticClass:"wrap"},[a("el-button",{staticClass:"el-buttons",attrs:{type:"warning"}},[a("p",[t._v(t._s(t.satticsList.notStarted))]),t._v(" "),a("p",[t._v("未开始投票")])]),t._v(" "),a("el-button",{staticClass:"el-buttons",attrs:{type:"success"}},[a("p",[t._v(t._s(t.satticsList.conduct))]),t._v(" "),a("p",[t._v("进行中投票")])]),t._v(" "),a("el-button",{staticClass:"el-buttons",attrs:{type:"danger"}},[a("p",[t._v(t._s(t.satticsList.end))]),t._v(" "),a("p",[t._v("已结束投票")])]),t._v(" "),a("el-button",{staticClass:"el-buttons",attrs:{type:"primary"}},[a("p",[t._v(t._s(t.satticsList.userCount))]),t._v(" "),a("p",[t._v("投票选手总计")])])],1),t._v(" "),a("div",{staticClass:"operation"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:t.params,searchList:t.commonSearchList},on:{resetQuery:t.resetQuery,handleQuery:t.handleQuery,"update:queryParams":function(e){t.params=e},"update:query-params":function(e){t.params=e}}})],1),t._v(" "),a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus-outline",size:"mini"},on:{click:t.addList}},[t._v("创建投票")])],1)],1)],1),t._v(" "),a("CommonTable",{attrs:{total:t.total,loading:t.loading,defColumns:t.column,dataList:t.tableData,options:t.tableOptions,page:t.params.page,limit:t.params.pageSize,operations:t.tableOperations},on:{pagination:t.getList,"update:page":function(e){return t.$set(t.params,"page",e)},"update:limit":function(e){return t.$set(t.params,"pageSize",e)},"selection-change":t.handleSelectionChange}})],1)])}),[],!1,null,"f22ab00a",null);e.default=s.exports},SnLC:function(t,e,a){"use strict";var n=a("XjJF");a.n(n).a},XjJF:function(t,e,a){}}]);
//# sourceMappingURL=68.b31eda7bb07149de0ced.js.map