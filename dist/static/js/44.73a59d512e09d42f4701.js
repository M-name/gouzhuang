(window.webpackJsonp=window.webpackJsonp||[]).push([[44,85],{EiDx:function(e,t,a){"use strict";a.r(t);var s=a("UMR9"),n=a.n(s),i={name:"wangeditor",data:function(){return{editorContent:""}},props:{content:{type:String},disabled:{default:!1}},watch:{content:function(e,t){this.wEditor.txt.html(e)}},methods:{getContent:function(){return this.wEditor.txt.html()},setContent:function(){this.wEditor.txt.html(this.content)},clearContent:function(){this.wEditor.txt.clear()}},mounted:function(){var e=this,t=this;this.wEditor=new n.a(this.$refs.editor);var a=this.wEditor;a.config.customUploadImg=function(e,a){var s=new FormData;s.append("file",e[0]),t.$request.upload(s).then((function(e){a(e.data.data.split(",")[1])}))},a.config.uploadImgServer="http://127.0.0.1:8085/api/cos/upload",a.config.onchange=function(t){e.editorContent=t},a.create(),a.txt.html(this.content),this.disabled?a.$textElem.attr("contenteditable",!1):a.$textElem.attr("contenteditable",!0)}},l=a("SsL+"),o=Object(l.a)(i,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("div",{ref:"editor",staticStyle:{"text-align":"left"}})])}),[],!1,null,"69fd3103",null);t.default=o.exports},"OW/h":function(e,t,a){"use strict";a.r(t);var s={name:"filterTable",components:{wangEditor:a("EiDx").default},data:function(){var e=this;return{contentMessage:{message:"",short:"",mail:""},codes:{value:"msgTypeCode",label:"msgTypeName",lazy:!0,lazyLoad:function(t,a){var s=t.level;e.$request.msgTemplateTypeList({type:s,msgTypeCode:t.value}).then((function(t){if(200==t.data.status){var n=t.data.data;s>=1&&n.forEach((function(e){e.leaf=s>=1})),a(n)}else e.$message.error(t.msg)}))}},msgTypeName:"",treeData:[],chooseId:0,templateList:{inMessage:{templateChannelId:0,enabled:1,contentType:0,templateContentType:0,content:void 0},shortMessage:{templateChannelId:1,enabled:1,contentType:0,templateContentType:0,content:void 0},mailMessage:{templateChannelId:2,enabled:1,contentType:0,templateContentType:0,content:void 0}},open:!1,column:[{prop:"msgParentCodeStr",label:"消息大类",widht:"180"},{prop:"msgTypeCodeStr",label:"消息子类"},{prop:"templateCode",label:"模板编码"},{prop:"templateTitle",label:"模板标题"},{prop:"enabled",label:"是否启用",type:"switch"},{prop:"createTime",label:"创建时间"}],commonSearchList:[{prop:"msgParentCode",label:"消息类型",type:"select",options:[]},{prop:"msgTypeCode",label:"消息子类型",type:"select",options:[]},{prop:"templateCode",label:"模板编码"},{prop:"templateTitle",label:"模板标题"}],dicList:[],tableData:[],total:0,form:{},rules:{templateTitle:[{required:!0,message:"模板标题不能为空",trigger:"change"}],msgTypeCode:[{required:!0,message:"子消息类型未选择",trigger:"change"}]},checkedKeys:[],params:{msgParentCode:void 0,msgTypeCode:void 0,templateCode:void 0,templateTitle:void 0,page:1,pageSize:20}}},watch:{"params.msgParentCode":{handler:function(e,t){var a=this;e&&(this.params.msgTypeCode=void 0,this.$request.msgTemplateTypeList({type:1,msgTypeCode:e}).then((function(e){a.commonSearchList.forEach((function(t){"select"==t.type&&"msgTypeCode"==t.prop&&(t.options=[],e.data.data.map((function(e){t.options.push({label:e.msgTypeName,value:e.msgTypeCode})})))}))})))},deep:!0,immediate:!0}},mounted:function(){var e=this;this.$request.msgTemplateFindEnum().then((function(t){e.dicList=t.data.data,e.dicList.templateChannelEnum.map((function(t){e.treeData.push({id:t.type,label:t.value})}))})),this.$request.msgTemplateTypeList({type:0}).then((function(t){e.commonSearchList.forEach((function(e){"select"==e.type&&"msgParentCode"==e.prop&&t.data.data.map((function(t){e.options.push({label:t.msgTypeName,value:t.msgTypeCode})}))}))})),this.getList()},methods:{handleNodeClick:function(e){this.chooseId=e.id},changeSwitch:function(e){this.$request.msgTemplateIsEnabled({id:e.id,enabled:e.enabled}).then((function(e){}))},handleUpdata:function(e,t){var a=this;this.reset();var s=t.id,n=this;this.$request.msgTemplateFind(s).then((function(e){a.form=e.data.data,a.dicList.msgTypeDictEnum.forEach((function(e){(e.msgTypeCode=a.form.msgTypeCode)&&(n.msgTypeName=e.msgTypeName)}));var t=[];e.data.data.list.forEach((function(e){t.push(e.templateChannelId),0==e.templateChannelId&&(1==e.templateContentType?(a.contentMessage.message=e.content,a.templateList.inMessage=e,a.templateList.inMessage.content=""):a.templateList.inMessage=e),1==e.templateChannelId&&(a.templateList.shortMessage=e),2==e.templateChannelId&&(1==e.templateContentType?(a.contentMessage.mail=e.content,a.templateList.mailMessage=e,a.templateList.mailMessage.content=""):a.templateList.mailMessage=e)})),a.open=!0,a.checkedKeys=t,a.$nextTick((function(){n.$refs.tree.setCheckedKeys(t)}))}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},submitForm:function(){var e=this,t=[];try{this.checkedKeys.forEach((function(a,s,n){if(0==a){if(1==e.templateList.inMessage.templateContentType){if(""==e.$refs.wangeditor.editorContent)throw new Error("站内信模板内容不能为空");e.templateList.inMessage.content=e.$refs.wangeditor.editorContent}else if(null==e.templateList.inMessage.content||""==e.templateList.inMessage.content)throw new Error("站内信模板内容不能为空");t.push(e.templateList.inMessage)}else if(1==a){if(null==e.templateList.shortMessage.content||""==e.templateList.shortMessage.content)throw new Error("短信模板内容不能为空");t.push(e.templateList.shortMessage)}else if(2==a){if(1==e.templateList.mailMessage.templateContentType){if(""==e.$refs.mailWangeditor.editorContent)throw new Error("邮件模板内容不能为空");e.templateList.mailMessage.content=e.$refs.mailWangeditor.editorContent}else if(null==e.templateList.mailMessage.content||""==e.templateList.mailMessage.content)throw new Error("邮件模板内容不能为空");t.push(e.templateList.mailMessage)}}))}catch(e){return void this.$message.error(e.message)}this.form.list=t;var a=this;console.log(this.form.list),this.$refs.form.validate((function(t){if(t){if(e.form.list.length<=0)return void a.$message.warning("请选择需要提交的模板");e.form.createTime?e.$request.msgTemplateUpdate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("修改成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})):(e.form.msgTypeCode=e.form.msgTypeCode[1],e.$request.msgTemplateCreate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("新增成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})))}}))},reset:function(){var e=this;this.form={msgTypeCode:"",templateTitle:""},this.templateList={inMessage:{templateChannelId:0,enabled:1,contentType:0,templateContentType:0,content:void 0},shortMessage:{templateChannelId:1,enabled:1,contentType:0,templateContentType:0,content:void 0},mailMessage:{templateChannelId:2,enabled:1,contentType:0,templateContentType:0,content:void 0}},this.$nextTick((function(){e.$refs.tree.setCheckedKeys([]),e.$refs.tree.setCurrentKey(0)})),this.msgTypeName=""},handleQuery:function(){this.params.page=1,this.getList()},resetQuery:function(){this.params={msgParentCode:void 0,msgTypeCode:void 0,templateCode:void 0,templateTitle:void 0,page:1,pageSize:20},this.commonSearchList.forEach((function(e){"select"==e.type&&"msgTypeCode"==e.prop&&(e.options=[])})),this.handleQuery()},addList:function(){this.reset(),this.open=!0},getList:function(){var e=this;this.loading=!0,this.$request.msgTemplateList(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.loading=!1,e.$message.error(t.data.msg))}))},handleSizeChange:function(e){this.params.pageSize=e,this.getList()},handleCurrentChange:function(e){this.s.page=e,this.getList()},handleDelete:function(e,t){var a=this;this.$confirm("是否确认删除该字典值?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){a.$request.feeDelFirst(t.id).then((function(){a.getList(),a.msgSuccess("删除成功")}))})).catch((function(){}))},treeCheck:function(e,t){console.log(e,t.checkedKeys),this.checkedKeys=t.checkedKeys}}},n=(a("Zl5D"),a("SsL+")),i=Object(n.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"contant"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{size:"small",type:"primary",icon:"el-icon-circle-plus-outline"},on:{click:e.addList}},[e._v("新增")])],1)],1)],1),e._v(" "),a("div",{staticClass:"table"},[a("el-table",{attrs:{"header-cell-style":{background:"#F4F4F4"},data:e.tableData}},[e._l(e.column,(function(t,s){return a("el-table-column",{key:s,attrs:{prop:t.prop,label:t.label,width:t.width},scopedSlots:e._u([{key:"default",fn:function(s){return["switch"===t.type?a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(t){return e.changeSwitch(s.row)}},model:{value:s.row.enabled,callback:function(t){e.$set(s.row,"enabled",t)},expression:"scope.row.enabled"}}):a("span",[e._v(e._s(s.row[t.prop]))])]}}],null,!0)})})),e._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(a){return e.handleUpdata(t.$index,t.row)}}},[e._v("修改")]),e._v(" "),a("el-button",{staticClass:"delet",attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],2),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{"current-page":e.params.page,"page-sizes":[10,20,30,40],"page-size":e.params.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1),e._v(" "),a("el-dialog",{attrs:{"before-close":e.cancel,visible:e.open,width:"700px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"120px","label-position":"right"}},[a("i",{staticClass:"el-icon-s-custom"}),e._v(" "),a("span",[e._v("模板基本信息")]),e._v(" "),a("el-divider"),e._v(" "),a("el-form-item",{attrs:{label:"子消息类型",prop:"msgTypeCode"}},[a("el-cascader",{attrs:{placeholder:e.msgTypeName,props:e.codes},model:{value:e.form.msgTypeCode,callback:function(t){e.$set(e.form,"msgTypeCode",t)},expression:"form.msgTypeCode"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"模板标题",prop:"templateTitle"}},[a("el-input",{attrs:{placeholder:"请输入模板标题"},model:{value:e.form.templateTitle,callback:function(t){e.$set(e.form,"templateTitle",t)},expression:"form.templateTitle"}})],1),e._v(" "),a("i",{staticClass:"el-icon-s-custom"}),e._v(" "),a("span",[e._v("模板详情")]),e._v(" "),a("el-divider"),e._v(" "),a("p",{staticClass:"muban-title"},[a("span",{staticClass:"qudao"},[e._v("发送渠道")]),a("span",{staticClass:"nav"},[e._v("模板内容")])]),e._v(" "),a("div",{staticClass:"tree"},[a("el-tree",{ref:"tree",attrs:{data:e.treeData,"show-checkbox":"","node-key":"id","current-node-key":0,"default-checked-keys":e.checkedKeys},on:{check:e.treeCheck,"node-click":e.handleNodeClick}})],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:0==e.chooseId,expression:"chooseId == 0"}],staticStyle:{width:"81%",display:"inline-block"}},[a("el-form-item",{attrs:{label:"是否启用：",prop:"isUsing","label-width":"130px"}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.templateList.inMessage.enabled,callback:function(t){e.$set(e.templateList.inMessage,"enabled",t)},expression:"templateList.inMessage.enabled"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"模板内容类型：",prop:"buildingProp","label-width":"130px"}},[a("el-radio-group",{model:{value:e.templateList.inMessage.contentType,callback:function(t){e.$set(e.templateList.inMessage,"contentType",t)},expression:"templateList.inMessage.contentType"}},e._l(e.dicList.templateContentTypeEnum,(function(t,s){return a("el-radio",{key:s,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"模板内容格式：",prop:"buildingProp","label-width":"130px"}},[a("el-radio-group",{model:{value:e.templateList.inMessage.templateContentType,callback:function(t){e.$set(e.templateList.inMessage,"templateContentType",t)},expression:"templateList.inMessage.templateContentType"}},e._l(e.dicList.templateContentFormatEnum,(function(t,s){return a("el-radio",{key:s,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),0==e.templateList.inMessage.templateContentType?a("el-input",{attrs:{type:"textarea",autosize:{minRows:10},placeholder:"请输入内容"},model:{value:e.templateList.inMessage.content,callback:function(t){e.$set(e.templateList.inMessage,"content",t)},expression:"templateList.inMessage.content"}}):a("wang-editor",{ref:"wangeditor",attrs:{content:e.contentMessage.message}})],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:1==e.chooseId,expression:"chooseId == 1"}],staticStyle:{width:"81%",display:"inline-block"}},[a("el-form-item",{attrs:{label:"是否启用：",prop:"isUsing","label-width":"130px"}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.templateList.shortMessage.enabled,callback:function(t){e.$set(e.templateList.shortMessage,"enabled",t)},expression:"templateList.shortMessage.enabled"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"模板内容类型：",prop:"buildingProp","label-width":"130px"}},[a("el-radio-group",{model:{value:e.templateList.shortMessage.contentType,callback:function(t){e.$set(e.templateList.shortMessage,"contentType",t)},expression:"templateList.shortMessage.contentType"}},e._l(e.dicList.templateContentTypeEnum,(function(t,s){return a("el-radio",{key:s,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),0==e.templateList.shortMessage.templateContentType?a("el-input",{attrs:{type:"textarea",autosize:{minRows:10},placeholder:"请输入内容"},model:{value:e.templateList.shortMessage.content,callback:function(t){e.$set(e.templateList.shortMessage,"content",t)},expression:"templateList.shortMessage.content"}}):e._e()],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:2==e.chooseId,expression:"chooseId == 2"}],staticStyle:{width:"81%",display:"inline-block"}},[a("el-form-item",{attrs:{label:"是否启用：",prop:"isUsing","label-width":"130px"}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.templateList.mailMessage.enabled,callback:function(t){e.$set(e.templateList.mailMessage,"enabled",t)},expression:"templateList.mailMessage.enabled"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"模板内容类型：",prop:"buildingProp","label-width":"130px"}},[a("el-radio-group",{model:{value:e.templateList.mailMessage.contentType,callback:function(t){e.$set(e.templateList.mailMessage,"contentType",t)},expression:"templateList.mailMessage.contentType"}},e._l(e.dicList.templateContentTypeEnum,(function(t,s){return a("el-radio",{key:s,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"模板内容格式：",prop:"buildingProp","label-width":"130px"}},[a("el-radio-group",{model:{value:e.templateList.mailMessage.templateContentType,callback:function(t){e.$set(e.templateList.mailMessage,"templateContentType",t)},expression:"templateList.mailMessage.templateContentType"}},e._l(e.dicList.templateContentFormatEnum,(function(t,s){return a("el-radio",{key:s,attrs:{label:t.type}},[e._v(e._s(t.value))])})),1)],1),e._v(" "),0==e.templateList.mailMessage.templateContentType?a("el-input",{attrs:{type:"textarea",autosize:{minRows:10},placeholder:"请输入内容"},model:{value:e.templateList.mailMessage.content,callback:function(t){e.$set(e.templateList.mailMessage,"content",t)},expression:"templateList.mailMessage.content"}}):a("wang-editor",{ref:"mailWangeditor",attrs:{content:e.contentMessage.mail}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提 交")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)])}),[],!1,null,"65964876",null);t.default=i.exports},Zl5D:function(e,t,a){"use strict";a("djFG")},djFG:function(e,t,a){}}]);
//# sourceMappingURL=44.73a59d512e09d42f4701.js.map