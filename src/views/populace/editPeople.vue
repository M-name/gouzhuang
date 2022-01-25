<template>
  <div class="contant">
    <div class="back">
      <i class="el-icon-back icon" @click="back($store.getters.rightNav)"></i>
    </div>
    <div class="left">
      <span class="title">基本信息</span>
      <el-button class="people-submit" type="primary" @click="edit"
        >修改</el-button
      >
      <el-divider content-position="right"></el-divider>
      <el-form
        ref="form"
        :model="form"
        :rules="peopleRules"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="门卡类型：" prop="accessTypeIds">
              <el-checkbox-group v-model="form.accessTypeIds">
                <el-checkbox
                  v-for="(item, index) in dicLists.accessTypeEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="境外人员：" prop="isOverseas">
                  <el-radio-group v-model="form.isOverseas">
                    <el-radio
                      v-for="(item, index) in dicLists.yesOrNoEnum"
                      :label="item.type"
                      :key="index"
                      >{{ item.value }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别：" prop="userSex">
                  <el-radio-group v-model="form.userSex">
                    <el-radio
                      v-for="(item, index) in dicLists.userSexEnum"
                      :label="item.type"
                      :key="index"
                      >{{ item.value }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门卡ID：" prop="cardCode">
              <el-input
                class="elinput"
                v-model="form.cardCode"
                placeholder="请输入门卡ID"
              />
              <!-- <el-button
                class="btn-buka"
                @click="cancel($store.getters.rightNav)"
                >补卡</el-button
              > -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍：" prop="countryId">
              <el-select v-model="form.countryId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.countryEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="住户姓名：" prop="userName">
              <el-input
                class="elinput"
                v-model="form.userName"
                placeholder="请输入住户姓名"
              />
              <!-- <el-button
                class="btn-duqu"
                @click="cancel($store.getters.rightNav)"
                >读取身份证信息</el-button
              > -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型：" prop="certificateTypeId">
              <el-select v-model="form.certificateTypeId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.certificateEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="住户生日：" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件编码：" prop="certificateCode">
              <el-input
                v-model="form.certificateCode"
                placeholder="请输入证件编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="民族：" prop="nationId">
              <el-select v-model="form.nationId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.nationEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌：" prop="politicsStatus">
              <el-select v-model="form.politicsStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.politicsEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户籍省县：" prop="areaCode">
              <el-cascader
                v-model="form.areaCode"
                :props="props"
                :options="areaList"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况：" prop="maritalStatus">
              <el-radio-group v-model="form.maritalStatus">
                <el-radio
                  v-for="(item, index) in dicLists.maritalStatusEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户籍地址：" prop="areaAddr">
              <el-input v-model="form.areaAddr" placeholder="请输入户籍地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：（生成小程序账号）" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文化程度：" prop="eduLevelId">
              <el-select v-model="form.eduLevelId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.cultureEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机：" prop="contactMethod">
              <el-input
                v-model="form.contactMethod"
                placeholder="请输入联系人手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="从事职业：" prop="careerId">
              <el-select v-model="form.careerId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.careerEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位：" prop="jobTitle">
              <el-input v-model="form.jobTitle" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作单位：" prop="unitName">
              <el-input v-model="form.unitName" placeholder="请输入工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位地址：" prop="unitAddr">
              <el-input v-model="form.unitAddr" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="人脸开通状态："
              prop="faceAuthStatus"
            >
              <el-select v-model="form.faceAuthStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.faceComparisoneEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人脸照片：" prop="faceImageCode">
              <el-upload
                ref="upload"
                :limit="1"
                action="uploadUrl"
                list-type="picture-card"
                :http-request="uploadSectionFile"
                :headers="header"
                :with-credentials="true"
                accept="image/png, image/gif, image/jpg, image/jpeg"
                :on-preview="getLocalImg"
                :on-remove="getLocalImgs"
                :file-list="faceFileImg"
              >
                <i slot="default" class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证照片：" prop="certificateImageCodes">
              <el-upload
                ref="upload"
                :limit="2"
                action="uploadUrl"
                list-type="picture-card"
                :http-request="infoUploadSectionFile"
                :headers="header"
                :with-credentials="true"
                accept="image/png, image/gif, image/jpg, image/jpeg"
                :on-preview="getLocalImg"
                :on-remove="infoGetLocalImgs"
                :file-list="infoFileImg"
              >
                <i slot="default" class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span class="title">居住信息</span>
      <el-button class="people-submit" type="primary" @click="liveSubmitForm"
        >保存</el-button
      >
      <el-divider content-position="right"></el-divider>
      <el-form
        ref="placeForm"
        :model="placeForm"
        :rules="placeRules"
        label-width="120px"
      >
        <el-form-item label="居住地址：" prop="buildingCode">
          <el-cascader
            :placeholder="address"
            v-model="placeForm.buildingCode"
            :props="codes"
          ></el-cascader>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="居住类型：" prop="liveTypeId">
              <el-radio-group v-model="placeForm.liveTypeId">
                <el-radio
                  v-for="(item, index) in dicLists.liveTypeEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="居住事由：" prop="liveReasonId">
              <el-select v-model="placeForm.liveReasonId" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.reasonEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="居住状态：" prop="liveStatus">
              <el-select v-model="placeForm.liveStatus" placeholder="请选择">
                <el-option
                  v-for="item in dicLists.liveStatusEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="居住证件：" prop="liveCertificateId">
              <el-select
                v-model="placeForm.liveCertificateId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dicLists.liveCertificateEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="居住证件是否长期有效："
              prop="isLongTerm"
              label-width="200px"
            >
              <el-radio-group v-model="placeForm.isLongTerm">
                <el-radio
                  v-for="(item, index) in dicLists.yesOrNoEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="placeForm.isLongTerm == '0'" :span="12">
            <el-form-item
              label="居住证件有效期："
              prop="certificateExpireTime"
              label-width="140px"
            >
              <el-date-picker
                v-model="placeForm.certificateExpireTime"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col v-else :span="12">
            <el-form-item label="居住证件有效期：" prop="" label-width="140px">
              <el-date-picker
                v-model="placeForm.certificateExpireTime"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="居住证件照片：" prop="certificateImageCodes">
          <el-upload
            ref="upload"
            :limit="5"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="liveUploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :on-remove="liveGetLocalImgs"
            :file-list="liveFileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="dialog-footer"></div>
    </div>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var phone = /^1(3|4|5|6|7|8|9)\d{9}$/; //手机号验证
    let isPhone = (rule, value, callback) => {
      if (value != undefined && value != "") {
        if (!phone.test(value)) {
          return callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let that = this;
    return {
      //上一级传过来的usercode
      editPeople: {},
      dialogImageUrl: "",
      dialogVisible: false,
      faceFileImg: [],
      faceUploadImgList: [],
      infoFileImg: [],
      infoUploadImgList: [],
      liveFileImg: [],
      liveUploadImgList: [],
      header: {
        "Content-Type": "multipart/form-data",
      },
      address: "",
      // 字典列表
      dicLists: {},
      // 级联配置
      props: {
        value: "areaCode",
        label: "areaName",
      },
      build: "",
      unit: "",
      // 房屋信息级联配置
      codes: {
        value: "code",
        label: "name",
        lazy: true,
        lazyLoad: (node, resolve) => {
          if (node.data) {
            node.add = "";
          }
          const { level } = node; // 获取当前node对象中的level属性
          if (level == 1) {
            that.build = node.value;
            node.add = node.value;
          } else if (level == 2) {
            that.unit = node.value;
            node.add = that.build + "," + node.value;
          } else if (level == 3) {
            node.add = that.build + "," + that.unit + "," + node.value;
          }
          console.log(level, node.add);
          that.$request
            .houseListAll({
              type: level,
              code: node.add,
            })
            .then((res) => {
              if (res.data.status == 200) {
                const nodes = res.data.data;
                if (level > 1) {
                  nodes.forEach((item) => {
                    item.leaf = level >= 3; //判断是否为末尾节点，这个地方是0,1,2三级
                  });
                }
                resolve(nodes);
              } else {
                that.$message.error(res.msg);
              }
            });
        },
      },

      // 地区级联列表
      areaList: [],
      //tab默认
      activeName: "first",
      // 基本信息表单参数
      form: {
        accessTypeIds: [0],
        isOverseas: undefined,
        userSex: undefined,
        cardCode: undefined,
        countryId: undefined,
        userName: undefined,
        createBy: JSON.parse(localStorage.getItem("userInfo")).userCode,
        certificateTypeId: undefined,
        birthday: undefined,
        faceAuthStatus: 0,
        certificateCode: undefined,
        nationId: undefined,
        politicsStatus: undefined,
        areaCode: undefined,
        maritalStatus: undefined,
        areaAddr: undefined,
        mobile: undefined,
        eduLevelId: undefined,
        contactMethod: undefined,
        careerId: undefined,
        jobTitle: undefined,
        unitName: undefined,
        unitAddr: undefined,
      },
      // 居住信息表单参数
      placeForm: {
        buildingCode: undefined,
        liveTypeId: undefined,
        liveReasonId: undefined,
        liveStatus: undefined,
        liveCertificateId: undefined,
        certificateImageCodes: undefined,
        certificateStartTime: undefined,
        certificateExpireTime: undefined,
        isLongTerm: 0,
        createBy: JSON.parse(localStorage.getItem("userInfo")).userCode,
      },
      // 新闻类型字典值
      newsTypeMap: [],
      //居住信息校验
      placeRules: {
        buildingCode: [
          { required: true, message: "居住地址不能为空", trigger: "change" },
        ],
        liveTypeId: [
          { required: true, message: "居住类型不能为空", trigger: "change" },
        ],
        liveReasonId: [
          { required: true, message: "居住事由不能为空", trigger: "change" },
        ],
        liveStatus: [
          { required: true, message: "居住状态不能为空", trigger: "change" },
        ],
        liveCertificateId: [
          { required: true, message: "居住证件不能为空", trigger: "change" },
        ],
        certificateExpireTime: [
          { required: true, message: "证件有效期不能为空", trigger: "change" },
        ],
        isLongTerm: [
          {
            required: true,
            message: "居住证件是否长期有效未选择",
            trigger: "change",
          },
        ],
      },
      // 基本信息校验
      peopleRules: {
        accessTypeIds: [
          { required: true, message: "门卡类型为空", trigger: "blur" },
        ],
        isOverseas: [
          {
            required: true,
            message: "是否为境外人员不能为空",
            trigger: "change",
          },
        ],
        userSex: [
          { required: true, message: "性别不能为空", trigger: "change" },
        ],
        countryId: [
          { required: true, message: "国籍不能为空", trigger: "change" },
        ],
        userName: [
          { required: true, message: "住户姓名不能为空", trigger: "change" },
        ],
        certificateTypeId: [
          { required: true, message: "证件类型不能为空", trigger: "change" },
        ],
        faceAuthStatus: [
          { required: true, message: "人脸对比状态未选择", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "住户生日不能为空", trigger: "change" },
        ],
        certificateCode: [
          { required: true, message: "证件编码不能为空", trigger: "change" },
          this.$rules.enNum(undefined, "change"),
        ],
        nationId: [
          { required: true, message: "名族不能为空", trigger: "change" },
        ],
        politicsStatus: [
          { required: true, message: "政治面貌不能为空", trigger: "change" },
        ],
        areaCode: [
          { required: true, message: "户籍省县不能为空", trigger: "change" },
        ],
        maritalStatus: [
          { required: true, message: "婚姻状况不能为空", trigger: "change" },
        ],
        areaAddr: [
          { required: true, message: "户籍地址不能为空", trigger: "change" },
        ],
        contactMethod: [
          { required: true, message: "联系人电话不能为空", trigger: "change" },
          this.$rules.mobile("请输入正确手机号", "change"),
        ],
        mobile: { required: false, validator: isPhone, trigger: "blur" },
      },
    };
  },
  created() {
    //获取通知字典
    this.$request.findAlleuemsNews().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < Object.keys(lists.newsTypeMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.newsTypeMap)[i];
        arr.label = lists.newsTypeMap[Object.keys(lists.newsTypeMap)[i]];
        role.push(arr);
      }
      this.newsTypeMap = role;
    });
    //获取省市区
    this.$request.areaListAll().then((res) => {
      this.areaList = res.data.data;
    });
    // 获取用户详情所需字典
    this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
    });
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("editPeople", JSON.stringify(this.$route.params));
      this.editPeople = this.$route.params;
      console.log(this.editPeople);
    } else {
      this.editPeople = JSON.parse(localStorage.getItem("editPeople"));
    }
    let that = this;
    //请求房屋信息
    this.$request
      .userHouseFind(this.editPeople.id ? this.editPeople.id : "")
      .then((res) => {
        if (res.data.status === 200) {
          this.liveFileImg = [];
          this.liveUploadImgList = [];
          if (res.data.data.certificateImageCodes) {
            const codeList = res.data.data.certificateImageCodes.split(",");
            const urlList = res.data.data.certificateImageCodesUrl.split(",");
            for (var i = 0; i < codeList.length; i++) {
              that.liveUploadImgList.push({
                code: codeList[i],
                url: urlList[i],
              });
              this.liveFileImg.push({
                uid: codeList[i],
                url: urlList[i],
              });
            }
          }
          let arr = [];
          if (res.data.data.certificateStartTime) {
            arr.push(
              res.data.data.certificateStartTime,
              res.data.data.certificateExpireTime
            );
            res.data.data.certificateExpireTime = arr;
          }
          res.data.data.buildingCode = res.data.data.buildingCode.split("-");
          this.address =
            res.data.data.buildingCode[0] +
            "幢/" +
            res.data.data.buildingCode[1] +
            "单元/" +
            res.data.data.buildingCode[2] +
            "层/" +
            res.data.data.buildingCode[3] +
            "室";
          this.placeForm = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    //请求住户信息
    this.$request.peopleFind(this.editPeople.code).then((res) => {
      if (res.data.status === 200) {
        this.faceFileImg = [];
        this.faceUploadImgList = [];
        this.infoFileImg = [];
        this.infoUploadImgList = [];
        if (res.data.data.faceImageCode) {
          this.faceFileImg.push({
            uid: 1,
            url: res.data.data.faceImageCodeUrl,
          });
          this.faceUploadImgList.push({
            code: res.data.data.faceImageCode,
            url: res.data.data.faceImageCodeUrl,
          });
        }
        if (res.data.data.certificateImageCodes) {
          const codeList = res.data.data.certificateImageCodes.split(",");
          const urlList = res.data.data.certificateImageCodesUrl.split(",");
          for (var i = 0; i < codeList.length; i++) {
            this.infoFileImg.push({
              uid: codeList[i],
              url: urlList[i],
            });
            that.infoUploadImgList.push({
              code: codeList[i],
              url: urlList[i],
            });
          }
        }
        if (res.data.data.accessTypeIds) {
          var arr = res.data.data.accessTypeIds.split(",");
          res.data.data.accessTypeIds = arr.map(Number);
        } else {
          res.data.data.accessTypeIds = [];
        }
        if (res.data.data.areaCode) {
          res.data.data.areaCode = res.data.data.areaCode.split(",");
        }

        this.form = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
  methods: {
    // 删除上传图片
    getLocalImgs(file, fileList) {
      this.faceUploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          this.faceUploadImgList.splice(index, 1);
        }
      });
      console.log(this.faceUploadImgList);
    },
    infoGetLocalImgs(file, fileList) {
      this.infoUploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          this.infoUploadImgList.splice(index, 1);
        }
      });
      console.log(this.infoUploadImgList);
    },
    liveGetLocalImgs(file, fileList) {
      this.liveUploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          this.liveUploadImgList.splice(index, 1);
        }
      });
      console.log(this.liveUploadImgList);
    },
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.faceFileImg.push(obj);
        this.faceUploadImgList.push({
          code: res.data.data.split(",")[0],
          url: res.data.data.split(",")[1],
        });
        console.log(this.faceUploadImgList);
      });
    },
    infoUploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.infoFileImg.push(obj);
        this.infoUploadImgList.push({
          code: res.data.data.split(",")[0],
          url: res.data.data.split(",")[1],
        });
        console.log(this.infoUploadImgList);
      });
    },
    liveUploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.liveFileImg.push(obj);
        this.liveUploadImgList.push({
          code: res.data.data.split(",")[0],
          url: res.data.data.split(",")[1],
        });
        console.log(this.liveUploadImgList);
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //返回
    back(tabItem) {
      const that = this;
      that.$router.go(-1);
      that.$store.dispatch("removeTab", {
        tabItem,
        fullPath: this.$route.fullPath,
        router: this.$router,
      });
    },

    // 基本信息修改的提交
    edit() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.accessTypeIds = this.form.accessTypeIds.toString();
          this.form.areaCode = this.form.areaCode.toString();
          let str = [];
          if (this.infoUploadImgList.length > 0) {
            for (var i = 0; i < this.infoUploadImgList.length; i++) {
              str.push(this.infoUploadImgList[i].code);
              console.log(this.infoUploadImgList[i].code);
            }
            this.form.certificateImageCodes = str.toString();
          }

          if (this.faceUploadImgList.length > 0) {
            this.form.faceImageCode = this.faceUploadImgList[0].code;
          }
          this.$request.userUpdate(this.form).then((res) => {
            if (res.data.status === 200) {
              this.faceFileImg = [];
              this.faceUploadImgList = [];
              this.infoFileImg = [];
              this.infoUploadImgList = [];
              this.msgSuccess("修改成功");
              if (res.data.data.faceImageCode) {
                this.faceFileImg.push({
                  uid: 1,
                  url: res.data.data.faceImageCodeUrl,
                });
                this.faceUploadImgList.push({
                  code: res.data.data.faceImageCode,
                  url: res.data.data.faceImageCodeUrl,
                });
              }
              if (res.data.data.certificateImageCodes) {
                const codeList = res.data.data.certificateImageCodes.split(",");
                const urlList =
                  res.data.data.certificateImageCodesUrl.split(",");
                for (var i = 0; i < codeList.length; i++) {
                  this.infoFileImg.push({
                    uid: codeList[i],
                    url: urlList[i],
                  });
                  that.infoUploadImgList.push({
                    code: codeList[i],
                    url: urlList[i],
                  });
                }
              }
              var arr = res.data.data.accessTypeIds.split(",");
              res.data.data.accessTypeIds = arr.map(Number);
              res.data.data.areaCode = res.data.data.areaCode.split(",");
              this.form = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    //居住信息新增的提交
    liveSubmitForm() {
      console.log(this.placeForm);
      let that = this;
      if (!this.form.userCode) {
        this.$message.warning("请先填写基本信息");
        return;
      }
      // if (!this.placeForm.certificateExpireTime && this.placeForm.isLongTerm == '0') {
      //   this.$message.warning("居住证不为长期有效时居住证件有效期不能为空！");
      //   return;
      // }
      this.$refs["placeForm"].validate((valid) => {
        if (valid) {
          this.placeForm.userCode = this.form.userCode;
          this.placeForm.buildingCode = this.placeForm.buildingCode.toString();
          if (this.placeForm.certificateExpireTime) {
            this.placeForm.certificateStartTime =
              this.placeForm.certificateExpireTime[0];
            this.placeForm.certificateExpireTime =
              this.placeForm.certificateExpireTime[1];
          }
          let str = [];
          if (this.liveUploadImgList.length > 0) {
            for (var i = 0; i < this.liveUploadImgList.length; i++) {
              str.push(this.liveUploadImgList[i].code);
              console.log(this.liveUploadImgList[i].code);
            }
            this.placeForm.certificateImageCodes = str.toString();
          }
          console.log(this.placeForm, "submit");
          this.$request.createOrUpdate(this.placeForm).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("提交成功");
              this.liveFileImg = [];
              this.liveUploadImgList = [];
              if (res.data.data.certificateImageCodes) {
                const codeList = res.data.data.certificateImageCodes.split(",");
                const urlList =
                  res.data.data.certificateImageCodesUrl.split(",");
                for (var i = 0; i < codeList.length; i++) {
                  that.liveUploadImgList.push({
                    code: codeList[i],
                    url: urlList[i],
                  });
                  this.liveFileImg.push({
                    uid: codeList[i],
                    url: urlList[i],
                  });
                }
              }
              let arr = [];
              if (res.data.data.certificateStartTime) {
                arr.push(
                  res.data.data.certificateStartTime,
                  res.data.data.certificateExpireTime
                );
                res.data.data.certificateExpireTime = arr;
              }
              res.data.data.buildingCode =
                res.data.data.buildingCode.split("-");
              this.address =
                res.data.data.buildingCode[0] +
                "幢/" +
                res.data.data.buildingCode[1] +
                "单元/" +
                res.data.data.buildingCode[2] +
                "层/" +
                res.data.data.buildingCode[3] +
                "室";
              this.placeForm = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  padding: 16px;
  background: #fff;
}
// .elinput {
//   width: 65%;
// }
.btn-buka {
  width: 30%;
  margin-left: 4%;
  background: #e6a23c;
  color: #fff;
}
.btn-duqu {
  text-align: center;
  width: 30%;
  margin-left: 4%;
  background: #67c23a;
  color: #fff;
}
.dialog-footer {
  padding-left: 30px;
}
.people-submit {
  margin-bottom: 30px;
  float: right;
  font-weight: bold;
}
.el-cascader {
  width: 100%;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
.title {
  font-size: 25px;
  font-weight: bold;
}
.icon {
  font-size: 30px;
}
.back {
  margin-bottom: 20px;
}
</style>