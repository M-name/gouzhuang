<template>
  <div class="contant">
    <div class="parking">
      <div class="parking-img"><img src="@/assets/bg.jpg" alt="" /></div>
      <div class="user-info">
        <p class="car-id">{{ userInfo.parkingCode }}</p>
        <p class="parking-info">
          <span v-if="userInfo.zoneName">{{ userInfo.zoneName }}</span
          ><span v-if="userInfo.remark">{{ userInfo.remark }}</span
          ><span v-if="userInfo.parkingCode">{{ userInfo.parkingCode }}</span>
        </p>
        <div class="theuser">
          <div>姓名：{{ userInfo.userName }}</div>
          <div v-if="userInfo.remark">住户编码：{{ userInfo.userCode }}</div>
          <div>居住地址：{{ userInfo.userAddr }}</div>
          
        </div>
        <div class="theuser">
          <div>
            证件类型：{{ userInfo.certificateTypeId == 25 ? "身份证" : "护照" }}
          </div>
          <div>证件号码：{{ userInfo.certificateNo }}</div>
          <div>联系手机：{{ userInfo.mobile }}</div>
          
        </div>
      </div>
    </div>
    <div style="height: 20px; background: #fff"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="出租记录">
          <div class="operation">
            <div class="button">
              <el-row :gutter="10" class="operations-row">
                <el-col :span="1.5">
                  <el-button
                    type="text"
                    @click="rentOut"
                    icon="el-icon-plus"
                    size="small"
                    >新增出租信息</el-button
                  >
                </el-col>
              </el-row>
            </div>
            <CommonTable
              :total="total"
              :loading="loading"
              :defColumns="column"
              @pagination="getList"
              :dataList="tableData"
              :options="tableOptions"
              :page.sync="params.page"
              :limit.sync="params.pageSize"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="过户记录">
          <div class="operation">
            <div class="button">
              <el-row :gutter="10" class="operations-row">
                <el-col :span="1.5">
                  <el-button
                    type="text"
                    @click="ownerShip"
                    icon="el-icon-plus"
                    size="small"
                    >新增过户信息</el-button
                  >
                </el-col>
              </el-row>
            </div>
            <CommonTable
              :total="transferTotal"
              :loading="transferLoading"
              :defColumns="transferColumn"
              @pagination="transferGetList"
              :dataList="transferTableData"
              :options="tableOptions"
              :page.sync="transferParams.page"
              :limit.sync="transferParams.pageSize"
              :operations="transferTableOperations"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 过户弹框 -->
    <el-dialog
      :title="title"
      :before-close="ownerShipCancel"
      :visible.sync="ownerShipOpen"
      width="700px"
      append-to-body
    >
      <el-form
        ref="ownerShipForm"
        :model="ownerShipForm"
        :rules="ownerShipRules"
        label-width="130px"
      >
        <i class="el-icon-s-custom"></i>
        <span>新所有人基本信息</span>
        <el-divider></el-divider>
        <el-form-item label="所有人类型:" prop="currTypeId">
          <el-radio-group
            :disabled="isCheak"
            @change="ownerShipReset"
            v-model="ownerShipForm.currTypeId"
          >
            <el-radio
              v-for="(item, index) in dicList.rentPersonEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="isOutPeople"
          label="所有人姓名:"
          prop="currUserName"
        >
          <el-input
            class="elinput"
            :disabled="isOutPeople"
            v-model="ownerShipForm.currUserName"
            placeholder="请输入所有人姓名"
          />
          <el-button v-show="!isCheak" class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item v-else label="所有人姓名:" prop="currUserName">
          <el-input
            :disabled="isOutPeople"
            v-model="ownerShipForm.currUserName"
            placeholder="请输入所有人姓名"
          />
        </el-form-item>
        <el-form-item label="所有人手机号:" prop="currMobile">
          <el-input
            :disabled="isOutPeople"
            v-model="ownerShipForm.currMobile"
            placeholder="所有入手机号"
          />
        </el-form-item>
        <el-form-item label="所有人证件类型:" prop="currCertificateTypeId">
          <el-select
            :disabled="isOutPeople"
            v-model="ownerShipForm.currCertificateTypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dicList.certificateEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所有人证件号码:" prop="currCertificateNo">
          <el-input
            :disabled="isOutPeople"
            v-model="ownerShipForm.currCertificateNo"
            placeholder="请输入证件号码"
          />
        </el-form-item>
        <el-form-item label="所有人地址:" prop="currUserAddr">
          <el-input
            :disabled="isAddress"
            v-model="ownerShipForm.currUserAddr"
            placeholder="请输入所有人地址"
          />
        </el-form-item>
        <el-form-item label="过户时间:" prop="transferTime">
          <el-date-picker
            v-model="ownerShipForm.transferTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过户备注:" prop="remark">
          <el-input
            type="textarea"
            autosize
            v-model="ownerShipForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
        <i class="el-icon-s-custom"></i>
        <span>过户证明材料</span>
        <el-divider></el-divider>
        <el-form-item label-width="20px" label="" prop="rentImageCodes">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="ownerShipUploadFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :file-list="ownerShipFileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!isCheak">
        <el-button type="primary" @click="ownerShipSubmitForm">提 交</el-button>
        <el-button @click="ownerShipCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 出租弹框 -->
    <el-dialog
      :title="title"
      :before-close="rentOutCancel"
      :visible.sync="rentOutOpen"
      width="700px"
      append-to-body
    >
      <el-form
        ref="rentOutForm"
        :model="rentOutForm"
        :rules="rentOutRules"
        label-width="130px"
      >
        <i class="el-icon-s-custom"></i>
        <span>租用人基本信息</span>
        <el-divider></el-divider>
        <el-form-item label="租用人类型:" prop="tenantTypeId">
          <el-radio-group
            @change="rentOutReset"
            v-model="rentOutForm.tenantTypeId"
          >
            <el-radio
              v-for="(item, index) in dicList.rentPersonEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isOutPeople" label="租用人姓名:" prop="userName">
          <el-input
            class="elinput"
            :disabled="isOutPeople"
            v-model="rentOutForm.userName"
            placeholder="请输入租用人姓名"
          />
          <el-button class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item v-else label="租用人姓名:" prop="userName">
          <el-input
            :disabled="isOutPeople"
            v-model="rentOutForm.userName"
            placeholder="租用入所有人姓名"
          />
        </el-form-item>
        <el-form-item label="租用人手机号:" prop="mobile">
          <el-input
            :disabled="isOutPeople"
            v-model="rentOutForm.mobile"
            placeholder="租用入手机号"
          />
        </el-form-item>
        <el-form-item label="租用人证件类型:" prop="certificateTypeId">
          <el-select
            :disabled="isOutPeople"
            v-model="rentOutForm.certificateTypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dicList.certificateEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租用人证件号码:" prop="certificateNo">
          <el-input
            :disabled="isOutPeople"
            v-model="rentOutForm.certificateNo"
            placeholder="请输入证件号码"
          />
        </el-form-item>
        <el-form-item label="租用人地址:" prop="tenantAddr">
          <el-input
            :disabled="isAddress"
            v-model="rentOutForm.tenantAddr"
            placeholder="请输入租用人地址"
          />
        </el-form-item>
        <el-form-item label="租用起始:" prop="rentBeginTime">
          <el-date-picker
            v-model="rentOutForm.rentBeginTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租用截止:" prop="rentEndTime">
          <el-date-picker
            v-model="rentOutForm.rentEndTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租用备注:" prop="remark">
          <el-input
            type="textarea"
            autosize
            v-model="rentOutForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
        <i class="el-icon-s-custom"></i>
        <span>租用证明材料</span>
        <el-divider></el-divider>
        <el-form-item label-width="20px" label="" prop="rentImageCodes">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :file-list="rentOutFileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rentOutSubmitForm">提 交</el-button>
        <el-button @click="rentOutCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="所有人选择" width="800px" :visible.sync="chooseShow">
      <div style="margin-top: -20px">
        <CommonSearch
          @resetQuery="chooseResetQuery"
          @handleQuery="chooseHandleQuery"
          :queryParams.sync="chooseParams"
          :searchList="chooseSearchList"
        />
      </div>
      <CommonTable
        :total="chooseTotal"
        :loading="chooseLoading"
        :tooltipShow="true"
        :defColumns="chooseColumn"
        @pagination="chooseGetList"
        :dataList="chooseTableData"
        :options="chooseTableOptions"
        :page.sync="chooseParams.page"
        :limit.sync="chooseParams.pageSize"
        :operations="chooseTableOperations"
      />
    </el-dialog>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 是否为过户查看
      isCheak: false,
      // 弹出层标题
      title: "",
      // 公用搜索组件内容
      chooseSearchList: [
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "身份证号" },
        { prop: "mobile", label: "电话号码" },
        { prop: "hao", label: "门禁号" },
        {
          prop: "liveType",
          label: "证件类型",
          type: "select",
          options: [],
        },
        {
          prop: "liveStatus",
          label: "居住状态",
          type: "select",
          options: [],
        },
        {
          prop: "liveTypeId",
          label: "住户类型",
          type: "select",
          options: [],
        },
      ],
      // 用户查询或请求参数
      chooseParams: {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      },
      header: {
        "Content-Type": "multipart/form-data",
      },
      rentOutFileImg: [],
      ownerShipFileImg: [],
      dialogImageUrl: "",
      // 表单校验
      rentOutRules: {
        tenantTypeId: [
          { required: true, message: "租用人类型未选择", trigger: "change" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
        ],
        userName: [
          { required: true, message: "姓名不能为空", trigger: "change" },
        ],
        certificateTypeId: [
          { required: true, message: "证件类型不能为空", trigger: "change" },
        ],
        certificateNo: [
          { required: true, message: "证件号码不能为空", trigger: "change" },
        ],
        tenantAddr: [
          { required: true, message: "地址不能为空", trigger: "change" },
        ],
        rentBeginTime: [
          { required: true, message: "起始时间不能为空", trigger: "change" },
        ],
        rentEndTime: [
          { required: true, message: "截止时间不能为空", trigger: "change" },
        ],
      },
      ownerShipRules: {
        currTypeId: [
          { required: true, message: "所有人类型未选择", trigger: "change" },
        ],
        currMobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
        ],
        currUserName: [
          { required: true, message: "姓名不能为空", trigger: "change" },
        ],
        currCertificateTypeId: [
          { required: true, message: "证件类型不能为空", trigger: "change" },
        ],
        currCertificateNo: [
          { required: true, message: "证件号码不能为空", trigger: "change" },
        ],
        currUserAddr: [
          { required: true, message: "地址不能为空", trigger: "change" },
        ],
        transferTime: [
          { required: true, message: "过户时间不能为空", trigger: "change" },
        ],
      },
      //用户选择表格数据
      chooseTableData: [],
      //用户选择表格列
      chooseColumn: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
      // 用户选择弹框是否显示
      chooseShow: false,
      dialogVisible: false,
      // 是否为外来人员
      isOutPeople: false,
      isAddress: false,
      // 表单参数
      rentOutForm: {},
      ownerShipForm: {},
      // 是否显示弹出层
      rentOutOpen: false,
      ownerShipOpen: false,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      chooseTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
        border: false, // 边框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
      ],
      //表格操作列内容
      chooseTableOperations: [
        {
          label: "选择",
          icon: "el-icon-edit",
          handler: (row) => this.choose(row),
        },
      ],
      transferTableOperations: [
        {
          label: "查看",
          icon: "el-icon-edit",
          handler: (row) => this.handleCheak(row),
        },
      ],
      //表格列
      column: [
        { prop: "userName", label: "租用人姓名 " },
        { prop: "tenantTypeIdStr", label: "租用人类型" },
        { prop: "mobile", label: "租用人手机号" },
        { prop: "certificateTypeIdStr", label: "租用人证件类型" },
        { prop: "certificateNo", label: "租用人证件号码 " },
        { prop: "rentEndTime", label: "租用周期",
        render: (h, scope) => {
            return h("div", [
              scope.row.rentBeginTime.slice(0, 10) + "~" + scope.row.rentEndTime.slice(0, 10),
            ]);
          }, },
        { prop: "createTime", label: "登记时间" },
      ],
      transferColumn: [
        { prop: "currUserName", label: "过户人姓名 " },
        { prop: "currTypeIdStr", label: "过户人类型" },
        { prop: "currMobile", label: "过户人手机号" },
        { prop: "currCertificateTypeIdStr", label: "过户人证件类型" },
        { prop: "currCertificateNo", label: "过户人证件号码 " },
        { prop: "transferTime", label: "过户时间" },
      ],
      // 用户信息
      userInfo: {},
      // 表格参数
      tableData: [],
      transferTableData: [],
      // 字典值
      dicList: [],
      dicLists: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      transferTotal: 0,
      loading: false,
      chooseLoading: false,
      transferLoading: false,
      params: {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
      },
      transferParams: {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
      },
    };
  },
  watch: {
    "rentOutForm.tenantTypeId": {
      handler(newName, oldName) {
        if (newName == 50) {
          this.isOutPeople = true;
        } else {
          this.isOutPeople = false;
          this.isAddress = false;
        }
      },
      deep: true,
      immediate: true,
    },
    "ownerShipForm.currTypeId": {
      handler(newName, oldName) {
        if (newName == 50) {
          this.isOutPeople = true;
        } else {
          this.isOutPeople = false;
          this.isAddress = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("parkingCode", this.$route.params.code);
      this.params.parkingCode = this.$route.params.code;
      this.transferParams.parkingCode = this.$route.params.code;
    } else {
      this.params.parkingCode = localStorage.getItem("parkingCode");
      this.transferParams.parkingCode = localStorage.getItem("parkingCode");
    }

    this.getList();
    this.transferGetList();
    this.chooseGetList();
    this.getUser();
  },
  created() {
    // 字典处理
    this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
      let lists = res.data.data;
      this.chooseSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "liveStatus") {
          lists.liveStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "liveTypeId") {
          lists.reasonEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "liveType") {
          lists.certificateEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.$request.parkingFindEnum().then((res) => {
      this.dicList = res.data.data;
    });
  },
  methods: {
    /** 搜索按钮操作 */
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
    },
    /** 重置按钮操作 */
    chooseResetQuery() {
      this.chooseParams = {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      };
      this.chooseHandleQuery();
    },
    // 所有人类型选择改变后
    choosePeople() {
      this.chooseShow = true;
    },
    rentOutReset(val) {
      if (val) {
        this.rentOutForm = {
          tenantTypeId: val,
          userName: undefined,
          mobile: undefined,
          parkingCode: undefined,
          certificateTypeId: undefined,
          certificateNo: undefined,
          rentImageCodes: undefined,
          tenantAddr: undefined,
          rentBeginTime: undefined,
          rentEndTime: undefined,
          remark: undefined,
        };
      } else {
        this.rentOutForm = {
          tenantTypeId: 48,
          userName: undefined,
          mobile: undefined,
          parkingCode: undefined,
          certificateTypeId: undefined,
          certificateNo: undefined,
          rentImageCodes: undefined,
          tenantAddr: undefined,
          rentBeginTime: undefined,
          rentEndTime: undefined,
          remark: undefined,
        };
      }
    },
    ownerShipReset(val) {
      if (val) {
        this.ownerShipForm = {
          currTypeId: val,
          currUserName: undefined,
          currMobile: undefined,
          parkingCode: undefined,
          currCertificateTypeId: undefined,
          currCertificateNo: undefined,
          currUserAddr: undefined,
          transferTime: undefined,
          transferImageCodes: undefined,
          remark: undefined,
        };
      } else {
        this.ownerShipForm = {
          currTypeId: 48,
          currUserName: undefined,
          currMobile: undefined,
          parkingCode: undefined,
          currCertificateTypeId: undefined,
          currCertificateNo: undefined,
          currUserAddr: undefined,
          transferTime: undefined,
          transferImageCodes: undefined,
          remark: undefined,
        };
      }
    },
    uploadFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.rentOutFileImg.push(obj);
        if (this.rentOutForm.rentImageCodes != undefined) {
          this.rentOutForm.rentImageCodes =
            this.rentOutForm.rentImageCodes + "," + res.data.data.split(",")[0];
        } else {
          this.rentOutForm.rentImageCodes = res.data.data.split(",")[0];
        }
      });
    },
    ownerShipUploadFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.ownerShipFileImg.push(obj);
        if (this.ownerShipForm.transferImageCodes != undefined) {
          this.ownerShipForm.transferImageCodes =
            this.ownerShipForm.transferImageCodes +
            "," +
            res.data.data.split(",")[0];
        } else {
          this.ownerShipForm.transferImageCodes = res.data.data.split(",")[0];
        }
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 出租
    rentOutSubmitForm() {
      this.$refs["rentOutForm"].validate((valid) => {
        if (valid) {
          this.rentOutForm.parkingCode = this.params.parkingCode;
          if (this.rentOutForm.createTime) {
            this.$request.parkingUpdateRent(this.rentOutForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.rentOutOpen = false;
                this.getList();
                this.$refs.rentOutForm.resetFields();
              }
            });
          } else {
            this.$request.parkingCreateRent(this.rentOutForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                this.rentOutOpen = false;
                this.getList();
                this.$refs.rentOutForm.resetFields();
              }
            });
          }
        }
      });
    },

    // 过户
    ownerShipSubmitForm() {
      this.$refs["ownerShipForm"].validate((valid) => {
        if (valid) {
          this.ownerShipForm.parkingCode = this.params.parkingCode;
          this.$request.parkingCreateTransfer(this.ownerShipForm).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("新增成功");
              this.rentOutOpen = false;
              this.getList();
              this.$refs.ownerShipForm.resetFields();
            }
          });
        }
      });
    },
    // 出租
    rentOut() {
      this.rentOutReset();
      this.isAddress = false;
      this.rentOutOpen = true;
      this.title = "车位出租";
    },
    // 过户
    ownerShip() {
      this.ownerShipReset();
      this.isCheak = false;
      this.isAddress = false;
      this.ownerShipOpen = true;
      this.title = "车位过户";
    },
    // 选择所有人按钮操作
    choose(row) {
      this.$request
        .peopleFfindUser({ id: row.id, userCode: row.userCode })
        .then((res) => {
          if (res.data.status == 200) {
            if (this.rentOutOpen) {
              this.rentOutForm.userName = res.data.data.userName;
              this.rentOutForm.mobile = res.data.data.mobile;
              this.rentOutForm.certificateTypeId =
                res.data.data.certificateTypeId;
              this.rentOutForm.tenantAddr = res.data.data.userAddr;
              this.rentOutForm.certificateNo = res.data.data.certificateCode;
            } else if (this.ownerShipOpen) {
              this.ownerShipForm.currUserName = res.data.data.userName;
              this.ownerShipForm.currMobile = res.data.data.mobile;
              this.ownerShipForm.currCertificateTypeId =
                res.data.data.certificateTypeId;
              this.ownerShipForm.currUserAddr = res.data.data.userAddr;
              this.ownerShipForm.currCertificateNo =
                res.data.data.certificateCode;
            }
            this.chooseShow = false;
            if (res.data.data.userAddr) {
              this.isAddress = true;
            } else {
              this.isAddress = false;
            }
          }
        });
    },
    // 取消按钮
    rentOutCancel() {
      this.rentOutOpen = false;
      this.rentOutReset();
      this.$refs.rentOutForm.resetFields();
    },
    ownerShipCancel() {
      this.ownerShipOpen = false;
      this.ownerShipReset();
      this.$refs.ownerShipForm.resetFields();
    },
    //获取出租列表
    getList() {
      this.loading = true;
      this.$request
        .parkingRentList(this.params)
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取过户列表
    transferGetList() {
      this.transferLoading = true;
      this.$request
        .parkingTransferList(this.transferParams)
        .then((res) => {
          this.transferTableData = res.data.data.rows;
          this.transferTotal = res.data.data.records;
          this.transferParams.page = res.data.data.page;
          this.transferLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    chooseGetList() {
      this.chooseLoading = true;
      this.$request
        .detailAll(this.chooseParams)
        .then((res) => {
          this.chooseTableData = res.data.data.rows;
          this.chooseTotal = res.data.data.records;
          this.chooseParams.page = res.data.data.page;
          this.chooseLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取用户详情
    getUser() {
      this.$request
        .parkingFind(this.params.parkingCode)
        .then((res) => {
          this.userInfo = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 出租修改
    handleUpdate(row) {
      const id = row.id;
      this.$request.parkingFindRent(id).then((res) => {
        this.rentOutForm = res.data.data;
        if (res.data.data.userAddr && res.data.data.parkingBelongTypeId != 48) {
          this.isAddress = true;
        } else {
          this.isAddress = false;
        }
        this.rentOutOpen = true;
        this.title = "出租修改";
      });
    },
    // 删除
    handleDelete(row) {
      let that = this;
      const id = row.id;
      this.$confirm("是否确认删除该条记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.parkingDelRent(id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
    },
    // 过户查看
    handleCheak(row) {
      const id = row.id;
      this.$request.parkingFindTransfer(id).then((res) => {
        this.ownerShipForm = res.data.data;
        this.isCheak = true;
        this.ownerShipOpen = true;
        this.title = "过户查看";
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  .parking {
    height: 120px;
    background: #fff;
    padding: 10px;
    .parking-img {
      display: inline-block;
      img {
        width: 120px;
        height: 120px;
      }
    }
    .user-info {
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      width: 70%;
      .car-id {
        font-size: 20px;
        font-weight: bold;
      }
      .parking-info {
        margin-top: 10px;
        span {
          padding: 5px 15px;
          border-radius: 20px;
          display: inline-block;
          background: #409eff;
          color: #fff;
          font-size: 12px;
          margin-right: 20px;
        }
      }
      .theuser {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        div {
          font-size: 16px;
        }
      }
    }
  }
  .tabs {
    background: #fff;
    padding-left: 10px;
  }
}
.operation {
  background: #fff;
  padding: 0 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
.elinput {
  width: 75% !important;
}
.btn-buka {
  width: 20%;
  margin-left: 4%;
  color: #fff;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% ;
}
</style>