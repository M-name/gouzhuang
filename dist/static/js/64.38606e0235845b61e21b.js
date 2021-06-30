(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{"9DKl":function(e,t,a){},Dczz:function(e,t,a){"use strict";a("9DKl")},uxAp:function(e,t,a){"use strict";a.r(t);var s=a("omC7"),i=a.n(s),r={name:"filterTable",data:function(){return{open:!1,title:"",column:[{prop:"feeCode",label:"费用编码",widht:"180"},{prop:"feeName",label:"费用类别"},{prop:"feeRate",label:"收费标准"},{prop:"feeContent",label:"费用说明"},{prop:"displayOrder",label:"显示顺序"},{prop:"isUsing",label:"是否启用",type:"switch"},{prop:"createTime",label:"创建时间"}],tableData:[],total:0,form:{},expensedetail:void 0,rules:{feeCode:[{required:!0,message:"费用编码不能为空",trigger:"change"}],feeName:[{required:!0,message:"费用类别不能为空",trigger:"change"}],feeRate:[{required:!0,message:"收费标准不能为空",trigger:"change"}],displayOrder:[{required:!0,message:"显示顺序不能为空",trigger:"change"}]},feeDictFirst:[],params:{feeCode:"",page:1,pageSize:20}}},created:function(){},mounted:function(){var e=this;this.$route.params.code?(localStorage.setItem("expensedetail",i()(this.$route.params)),this.expensedetail=this.$route.params):this.expensedetail=JSON.parse(localStorage.getItem("expensedetail")),this.params.parentCode=this.expensedetail.code,this.$request.feeFindEnum({feeCode:this.expensedetail.code}).then((function(t){for(var a=[],s=t.data.data,i=0;i<s.feeDictSecondEnum.length;i++){var r={};r.value=s.feeDictSecondEnum[i].feeCode,r.label=s.feeDictSecondEnum[i].feeName,a.push(r)}e.feeDictFirst=a})),this.getList()},methods:{resetQuery:function(){this.params={feeCode:"",page:1,pageSize:20,parentCode:this.expensedetail.code},this.getList()},changeSwitch:function(e){this.$request.feeUpdate(e).then((function(e){}))},handleUpdata:function(e,t){var a=this;this.reset();var s=t.id;this.$request.feeFind(s).then((function(e){200===e.data.status?(a.form=e.data.data,a.open=!0,a.title="修改字典值"):a.$message.error(e.data.msg)}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},submitForm:function(){var e=this;this.$refs.form.validate((function(t){t&&(e.form.createTime?e.$request.feeUpdate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("修改成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})):e.$request.feeCreateSecond(e.form).then((function(t){200===t.data.status?(e.msgSuccess("新增成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})))}))},reset:function(){this.form={feeCode:"",feeName:"",feeContent:"",parentCode:this.expensedetail.code,feeRate:void 0,displayOrder:0,isUsing:1}},addList:function(){this.reset(),this.open=!0,this.title="添加字典值"},getList:function(){var e=this;this.$request.feeAllSecond(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page):e.$message.error(t.data.msg)}))},handleSizeChange:function(e){this.params.pageSize=e,this.getList()},handleCurrentChange:function(e){this.s.page=e,this.getList()},handleDelete:function(e,t){var a=this;this.$confirm("是否确认删除该字典值?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){a.$request.feeDelSecond(t.id).then((function(){200===res.data.status?(a.getList(),a.msgSuccess("删除成功")):a.$message.error(res.data.msg)}))})).catch((function(){}))}}},n=(a("Dczz"),a("SsL+")),o=Object(n.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"contant"},[a("div",{staticClass:"search"},[a("el-select",{staticStyle:{display:"inline-block",width:"270px"},attrs:{clearable:"",placeholder:"请选择"},model:{value:e.params.feeCode,callback:function(t){e.$set(e.params,"feeCode",t)},expression:"params.feeCode"}},e._l(e.feeDictFirst,(function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1),e._v(" "),a("el-button",{staticClass:"searchs",staticStyle:{"margin-left":"20px"},attrs:{icon:"el-icon-search",size:"small",type:"primary"},on:{click:e.getList}},[e._v("搜索")]),e._v(" "),a("el-button",{staticClass:"reset",staticStyle:{"margin-left":"10px"},attrs:{icon:"el-icon-refresh",size:"small"},on:{click:e.resetQuery}},[e._v("重置")]),e._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{size:"small",type:"primary",icon:"el-icon-circle-plus-outline"},on:{click:e.addList}},[e._v("新增")])],1),e._v(" "),a("div",{staticClass:"table"},[a("el-table",{attrs:{"header-cell-style":{background:"#F4F4F4"},data:e.tableData}},[e._l(e.column,(function(t,s){return a("el-table-column",{key:s,attrs:{prop:t.prop,label:t.label,width:t.width},scopedSlots:e._u([{key:"default",fn:function(s){return["switch"===t.type?a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(t){return e.changeSwitch(s.row)}},model:{value:s.row.isUsing,callback:function(t){e.$set(s.row,"isUsing",t)},expression:"scope.row.isUsing"}}):a("span",[e._v(e._s(s.row[t.prop]))])]}}],null,!0)})})),e._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(a){return e.handleUpdata(t.$index,t.row)}}},[e._v("修改")]),e._v(" "),a("el-button",{staticClass:"delet",attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],2),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{"current-page":e.params.page,"page-sizes":[10,20,30,40],"page-size":e.params.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1),e._v(" "),a("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"600px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"费用编码",prop:"feeCode"}},[a("el-input",{attrs:{placeholder:"请输入字典编码"},model:{value:e.form.feeCode,callback:function(t){e.$set(e.form,"feeCode",t)},expression:"form.feeCode"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"费用类别",prop:"feeName"}},[a("el-input",{attrs:{placeholder:"请输入字典名称"},model:{value:e.form.feeName,callback:function(t){e.$set(e.form,"feeName",t)},expression:"form.feeName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"收费标准",prop:"feeRate"}},[a("el-input",{attrs:{placeholder:"请输入字典名称"},model:{value:e.form.feeRate,callback:function(t){e.$set(e.form,"feeRate",t)},expression:"form.feeRate"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"费用说明",prop:"feeContent"}},[a("el-input",{attrs:{placeholder:"请输入字典名称"},model:{value:e.form.feeContent,callback:function(t){e.$set(e.form,"feeContent",t)},expression:"form.feeContent"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"显示顺序",prop:"displayOrder"}},[a("el-input-number",{attrs:{"controls-position":"right",min:1,max:100},model:{value:e.form.displayOrder,callback:function(t){e.$set(e.form,"displayOrder",t)},expression:"form.displayOrder"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"是否启用",prop:"isUsing"}},[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.form.isUsing,callback:function(t){e.$set(e.form,"isUsing",t)},expression:"form.isUsing"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)}),[],!1,null,"882c3068",null);t.default=o.exports}}]);
//# sourceMappingURL=64.38606e0235845b61e21b.js.map