(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{GQeE:function(e,a,t){e.exports={default:t("iq4v"),__esModule:!0}},Mqbl:function(e,a,t){var l=t("JB68"),i=t("w6GO");t("zn7N")("keys",(function(){return function(e){return i(l(e))}}))},ee5G:function(e,a,t){"use strict";var l=t("srNY");t.n(l).a},iq4v:function(e,a,t){t("Mqbl"),e.exports=t("WEpk").Object.keys},srNY:function(e,a,t){},z81p:function(e,a,t){"use strict";t.r(a);var l=t("gDS+"),i=t.n(l),r=t("GQeE"),o=t.n(r),s={data:function(){var e=/^1(3|4|5|6|7|8|9)\d{9}$/,a=this;return{editPeople:{},dialogImageUrl:"",dialogVisible:!1,faceFileImg:[],faceUploadImgList:[],infoFileImg:[],infoUploadImgList:[],liveFileImg:[],liveUploadImgList:[],header:{"Content-Type":"multipart/form-data"},address:"",dicLists:{},props:{value:"areaCode",label:"areaName"},build:"",unit:"",codes:{value:"code",label:"name",lazy:!0,lazyLoad:function(e,t){e.data&&(e.add="");var l=e.level;1==l?(a.build=e.value,e.add=e.value):2==l?(a.unit=e.value,e.add=a.build+","+e.value):3==l&&(e.add=a.build+","+a.unit+","+e.value),a.$request.houseListAll({type:l,code:e.add}).then((function(e){if(200==e.data.status){var i=e.data.data;l>1&&i.forEach((function(e){e.leaf=l>=3})),t(i)}else a.$message.error(e.msg)}))}},areaList:[],activeName:"first",form:{accessTypeIds:[0],isOverseas:void 0,userSex:void 0,cardCode:void 0,countryId:void 0,userName:void 0,createBy:JSON.parse(localStorage.getItem("userInfo")).userCode,certificateTypeId:void 0,birthday:void 0,faceAuthStatus:0,certificateCode:void 0,nationId:void 0,politicsStatus:void 0,areaCode:void 0,maritalStatus:void 0,areaAddr:void 0,mobile:void 0,eduLevelId:void 0,contactMethod:void 0,careerId:void 0,jobTitle:void 0,unitName:void 0,unitAddr:void 0},placeForm:{buildingCode:void 0,liveTypeId:void 0,liveReasonId:void 0,liveStatus:void 0,liveCertificateId:void 0,certificateImageCodes:void 0,certificateStartTime:void 0,certificateExpireTime:void 0,isLongTerm:0,createBy:JSON.parse(localStorage.getItem("userInfo")).userCode},newsTypeMap:[],placeRules:{buildingCode:[{required:!0,message:"居住地址不能为空",trigger:"change"}],liveTypeId:[{required:!0,message:"居住类型不能为空",trigger:"change"}],liveReasonId:[{required:!0,message:"居住事由不能为空",trigger:"change"}],liveStatus:[{required:!0,message:"居住状态不能为空",trigger:"change"}],liveCertificateId:[{required:!0,message:"居住证件不能为空",trigger:"change"}],isLongTerm:[{required:!0,message:"居住证件是否长期有效未选择",trigger:"change"}]},peopleRules:{accessTypeIds:[{required:!0,message:"门卡类型为空",trigger:"blur"}],isOverseas:[{required:!0,message:"是否为境外人员不能为空",trigger:"change"}],userSex:[{required:!0,message:"性别不能为空",trigger:"change"}],countryId:[{required:!0,message:"国籍不能为空",trigger:"change"}],userName:[{required:!0,message:"住户姓名不能为空",trigger:"change"}],certificateTypeId:[{required:!0,message:"证件类型不能为空",trigger:"change"}],faceAuthStatus:[{required:!0,message:"人脸对比状态未选择",trigger:"change"}],birthday:[{required:!0,message:"住户生日不能为空",trigger:"change"}],certificateCode:[{required:!0,message:"证件编码不能为空",trigger:"change"}],nationId:[{required:!0,message:"名族不能为空",trigger:"change"}],politicsStatus:[{required:!0,message:"政治面貌不能为空",trigger:"change"}],areaCode:[{required:!0,message:"户籍省县不能为空",trigger:"change"}],maritalStatus:[{required:!0,message:"婚姻状况不能为空",trigger:"change"}],areaAddr:[{required:!0,message:"户籍地址不能为空",trigger:"change"}],contactMethod:[{required:!0,message:"联系人电话不能为空",trigger:"change"},this.$rules.mobile("请输入正确手机号","change")],mobile:{required:!1,validator:function(a,t,l){if(null!=t&&""!=t){if(!e.test(t))return l(new Error("请输入正确手机号"));l()}else l()},trigger:"blur"}}}},created:function(){var e=this;this.$request.findAlleuemsNews().then((function(a){for(var t=[],l=a.data.data,i=0;i<o()(l.newsTypeMap).length;i++){var r={};r.value=o()(l.newsTypeMap)[i],r.label=l.newsTypeMap[o()(l.newsTypeMap)[i]],t.push(r)}e.newsTypeMap=t})),this.$request.areaListAll().then((function(a){e.areaList=a.data.data})),this.$request.detailFindEnum().then((function(a){e.dicLists=a.data.data}))},mounted:function(){var e=this;this.$route.params.code?(localStorage.setItem("editPeople",i()(this.$route.params)),this.editPeople=this.$route.params,console.log(this.editPeople)):this.editPeople=JSON.parse(localStorage.getItem("editPeople"));var a=this;this.$request.userHouseFind(this.editPeople.id).then((function(t){if(200===t.data.status){if(e.liveFileImg=[],e.liveUploadImgList=[],t.data.data.certificateImageCodes)for(var l=t.data.data.certificateImageCodes.split(","),i=t.data.data.certificateImageCodesUrl.split(","),r=0;r<l.length;r++)a.liveUploadImgList.push({code:l[r],url:i[r]}),e.liveFileImg.push({uid:l[r],url:i[r]});var o=[];t.data.data.certificateStartTime&&(o.push(t.data.data.certificateStartTime,t.data.data.certificateExpireTime),t.data.data.certificateExpireTime=o),t.data.data.buildingCode=t.data.data.buildingCode.split("-"),e.address=t.data.data.buildingCode[0]+"幢/"+t.data.data.buildingCode[1]+"单元/"+t.data.data.buildingCode[2]+"层/"+t.data.data.buildingCode[3]+"室",e.placeForm=t.data.data}else e.$message.error(t.data.msg)})),this.$request.peopleFind(this.editPeople.code).then((function(t){if(200===t.data.status){if(e.faceFileImg=[],e.faceUploadImgList=[],e.infoFileImg=[],e.infoUploadImgList=[],t.data.data.faceImageCode&&(e.faceFileImg.push({uid:1,url:t.data.data.faceImageCodeUrl}),e.faceUploadImgList.push({code:t.data.data.faceImageCode,url:t.data.data.faceImageCodeUrl})),t.data.data.certificateImageCodes)for(var l=t.data.data.certificateImageCodes.split(","),i=t.data.data.certificateImageCodesUrl.split(","),r=0;r<l.length;r++)e.infoFileImg.push({uid:l[r],url:i[r]}),a.infoUploadImgList.push({code:l[r],url:i[r]});if(t.data.data.accessTypeIds){var o=t.data.data.accessTypeIds.split(",");t.data.data.accessTypeIds=o.map(Number)}else t.data.data.accessTypeIds=[];t.data.data.areaCode&&(t.data.data.areaCode=t.data.data.areaCode.split(",")),e.form=t.data.data}else e.$message.error(t.data.msg)}))},methods:{getLocalImgs:function(e,a){var t=this;this.faceUploadImgList.forEach((function(a,l){a.url==e.url&&t.faceUploadImgList.splice(l,1)})),console.log(this.faceUploadImgList)},infoGetLocalImgs:function(e,a){var t=this;this.infoUploadImgList.forEach((function(a,l){a.url==e.url&&t.infoUploadImgList.splice(l,1)})),console.log(this.infoUploadImgList)},liveGetLocalImgs:function(e,a){var t=this;this.liveUploadImgList.forEach((function(a,l){a.url==e.url&&t.liveUploadImgList.splice(l,1)})),console.log(this.liveUploadImgList)},uploadSectionFile:function(e){var a=this,t=new FormData;t.append("file",e.file),this.$request.upload(t).then((function(e){var t={url:e.data.data.split(",")[1]};a.faceFileImg.push(t),a.faceUploadImgList.push({code:e.data.data.split(",")[0],url:e.data.data.split(",")[1]}),console.log(a.faceUploadImgList)}))},infoUploadSectionFile:function(e){var a=this,t=new FormData;t.append("file",e.file),this.$request.upload(t).then((function(e){var t={url:e.data.data.split(",")[1]};a.infoFileImg.push(t),a.infoUploadImgList.push({code:e.data.data.split(",")[0],url:e.data.data.split(",")[1]}),console.log(a.infoUploadImgList)}))},liveUploadSectionFile:function(e){var a=this,t=new FormData;t.append("file",e.file),this.$request.upload(t).then((function(e){var t={url:e.data.data.split(",")[1]};a.liveFileImg.push(t),a.liveUploadImgList.push({code:e.data.data.split(",")[0],url:e.data.data.split(",")[1]}),console.log(a.liveUploadImgList)}))},getLocalImg:function(e){var a=e.url;this.dialogImageUrl=a,this.dialogVisible=!0},back:function(e){this.$router.go(-1),this.$store.dispatch("removeTab",{tabItem:e,fullPath:this.$route.fullPath,router:this.$router})},edit:function(){var e=this,a=this;this.$refs.form.validate((function(t){if(t){e.form.accessTypeIds=e.form.accessTypeIds.toString(),e.form.areaCode=e.form.areaCode.toString();var l=[];if(e.infoUploadImgList.length>0){for(var i=0;i<e.infoUploadImgList.length;i++)l.push(e.infoUploadImgList[i].code),console.log(e.infoUploadImgList[i].code);e.form.certificateImageCodes=l.toString()}e.faceUploadImgList.length>0&&(e.form.faceImageCode=e.faceUploadImgList[0].code),e.$request.userUpdate(e.form).then((function(t){if(200===t.data.status){if(e.faceFileImg=[],e.faceUploadImgList=[],e.infoFileImg=[],e.infoUploadImgList=[],e.msgSuccess("修改成功"),t.data.data.faceImageCode&&(e.faceFileImg.push({uid:1,url:t.data.data.faceImageCodeUrl}),e.faceUploadImgList.push({code:t.data.data.faceImageCode,url:t.data.data.faceImageCodeUrl})),t.data.data.certificateImageCodes)for(var l=t.data.data.certificateImageCodes.split(","),i=t.data.data.certificateImageCodesUrl.split(","),r=0;r<l.length;r++)e.infoFileImg.push({uid:l[r],url:i[r]}),a.infoUploadImgList.push({code:l[r],url:i[r]});var o=t.data.data.accessTypeIds.split(",");t.data.data.accessTypeIds=o.map(Number),t.data.data.areaCode=t.data.data.areaCode.split(","),e.form=t.data.data}else e.$message.error(t.data.msg)}))}}))},liveSubmitForm:function(){var e=this;console.log(this.placeForm);var a=this;if(this.form.userCode)return this.placeForm.certificateExpireTime||"0"!=this.placeForm.isLongTerm?void this.$refs.placeForm.validate((function(t){if(console.log(t),t){e.placeForm.userCode=e.form.userCode,e.placeForm.buildingCode=e.placeForm.buildingCode.toString(),e.placeForm.certificateExpireTime&&(e.placeForm.certificateStartTime=e.placeForm.certificateExpireTime[0],e.placeForm.certificateExpireTime=e.placeForm.certificateExpireTime[1]);var l=[];if(e.liveUploadImgList.length>0){for(var i=0;i<e.liveUploadImgList.length;i++)l.push(e.liveUploadImgList[i].code),console.log(e.liveUploadImgList[i].code);e.placeForm.certificateImageCodes=l.toString()}e.$request.createOrUpdate(e.placeForm).then((function(t){if(200===t.data.status){if(e.msgSuccess("提交成功"),e.liveFileImg=[],e.liveUploadImgList=[],t.data.data.certificateImageCodes)for(var l=t.data.data.certificateImageCodes.split(","),i=t.data.data.certificateImageCodesUrl.split(","),r=0;r<l.length;r++)a.liveUploadImgList.push({code:l[r],url:i[r]}),e.liveFileImg.push({uid:l[r],url:i[r]});var o=[];t.data.data.certificateStartTime&&(o.push(t.data.data.certificateStartTime,t.data.data.certificateExpireTime),t.data.data.certificateExpireTime=o),t.data.data.buildingCode=t.data.data.buildingCode.split("-"),e.address=t.data.data.buildingCode[0]+"幢/"+t.data.data.buildingCode[1]+"单元/"+t.data.data.buildingCode[2]+"层/"+t.data.data.buildingCode[3]+"室",e.placeForm=t.data.data}else e.$message.error(t.data.msg)}))}})):(console.log("1345"),void this.$message.warning("居住证不为长期有效时居住证件有效期不能为空！"));this.$message.warning("请先填写基本信息")}}},d=(t("ee5G"),t("KHd+")),c=Object(d.a)(s,(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"contant"},[t("div",{staticClass:"back"},[t("i",{staticClass:"el-icon-back icon",on:{click:function(a){return e.back(e.$store.getters.rightNav)}}})]),e._v(" "),t("div",{staticClass:"left"},[t("span",{staticClass:"title"},[e._v("基本信息")]),e._v(" "),t("el-button",{staticClass:"people-submit",attrs:{type:"primary"},on:{click:e.edit}},[e._v("修改")]),e._v(" "),t("el-divider",{attrs:{"content-position":"right"}}),e._v(" "),t("el-form",{ref:"form",attrs:{model:e.form,rules:e.peopleRules,"label-width":"120px"}},[t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"门卡类型：",prop:"accessTypeIds"}},[t("el-checkbox-group",{model:{value:e.form.accessTypeIds,callback:function(a){e.$set(e.form,"accessTypeIds",a)},expression:"form.accessTypeIds"}},e._l(e.dicLists.accessTypeEnum,(function(a,l){return t("el-checkbox",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"境外人员：",prop:"isOverseas"}},[t("el-radio-group",{model:{value:e.form.isOverseas,callback:function(a){e.$set(e.form,"isOverseas",a)},expression:"form.isOverseas"}},e._l(e.dicLists.yesOrNoEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"性别：",prop:"userSex"}},[t("el-radio-group",{model:{value:e.form.userSex,callback:function(a){e.$set(e.form,"userSex",a)},expression:"form.userSex"}},e._l(e.dicLists.userSexEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"门卡ID：",prop:"cardCode"}},[t("el-input",{staticClass:"elinput",attrs:{placeholder:"请输入门卡ID"},model:{value:e.form.cardCode,callback:function(a){e.$set(e.form,"cardCode",a)},expression:"form.cardCode"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"国籍：",prop:"countryId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.countryId,callback:function(a){e.$set(e.form,"countryId",a)},expression:"form.countryId"}},e._l(e.dicLists.countryEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"住户姓名：",prop:"userName"}},[t("el-input",{staticClass:"elinput",attrs:{placeholder:"请输入住户姓名"},model:{value:e.form.userName,callback:function(a){e.$set(e.form,"userName",a)},expression:"form.userName"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"证件类型：",prop:"certificateTypeId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.certificateTypeId,callback:function(a){e.$set(e.form,"certificateTypeId",a)},expression:"form.certificateTypeId"}},e._l(e.dicLists.certificateEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"住户生日：",prop:"birthday"}},[t("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.form.birthday,callback:function(a){e.$set(e.form,"birthday",a)},expression:"form.birthday"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"证件编码：",prop:"certificateCode"}},[t("el-input",{attrs:{placeholder:"请输入证件编码"},model:{value:e.form.certificateCode,callback:function(a){e.$set(e.form,"certificateCode",a)},expression:"form.certificateCode"}})],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"民族：",prop:"nationId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.nationId,callback:function(a){e.$set(e.form,"nationId",a)},expression:"form.nationId"}},e._l(e.dicLists.nationEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"政治面貌：",prop:"politicsStatus"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.politicsStatus,callback:function(a){e.$set(e.form,"politicsStatus",a)},expression:"form.politicsStatus"}},e._l(e.dicLists.politicsEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"户籍省县：",prop:"areaCode"}},[t("el-cascader",{attrs:{props:e.props,options:e.areaList},model:{value:e.form.areaCode,callback:function(a){e.$set(e.form,"areaCode",a)},expression:"form.areaCode"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"婚姻状况：",prop:"maritalStatus"}},[t("el-radio-group",{model:{value:e.form.maritalStatus,callback:function(a){e.$set(e.form,"maritalStatus",a)},expression:"form.maritalStatus"}},e._l(e.dicLists.maritalStatusEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"户籍地址：",prop:"areaAddr"}},[t("el-input",{attrs:{placeholder:"请输入户籍地址"},model:{value:e.form.areaAddr,callback:function(a){e.$set(e.form,"areaAddr",a)},expression:"form.areaAddr"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"手机号：",prop:"mobile"}},[t("el-input",{attrs:{placeholder:"请输入手机号"},model:{value:e.form.mobile,callback:function(a){e.$set(e.form,"mobile",a)},expression:"form.mobile"}})],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"文化程度：",prop:"eduLevelId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.eduLevelId,callback:function(a){e.$set(e.form,"eduLevelId",a)},expression:"form.eduLevelId"}},e._l(e.dicLists.cultureEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"联系人手机：",prop:"contactMethod"}},[t("el-input",{attrs:{placeholder:"请输入联系人手机号"},model:{value:e.form.contactMethod,callback:function(a){e.$set(e.form,"contactMethod",a)},expression:"form.contactMethod"}})],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"从事职业：",prop:"careerId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.careerId,callback:function(a){e.$set(e.form,"careerId",a)},expression:"form.careerId"}},e._l(e.dicLists.careerEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"职位：",prop:"jobTitle"}},[t("el-input",{attrs:{placeholder:"请输入职位"},model:{value:e.form.jobTitle,callback:function(a){e.$set(e.form,"jobTitle",a)},expression:"form.jobTitle"}})],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"工作单位：",prop:"unitName"}},[t("el-input",{attrs:{placeholder:"请输入工作单位"},model:{value:e.form.unitName,callback:function(a){e.$set(e.form,"unitName",a)},expression:"form.unitName"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"单位地址：",prop:"unitAddr"}},[t("el-input",{attrs:{placeholder:"请输入单位地址"},model:{value:e.form.unitAddr,callback:function(a){e.$set(e.form,"unitAddr",a)},expression:"form.unitAddr"}})],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"人脸对比状态：",prop:"faceAuthStatus","label-width":"140px"}},[t("el-radio-group",{model:{value:e.form.faceAuthStatus,callback:function(a){e.$set(e.form,"faceAuthStatus",a)},expression:"form.faceAuthStatus"}},e._l(e.dicLists.faceComparisoneEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"人脸照片：",prop:"faceImageCode"}},[t("el-upload",{ref:"upload",attrs:{limit:1,action:"uploadUrl","list-type":"picture-card","http-request":e.uploadSectionFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"on-remove":e.getLocalImgs,"file-list":e.faceFileImg}},[t("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"身份证照片：",prop:"certificateImageCodes"}},[t("el-upload",{ref:"upload",attrs:{limit:2,action:"uploadUrl","list-type":"picture-card","http-request":e.infoUploadSectionFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"on-remove":e.infoGetLocalImgs,"file-list":e.infoFileImg}},[t("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1)],1)],1),e._v(" "),t("span",{staticClass:"title"},[e._v("居住信息")]),e._v(" "),t("el-button",{staticClass:"people-submit",attrs:{type:"primary"},on:{click:e.liveSubmitForm}},[e._v("保存")]),e._v(" "),t("el-divider",{attrs:{"content-position":"right"}}),e._v(" "),t("el-form",{ref:"placeForm",attrs:{model:e.placeForm,rules:e.placeRules,"label-width":"120px"}},[t("el-form-item",{attrs:{label:"居住地址：",prop:"buildingCode"}},[t("el-cascader",{attrs:{placeholder:e.address,props:e.codes},model:{value:e.placeForm.buildingCode,callback:function(a){e.$set(e.placeForm,"buildingCode",a)},expression:"placeForm.buildingCode"}})],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住类型：",prop:"liveTypeId"}},[t("el-radio-group",{model:{value:e.placeForm.liveTypeId,callback:function(a){e.$set(e.placeForm,"liveTypeId",a)},expression:"placeForm.liveTypeId"}},e._l(e.dicLists.liveTypeEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住事由：",prop:"liveReasonId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.placeForm.liveReasonId,callback:function(a){e.$set(e.placeForm,"liveReasonId",a)},expression:"placeForm.liveReasonId"}},e._l(e.dicLists.reasonEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住状态：",prop:"liveStatus"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.placeForm.liveStatus,callback:function(a){e.$set(e.placeForm,"liveStatus",a)},expression:"placeForm.liveStatus"}},e._l(e.dicLists.liveStatusEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住证件：",prop:"liveCertificateId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.placeForm.liveCertificateId,callback:function(a){e.$set(e.placeForm,"liveCertificateId",a)},expression:"placeForm.liveCertificateId"}},e._l(e.dicLists.liveCertificateEnum,(function(e){return t("el-option",{key:e.type,attrs:{label:e.value,value:e.type}})})),1)],1)],1)],1),e._v(" "),t("el-row",[t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住证件是否长期有效：",prop:"isLongTerm","label-width":"200px"}},[t("el-radio-group",{model:{value:e.placeForm.isLongTerm,callback:function(a){e.$set(e.placeForm,"isLongTerm",a)},expression:"placeForm.isLongTerm"}},e._l(e.dicLists.yesOrNoEnum,(function(a,l){return t("el-radio",{key:l,attrs:{label:a.type}},[e._v(e._s(a.value))])})),1)],1)],1),e._v(" "),t("el-col",{attrs:{span:12}},[t("el-form-item",{attrs:{label:"居住证件有效期：",prop:"","label-width":"140px"}},[t("el-date-picker",{attrs:{type:"daterange","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.placeForm.certificateExpireTime,callback:function(a){e.$set(e.placeForm,"certificateExpireTime",a)},expression:"placeForm.certificateExpireTime"}})],1)],1)],1),e._v(" "),t("el-form-item",{attrs:{label:"居住证件照片：",prop:"certificateImageCodes"}},[t("el-upload",{ref:"upload",attrs:{limit:5,action:"uploadUrl","list-type":"picture-card","http-request":e.liveUploadSectionFile,headers:e.header,"with-credentials":!0,accept:"image/png, image/gif, image/jpg, image/jpeg","on-preview":e.getLocalImg,"on-remove":e.liveGetLocalImgs,"file-list":e.liveFileImg}},[t("i",{staticClass:"el-icon-plus",attrs:{slot:"default"},slot:"default"})])],1)],1),e._v(" "),t("div",{staticClass:"dialog-footer"})],1),e._v(" "),t("el-dialog",{attrs:{width:"600px",visible:e.dialogVisible},on:{"update:visible":function(a){e.dialogVisible=a}}},[t("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1)}),[],!1,null,"13e35663",null);a.default=c.exports},zn7N:function(e,a,t){var l=t("Y7ZC"),i=t("WEpk"),r=t("KUxP");e.exports=function(e,a){var t=(i.Object||{})[e]||Object[e],o={};o[e]=a(t),l(l.S+l.F*r((function(){t(1)})),"Object",o)}}}]);
//# sourceMappingURL=18.91769c90bc96b1635fec.js.map