(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{"8WWg":function(e,t,a){},lGqy:function(e,t,a){"use strict";a.r(t);var n={name:"filterTable",data:function(){var e=this;return{activeName:"pc",loading:!1,wxloading:!1,commonSearchList:[{prop:"menuName",label:"菜单名称"}],tableOperations:[{label:"查看子菜单",icon:"iconfont icon-submenu",handler:function(t){return e.handleEdit(t)}},{label:"修改",icon:"el-icon-edit",handler:function(t){return e.handleUpdate(t)}},{label:"删除",style:{color:"#F56C6C"},icon:"el-icon-delete",handler:function(t){return e.handleDelete(t)}}],tableOptions:{border:!1,stripe:!1,highlightCurrentRow:!0,multiSelect:!0},open:!1,title:"",column:[{prop:"menuCode",label:"菜单编码",widht:"180"},{prop:"menuName",label:"菜单名称"},{prop:"iconName",label:"菜单图标"},{prop:"menuRoute",label:"菜单路由"},{prop:"displayOrder",label:"显示顺序"},{prop:"createTime",label:"创建时间"},{prop:"createBy",label:"创建员工"}],ids:[],wxids:[],tableData:[],wxtableData:[],total:0,wxtotal:0,form:{},rules:{menuCode:[{required:!0,message:"菜单编码不能为空",trigger:"blur"}],menuName:[{required:!0,message:"菜单名称不能为空",trigger:"blur"}],menuRoute:[{required:!0,message:"菜单路由不能为空",trigger:"blur"}]},multiple:!0,wxmultiple:!0,params:{menuName:void 0,page:1,menuType:0,pageSize:20},wxparams:{menuName:void 0,page:1,menuType:1,pageSize:20}}},mounted:function(){this.getList(),this.wxgetList()},methods:{handleSelectionChange:function(e){this.ids=e.map((function(e){return e.id})),this.single=1!=e.length,this.multiple=!e.length},wxhandleSelectionChange:function(e){this.wxids=e.map((function(e){return e.id})),this.wxmultiple=!e.length},handleQuery:function(){"pc"==this.activeName?(this.params.page=1,this.getList()):(this.wxparams.page=1,this.wxgetList())},resetQuery:function(){"pc"==this.activeName?this.params={menuName:void 0,page:1,menuType:0,pageSize:20}:this.wxparams={menuName:void 0,page:1,menuType:1,pageSize:20},this.handleQuery()},handleUpdate:function(e){var t=this;this.reset(),this.$request.roleFindMenu(e.id).then((function(e){200==e.data.status?(t.form=e.data.data,t.open=!0,t.title="修改菜单"):that.$message.error(e.data.msg)}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},submitForm:function(){var e=this;this.$refs.form.validate((function(t){t&&("pc"==e.activeName?e.form.menuType=0:e.form.menuType=1,e.form.createTime?e.$request.roleMenuUpdate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("修改成功"),e.open=!1,"pc"==e.activeName?e.getList():e.wxgetList(),e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})):e.$request.roleMenuCreate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("新增成功"),e.open=!1,"pc"==e.activeName?e.getList():e.wxgetList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})))}))},reset:function(){this.form={menuCode:void 0,menuName:void 0,iconName:void 0,menuRoute:void 0,displayOrder:0,menuType:void 0}},addList:function(){this.reset(),this.open=!0,this.title="新增菜单"},getList:function(){var e=this;this.loading=!0,this.$request.roleMenuList(this.params).then((function(t){200==t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page,e.loading=!1):(e.$message.error(t.data.msg),e.loading=!1)}))},wxgetList:function(){var e=this;this.wxloading=!0,this.$request.roleMenuList(this.wxparams).then((function(t){200==t.data.status?(e.wxtableData=t.data.data.rows,e.wxtotal=t.data.data.records,e.wxparams.page=t.data.data.page,e.wxloading=!1):(e.$message.error(t.data.msg),e.wxloading=!1)}))},handleEdit:function(e){"pc"==this.activeName?this.$router.push({path:"/pcSecondMenu",name:"pcSecondMenu",params:{code:e.menuCode,name:e.menuName}}):this.$router.push({path:"/wxSecondMenu",name:"wxSecondMenu",params:{code:e.menuCode,name:e.menuName}})},handleDelete:function(e){var t,a=this,n=[];e&&n.push(e.id),t="pc"==this.activeName?n.length>0?n:this.ids:n.length>0?n:this.wxids,this.$confirm("是否确认删除选中的菜单?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){a.$request.roleDelMenu(t).then((function(e){200==e.data.status?("pc"==a.activeName?a.getList():a.wxgetList(),a.msgSuccess("删除成功")):a.$message.error(e.data.msg)}))})).catch((function(){}))}}},i=(a("tiBX"),a("KHd+")),o=Object(i.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"contant"},[a("el-tabs",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"智慧物业PC端",name:"pc"}},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.params,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.params=t},"update:query-params":function(t){e.params=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus-outline",size:"mini"},on:{click:e.addList}},[e._v("新增")])],1),e._v(" "),a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{size:"mini",icon:"el-icon-delete",type:"danger",disabled:e.multiple},on:{click:function(t){return e.handleDelete()}}},[e._v("删除")])],1)],1)],1),e._v(" "),a("CommonTable",{attrs:{total:e.total,loading:e.loading,defColumns:e.column,dataList:e.tableData,options:e.tableOptions,page:e.params.page,limit:e.params.pageSize,operations:e.tableOperations},on:{pagination:e.getList,"update:page":function(t){return e.$set(e.params,"page",t)},"update:limit":function(t){return e.$set(e.params,"pageSize",t)},"selection-change":e.wxhandleSelectionChange}})],1)]),e._v(" "),a("el-tab-pane",{attrs:{label:"智慧物业小程序",name:"wx"}},[a("div",{staticStyle:{"padding-right":"20px",background:"#fff"}},[a("CommonSearch",{attrs:{queryParams:e.wxparams,searchList:e.commonSearchList},on:{resetQuery:e.resetQuery,handleQuery:e.handleQuery,"update:queryParams":function(t){e.wxparams=t},"update:query-params":function(t){e.wxparams=t}}})],1),e._v(" "),a("div",{staticClass:"operation"},[a("div",{staticClass:"button"},[a("el-row",{staticClass:"operations-row",attrs:{gutter:10}},[a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus-outline",size:"mini"},on:{click:e.addList}},[e._v("新增")])],1),e._v(" "),a("el-col",{attrs:{span:1.5}},[a("el-button",{attrs:{size:"mini",icon:"el-icon-delete",type:"danger",disabled:e.wxmultiple},on:{click:function(t){return e.handleDelete()}}},[e._v("删除")])],1)],1)],1),e._v(" "),a("CommonTable",{attrs:{total:e.wxtotal,loading:e.wxloading,defColumns:e.column,dataList:e.wxtableData,options:e.tableOptions,page:e.wxparams.page,limit:e.wxparams.pageSize,operations:e.tableOperations},on:{pagination:e.wxgetList,"update:page":function(t){return e.$set(e.wxparams,"page",t)},"update:limit":function(t){return e.$set(e.wxparams,"pageSize",t)},"selection-change":e.handleSelectionChange}})],1)])],1),e._v(" "),a("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"600px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"菜单编码：",prop:"menuCode"}},[a("el-input",{attrs:{placeholder:"请输入菜单编码"},model:{value:e.form.menuCode,callback:function(t){e.$set(e.form,"menuCode",t)},expression:"form.menuCode"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"菜单名称：",prop:"menuName"}},[a("el-input",{attrs:{placeholder:"请输入菜单名称"},model:{value:e.form.menuName,callback:function(t){e.$set(e.form,"menuName",t)},expression:"form.menuName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"菜单图标：",prop:"iconName"}},[a("el-input",{attrs:{placeholder:"请输入菜单图标名称"},model:{value:e.form.iconName,callback:function(t){e.$set(e.form,"iconName",t)},expression:"form.iconName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"菜单路由：",prop:"menuRoute"}},[a("el-input",{attrs:{placeholder:"请输入菜单路由"},model:{value:e.form.menuRoute,callback:function(t){e.$set(e.form,"menuRoute",t)},expression:"form.menuRoute"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"显示顺序：",prop:"displayOrder"}},[a("el-input-number",{attrs:{"controls-position":"right",min:1,max:100},model:{value:e.form.displayOrder,callback:function(t){e.$set(e.form,"displayOrder",t)},expression:"form.displayOrder"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)}),[],!1,null,"78e063ab",null);t.default=o.exports},tiBX:function(e,t,a){"use strict";var n=a("8WWg");a.n(n).a}}]);
//# sourceMappingURL=70.f47795a26de68a791f79.js.map