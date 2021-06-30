(window.webpackJsonp=window.webpackJsonp||[]).push([[47,85],{ELBS:function(e,t,a){"use strict";a.r(t);var i={name:"userControl",components:{wangEditor:a("EiDx").default},data:function(){var e=this;return{form:{surveyTitle:void 0,surveyStatus:0,surveyBeginTime:void 0,surveyEndTime:void 0,surveyImageCode:void 0,surveyContent:"",surveyScope:[]},rules:{surveyTitle:[this.$rules.requiredSelect("标题不能为空","change")],surveyStatus:[this.$rules.requiredSelect("问卷状态未选择","change")],surveyBeginTime:[this.$rules.requiredSelect("起始时间未选择","change")],surveyEndTime:[this.$rules.requiredSelect("截止时间未选择","change")],surveyScope:[this.$rules.requiredSelect("问卷范围不能为空","blur")]},header:{"Content-Type":"multipart/form-data"},dialogImageUrl:"",dialogVisible:!1,open:!1,startDatePicker:this.beginDate(),endDatePicker:this.processDate(),title:"",loading:!1,single:!0,updataOrReusing:"",tableOptions:{stripe:!1,highlightCurrentRow:!0,multiSelect:!1},tableOperations:[{label:"发布",icon:"iconfont icon-publish",handler:function(t){return e.handleStatus(1,t)},isShow:function(e){return 0==e.surveyStatus}},{label:"下线",icon:"iconfont icon-offline",handler:function(t){return e.handleStatus(2,t)},isShow:function(e){return 1==e.surveyStatus}},{label:"作废",icon:"iconfont icon-cancel",handler:function(t){return e.handleStatus(3,t)},isShow:function(e){return 1==e.surveyStatus}},{label:"重用",icon:"iconfont icon-restart",handler:function(t){return e.handleUpdate("reusing",t)},isShow:function(e){return 0!=e.surveyStatus}},{label:"修改",icon:"el-icon-edit",handler:function(t){return e.handleUpdate("update",t)},isShow:function(e){return 0==e.surveyStatus}},{label:"删除",style:{color:"#F56C6C"},icon:"el-icon-delete",handler:function(t){return e.handleDelete(t)},isShow:function(e){return 0==e.surveyStatus}},{label:"查看",icon:"el-icon-tickets",handler:function(t){return e.handleCheack(t)}}],commonSearchList:[{prop:"surveyTitle",label:"问卷标题"},{prop:"surveyStatus",label:"问卷状态",type:"select",options:[]}],column:[{prop:"surveyTitle",label:"问卷标题"},{prop:"surveyStatusStr",label:"问卷状态"},{prop:"surveyScopeStr",label:"问卷对象"},{prop:"surveyBeginTime",label:"问卷起始"},{prop:"surveyEndTime",label:"问卷截止"}],tableData:[],total:0,ids:[],dictList:[],fileImg:[],params:{page:1,pageSize:20,surveyTitle:void 0,surveyStatus:void 0}}},created:function(){var e=this;this.$request.surveyFindEnum().then((function(t){var a=t.data.data;e.dictList=t.data.data,e.commonSearchList.forEach((function(e){"select"==e.type&&"surveyStatus"==e.prop&&a.surveyStatusEnum.map((function(t){e.options.push({label:t.value,value:t.type})}))}))})),this.getList()},methods:{uploadSectionFile:function(e){var t=this,a=new FormData;a.append("file",e.file),this.$request.upload(a).then((function(e){var a={url:e.data.data.split(",")[1]};t.fileImg.push(a),null!=t.form.surveyImageCode?t.form.surveyImageCode=t.form.surveyImageCode+","+e.data.data.split(",")[0]:t.form.surveyImageCode=e.data.data.split(",")[0]}))},getLocalImg:function(e){var t=e.url;this.dialogImageUrl=t,this.dialogVisible=!0},beginDate:function(){var e=this;return{disabledDate:function(t){if(e.form.surveyEndTime)return new Date(e.form.surveyEndTime).getTime()<t.getTime()}}},processDate:function(){var e=this;return{disabledDate:function(t){if(e.form.surveyBeginTime)return new Date(e.form.surveyBeginTime).getTime()>t.getTime()}}},submitForm:function(){var e=this;if(""!=this.$refs.wangeditors.editorContent){this.form.surveyContent=this.$refs.wangeditors.editorContent;var t=this;this.$refs.form.validate((function(a){a&&(e.form.surveyScope=e.form.surveyScope.toString(),e.form.createTime?"update"==t.updataOrReusing?e.$request.surveyUpdate(e.form).then((function(t){200==t.data.status?e.$router.push({path:"/questionAdd",name:"questionAdd",params:{code:t.data.data}}):e.$message.error(t.data.msg)})):"reusing"==t.updataOrReusing&&e.$request.surveyReusing(e.form).then((function(t){200==t.data.status?e.$router.push({path:"/questionAdd",name:"questionAdd",params:{code:t.data.data}}):e.$message.error(t.data.msg)})):e.$request.surveyCreatet(e.form).then((function(t){200==t.data.status?e.$router.push({path:"/questionAdd",name:"questionAdd",params:{code:t.data.data}}):e.$message.error(t.data.msg)})))}))}else this.$message.error("简介不能为空")},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.newsCode})),this.single=1!=e.length},handleQuery:function(){this.params.page=1,this.getList()},resetQuery:function(){this.params={page:1,pageSize:20,surveyTitle:void 0,surveyStatus:void 0},this.handleQuery()},addList:function(){this.reset(),this.open=!0,this.title="添加问卷"},handleUpdate:function(e,t){var a=this;this.reset();var i=t.id;this.$request.surveyFind(i).then((function(t){t.data.data.surveyScope=t.data.data.surveyScope.split(",").map(Number),a.form=t.data.data,a.open=!0,a.updataOrReusing=e,a.title="update"==e?"修改问卷":"重用问卷"}))},handleDelete:function(e){var t=this;this.$confirm("是否确认删除该问卷?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$request.surveyDel(e.id).then((function(){t.getList(),t.msgSuccess("删除成功")}))})).catch((function(){}))},handleStatus:function(e,t){var a=this,i="";1==e?i="发布":2==e?i="下线":3==e&&(i="作废"),this.$confirm("是否确认"+i+"该问卷?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var r={id:t.id,status:e};a.$request.surveyUpdateStatus(r).then((function(){a.getList(),a.msgSuccess(i+"成功")}))})).catch((function(){}))},handleCheack:function(e){this.$router.push({path:"/questionDetail",name:"questionDetail",params:{code:e.surveyCode,id:e.id}})},getList:function(){var e=this;this.loading=!0,this.$request.surveyList(this.params).then((function(t){200==t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):e.$message.error(t.data.msg)}))},reset:function(){this.form={surveyTitle:void 0,surveyStatus:0,surveyBeginTime:void 0,surveyEndTime:void 0,surveyImageCode:void 0,surveyContent:"",surveyScope:[]}},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()}}},r=(a("g+LW"),a("SsL+")),n=Object(r.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus-outline",size:"mini"},on:{click:e.addList}},[e._v("新增")])],1)],1)],1),e._v(" "),a("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)},"selection-change":e.handleSelectionChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"900px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"标题:",prop:"surveyTitle"}},[a("el-input",{attrs:{placeholder:"请输入标题"},model:{value:e.form.surveyTitle,callback:function(t){e.$set(e.form,"surveyTitle",t)},expression:"form.surveyTitle"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"问卷状态:",prop:"surveyStatus"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.surveyStatus,callback:function(t){e.$set(e.form,"surveyStatus",t)},expression:"form.surveyStatus"}},e._l(e.dictList.surveyStatusEnum,(function(e){return a("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"起始时间",prop:"surveyBeginTime"}},[a("el-date-picker",{staticStyle:{width:"200px"},attrs:{clearable:"","picker-options":e.startDatePicker,type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"起始时间"},model:{value:e.form.surveyBeginTime,callback:function(t){e.$set(e.form,"surveyBeginTime",t)},expression:"form.surveyBeginTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"截止时间",prop:"surveyEndTime"}},[a("el-date-picker",{staticStyle:{width:"200px"},attrs:{clearable:"",type:"date","picker-options":e.endDatePicker,"value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"截止时间"},model:{value:e.form.surveyEndTime,callback:function(t){e.$set(e.form,"surveyEndTime",t)},expression:"form.surveyEndTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"封面图:",prop:"surveyImageCode"}},[a("el-upload",{ref:"upload",attrs:{action:"uploadUrl","list-type":"picture-card","http-request":e.uploadSectionFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"file-list":e.fileImg}},[a("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1),e._v(" "),a("el-form-item",{attrs:{label:"简介:",prop:"surveyContent"}},[a("wang-editor",{ref:"wangeditors",attrs:{content:this.form.surveyContent}})],1),e._v(" "),a("el-form-item",{attrs:{label:"问卷范围:",prop:"surveyScope"}},[a("el-checkbox-group",{model:{value:e.form.surveyScope,callback:function(t){e.$set(e.form,"surveyScope",t)},expression:"form.surveyScope"}},e._l(e.dictList.liveTypeEnum,(function(t,i){return a("el-checkbox",{key:i,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1),e._v(" "),a("el-dialog",{attrs:{width:"600px",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1)}),[],!1,null,"740746e8",null);t.default=n.exports},EiDx:function(e,t,a){"use strict";a.r(t);var i=a("UMR9"),r=a.n(i),n={name:"wangeditor",data:function(){return{editorContent:""}},props:{content:{type:String},disabled:{default:!1}},watch:{content:function(e,t){this.wEditor.txt.html(e)}},methods:{getContent:function(){return this.wEditor.txt.html()},setContent:function(){this.wEditor.txt.html(this.content)},clearContent:function(){this.wEditor.txt.clear()}},mounted:function(){var e=this,t=this;this.wEditor=new r.a(this.$refs.editor);var a=this.wEditor;a.config.customUploadImg=function(e,a){var i=new FormData;i.append("file",e[0]),t.$request.upload(i).then((function(e){a(e.data.data.split(",")[1])}))},a.config.uploadImgServer="http://47.118.43.170:8080/api/cos/upload",a.config.onchange=function(t){e.editorContent=t},a.create(),a.txt.html(this.content),this.disabled?a.$textElem.attr("contenteditable",!1):a.$textElem.attr("contenteditable",!0)}},s=a("SsL+"),o=Object(s.a)(n,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("div",{ref:"editor",staticStyle:{"text-align":"left"}})])}),[],!1,null,"69fd3103",null);t.default=o.exports},"g+LW":function(e,t,a){"use strict";a("jaKx")},jaKx:function(e,t,a){}}]);
//# sourceMappingURL=47.1e7ead7789474d7aa5e7.js.map