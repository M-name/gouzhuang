(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{"+7H5":function(e,t,r){"use strict";var a=r("bitj");r.n(a).a},bitj:function(e,t,r){},u2MQ:function(e,t,r){"use strict";r.r(t);var a=(r("+7H5"),r("KHd+")),o=Object(a.a)({name:"addArticle",data:function(){return{open:!1,title:"",column:[{prop:"buildingCode",label:"楼幢编码",widht:"180"},{prop:"blockNo",label:"幢"},{prop:"unitNo",label:"单元"},{prop:"floorNo",label:"楼层"},{prop:"roomNo",label:"房间号"},{prop:"buildingArea",label:"房屋面积",widht:"180"},{prop:"roomNum",label:"房间数"},{prop:"hallNum",label:"客餐厅数"},{prop:"kitchenNum",label:"厨房数量"},{prop:"washroomNum",label:"卫生间数"},{prop:"createTime",label:"创建时间"},{prop:"remark",label:"备注"}],tableData:[],total:0,form:{},rules:{buildingArea:[{required:!0,message:"房屋面积不能为空",trigger:"change"},this.$rules.decimal(void 0,"change")],roomNum:[{required:!0,message:"房间数不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],hallNum:[{required:!0,message:"客餐厅数不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],kitchenNum:[{required:!0,message:"厨房数量不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],washroomNum:[{required:!0,message:"卫生间数不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],blockNo:[{required:!0,message:"楼幢不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],unitNo:[{required:!0,message:"单元不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],floorNo:[{required:!0,message:"楼层不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],roomNo:[{required:!0,message:"房间号不能为空",trigger:"change"},this.$rules.moreThanZeroNumber(void 0,"change")],displayOrder:[{required:!0,message:"显示顺序不能为空",trigger:"change"}]},params:{buildingCode:"",page:1,pageSize:20}}},mounted:function(){this.getList()},methods:{resetQuery:function(){this.params={buildingCode:"",page:1,pageSize:20},this.getList()},handleUpdata:function(e,t){var r=this;this.reset();var a=t.id;this.$request.houseFinDict(a).then((function(e){200===e.data.status?(r.form=e.data.data,r.open=!0,r.title="修改楼幢"):r.$message.error(e.data.msg)}))},cancel:function(){this.open=!1,this.reset(),this.$refs.form.resetFields()},submitForm:function(){var e=this;this.$refs.form.validate((function(t){t&&(e.form.createTime?e.$request.houseUpdateDict(e.form).then((function(t){200===t.data.status?(e.msgSuccess("修改成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})):e.$request.houseCreate(e.form).then((function(t){200===t.data.status?(e.msgSuccess("新增成功"),e.open=!1,e.getList(),e.$refs.form.resetFields()):e.$message.error(t.data.msg)})))}))},reset:function(){this.form={blockNo:"",unitNo:"",floorNo:"",roomNo:"",remark:"",buildingArea:"",roomNum:"",hallNum:"",kitchenNum:"",washroomNum:"",displayOrder:0}},addList:function(){this.reset(),this.open=!0,this.title="添加楼幢"},getList:function(){var e=this;this.$request.houseList(this.params).then((function(t){200===t.data.status?(e.tableData=t.data.data.rows,e.total=t.data.data.records,e.params.page=t.data.data.page):e.$message.error(t.data.msg)}))},handleSizeChange:function(e){this.params.pageSize=e,this.getList()},handleCurrentChange:function(e){this.params.page=e,this.getList()},handleDelete:function(e,t){var r=this;this.$confirm("是否确认删除该楼幢?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){r.$request.houseDelDict(t.id).then((function(e){200===e.data.status?(r.getList(),r.msgSuccess("删除成功")):r.$message.error(e.data.msg)}))})).catch((function(){}))}}},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"contant"},[r("div",{staticClass:"search"},[r("el-input",{staticStyle:{display:"inline-block",width:"270px"},attrs:{size:"small",placeholder:"请输入楼栋编码","prefix-icon":"el-icon-search"},model:{value:e.params.buildingCode,callback:function(t){e.$set(e.params,"buildingCode",t)},expression:"params.buildingCode"}}),e._v(" "),r("el-button",{staticClass:"searchs",staticStyle:{"margin-left":"20px"},attrs:{icon:"el-icon-search",size:"small",type:"primary"},on:{click:e.getList}},[e._v("搜索")]),e._v(" "),r("el-button",{staticClass:"reset",staticStyle:{"margin-left":"10px"},attrs:{icon:"el-icon-refresh",size:"small"},on:{click:e.resetQuery}},[e._v("重置")]),e._v(" "),r("el-button",{staticStyle:{float:"right"},attrs:{size:"small",type:"primary",icon:"el-icon-circle-plus-outline"},on:{click:e.addList}},[e._v("新增")])],1),e._v(" "),r("div",{staticClass:"table"},[r("el-table",{attrs:{"header-cell-style":{background:"#F4F4F4"},data:e.tableData}},[e._l(e.column,(function(e,t){return r("el-table-column",{key:t,attrs:{prop:e.prop,label:e.label,width:e.width}})})),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(r){return e.handleUpdata(t.$index,t.row)}}},[e._v("修改")]),e._v(" "),r("el-button",{staticClass:"delet",attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(r){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],2),e._v(" "),r("div",{staticClass:"pagination"},[r("el-pagination",{attrs:{"current-page":e.params.page,"page-sizes":[10,20,30,40],"page-size":e.params.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1),e._v(" "),r("el-dialog",{attrs:{title:e.title,"before-close":e.cancel,visible:e.open,width:"600px","append-to-body":""},on:{"update:visible":function(t){e.open=t}}},[r("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"120px"}},[r("el-row",[r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"楼幢",prop:"blockNo"}},[r("el-input",{attrs:{placeholder:"请输入楼幢"},model:{value:e.form.blockNo,callback:function(t){e.$set(e.form,"blockNo",t)},expression:"form.blockNo"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"单元",prop:"unitNo"}},[r("el-input",{attrs:{placeholder:"请输入单元"},model:{value:e.form.unitNo,callback:function(t){e.$set(e.form,"unitNo",t)},expression:"form.unitNo"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"楼层",prop:"floorNo"}},[r("el-input",{attrs:{placeholder:"请输入楼层"},model:{value:e.form.floorNo,callback:function(t){e.$set(e.form,"floorNo",t)},expression:"form.floorNo"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"房间号",prop:"roomNo"}},[r("el-input",{attrs:{placeholder:"请输入房间号"},model:{value:e.form.roomNo,callback:function(t){e.$set(e.form,"roomNo",t)},expression:"form.roomNo"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"房屋面积(㎡)",prop:"buildingArea"}},[r("el-input",{attrs:{placeholder:"请输入房屋面积"},model:{value:e.form.buildingArea,callback:function(t){e.$set(e.form,"buildingArea",t)},expression:"form.buildingArea"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"房间数",prop:"roomNum"}},[r("el-input",{attrs:{placeholder:"请输入房间数"},model:{value:e.form.roomNum,callback:function(t){e.$set(e.form,"roomNum",t)},expression:"form.roomNum"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"客餐厅数",prop:"hallNum"}},[r("el-input",{attrs:{placeholder:"请输入客餐厅数"},model:{value:e.form.hallNum,callback:function(t){e.$set(e.form,"hallNum",t)},expression:"form.hallNum"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:12}},[r("el-form-item",{attrs:{label:"厨房数量",prop:"kitchenNum"}},[r("el-input",{attrs:{placeholder:"请输入厨房数量"},model:{value:e.form.kitchenNum,callback:function(t){e.$set(e.form,"kitchenNum",t)},expression:"form.kitchenNum"}})],1)],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"卫生间数",prop:"washroomNum"}},[r("el-input",{attrs:{placeholder:"请输入卫生间数"},model:{value:e.form.washroomNum,callback:function(t){e.$set(e.form,"washroomNum",t)},expression:"form.washroomNum"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"显示顺序",prop:"displayOrder"}},[r("el-input-number",{attrs:{"controls-position":"right",min:1,max:100},model:{value:e.form.displayOrder,callback:function(t){e.$set(e.form,"displayOrder",t)},expression:"form.displayOrder"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"备注",prop:"remark"}},[r("el-input",{attrs:{placeholder:"请输入备注"},model:{value:e.form.remark,callback:function(t){e.$set(e.form,"remark",t)},expression:"form.remark"}})],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),r("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)}),[],!1,null,"7537b43c",null);t.default=o.exports}}]);
//# sourceMappingURL=53.79fd92042e1e03a23152.js.map