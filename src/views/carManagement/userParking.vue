<template>
  <div class="container">
    <div class="choose" style="background: #fff">
      <el-form label-width="100px">
        <el-form-item label="车位区域:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.zoneName"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.parkingZoneEnum"
              :label="item"
              :key="index"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车位状态:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.parkingStatus"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.parkingStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用情况:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.parkingUsingStatus"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.parkingUsingStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding-right: 20px; background: #fff">
      <CommonSearch
        @resetQuery="resetQuery"
        @handleQuery="handleQuery"
        :queryParams.sync="params"
        :searchList="commonSearchList"
      />
    </div>
    <div class="operation">
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="Export"
              >导出Excel</el-button
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
          <el-button class="btn-buka" type="primary" @click="choosePeople"
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
      <div slot="footer" class="dialog-footer">
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
          <el-input v-model="rentOutForm.mobile" placeholder="租用入手机号" />
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
    <!-- 关联或修改 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <i class="el-icon-s-custom"></i>
        <span>所有人基本信息</span>
        <el-divider></el-divider>
        <el-form-item label="所有人类型:" prop="parkingBelongTypeId">
          <el-radio-group @change="reset" v-model="form.parkingBelongTypeId">
            <el-radio
              v-for="(item, index) in dicList.parkingBelongEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isOutPeople" label="所有人姓名:" prop="userName">
          <el-input
            class="elinput"
            :disabled="isOutPeople"
            v-model="form.userName"
            placeholder="请输入所有人姓名"
          />
          <el-button class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item v-else label="所有人姓名:" prop="userName">
          <el-input
            :disabled="isOutPeople"
            v-model="form.userName"
            placeholder="请输入所有人姓名"
          />
        </el-form-item>
        <el-form-item label="所有人手机号:" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="所有人证件类型:" prop="certificateTypeId">
          <el-select
            :disabled="isOutPeople"
            v-model="form.certificateTypeId"
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
        <el-form-item label="所有人证件号码:" prop="certificateNo">
          <el-input
            :disabled="isOutPeople"
            v-model="form.certificateNo"
            placeholder="请输入证件号码"
          />
        </el-form-item>
        <el-form-item label="所有人地址:" prop="userAddr">
          <el-input
            :disabled="isAddress"
            v-model="form.userAddr"
            placeholder="请输入所有人地址"
          />
        </el-form-item>
        <el-form-item label="购买时间:" prop="buyTime">
          <el-date-picker
            v-model="form.buyTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车位状态：" prop="parkingStatus">
          <el-select v-model="form.parkingStatus" placeholder="请选择">
            <el-option
              v-for="item in dicList.parkingStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用情况：" prop="parkingUsingStatus">
          <el-select v-model="form.parkingUsingStatus" placeholder="请选择">
            <el-option
              v-for="item in dicList.parkingUsingStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买备注:" prop="remark">
          <el-input
            type="textarea"
            autosize
            v-model="form.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
        <i class="el-icon-s-custom"></i>
        <span>证明材料</span>
        <el-divider></el-divider>
        <el-form-item label-width="20px" label="" prop="certificateImageCodes">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :file-list="fileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
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
  name: "userControl",
  data() {
    return {
      header: {
        "Content-Type": "multipart/form-data",
      },
      fileImg: [],
      rentOutFileImg: [],
      ownerShipFileImg: [],
      dialogImageUrl: "",
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
      //加载状态
      loading: false,
      chooseLoading: false,
      isAddress: false,
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
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleCheak(row),
        },
        {
          label: "关联",
          icon: "iconfont icon-lick",
          handler: (row) => this.handleEdit(row),
        },
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "出租",
          icon: "iconfont icon-rent",
          handler: (row) => this.rentOut(row),
        },
        {
          label: "过户",
          icon: "iconfont icon-transfer",
          handler: (row) => this.ownerShip(row),
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
      // 公用搜索组件内容
      commonSearchList: [{ prop: "parkingCode", label: "车位编码" }],
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
      // 是否显示弹出层
      open: false,
      rentOutOpen: false,
      ownerShipOpen: false,
      // 弹出层标题
      title: "",
      // 在岗状态列表
      postStatusList: [],
      //部门列表
      deptList: [],
      // 角色列表
      roleList: [],
      // 地区级联列表
      areaList: [],
      // 角色状态列表
      userStatusList: [],
      //表格列
      column: [
        { prop: "zoneName", label: "车位区域" },
        { prop: "parkingCode", label: "车位编码", widht: "180" },
        { prop: "parkingStatusStr", label: "车位状态", widht: "180" },
        { prop: "parkingUsingStatusStr", label: "使用情况" },
        { prop: "parkingBelongTypeIdStr", label: "所有人类型" },
        { prop: "userName", label: "所有人姓名" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      // 表单参数
      form: {},
      rentOutForm: {},
      ownerShipForm: {},
      // 表单校验
      rules: {
        parkingBelongTypeId: [
          { required: true, message: "所有人类型未选择", trigger: "change" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          this.$rules.mobile(undefined, "blur"),
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
        userAddr: [
          { required: true, message: "地址不能为空", trigger: "change" },
        ],
        buyTime: [
          { required: true, message: "购买时间不能为空", trigger: "change" },
        ],
        parkingStatus: [
          { required: true, message: "车位状态未选择", trigger: "change" },
        ],
        parkingUsingStatus: [
          { required: true, message: "使用情况未选择", trigger: "change" },
        ],
      },
      rentOutRules: {
        tenantTypeId: [
          { required: true, message: "租用人类型未选择", trigger: "change" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          this.$rules.mobile(undefined, "blur"),
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
          this.$rules.mobile(undefined, "blur"),
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
      ids: [],
      parkingCode: undefined,
      preUserCode: undefined,
      // 字典列表
      dicList: [],
      dicLists: [],
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
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        zoneName: "",
        parkingStatus: "",
        parkingCode: undefined,
        parkingUsingStatus: "",
      },
    };
  },
  watch: {
    "form.parkingBelongTypeId": {
      handler(newName, oldName) {
        if (newName == 47 || newName == 49) {
          this.isOutPeople = true;
        } else {
          this.isOutPeople = false;
          this.isAddress = false;
        }
      },
      deep: true,
      immediate: true,
    },
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
  created() {
    this.$request.areaListAll().then((res) => {
      this.areaList = res.data.data;
    });
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
    // 字典处理
    this.$request.parkingFindEnum().then((res) => {
      this.dicList = res.data.data;
    });
    this.getList();
    this.chooseGetList();
  },
  methods: {
    // 选择所有人按钮操作
    choose(row) {
      this.$request
        .peopleFfindUser({ id: row.id, userCode: row.userCode })
        .then((res) => {
          if (res.data.status == 200) {
            if (this.open) {
              this.form.userName = res.data.data.userName;
              this.form.userCode = res.data.data.userCode;
              this.form.mobile = res.data.data.mobile;
              this.form.certificateTypeId = res.data.data.certificateTypeId;
              this.form.userAddr = res.data.data.userAddr;
              this.form.certificateNo = res.data.data.certificateCode;
            } else if (this.rentOutOpen) {
              this.rentOutForm.userName = res.data.data.userName;
              this.rentOutForm.userCode = res.data.data.userCode;
              this.rentOutForm.mobile = res.data.data.mobile;
              this.rentOutForm.certificateTypeId =
                res.data.data.certificateTypeId;
              this.rentOutForm.tenantAddr = res.data.data.userAddr;
              this.rentOutForm.certificateNo = res.data.data.certificateCode;
            } else if (this.ownerShipOpen) {
              this.ownerShipForm.currUserName = res.data.data.userName;
              this.ownerShipForm.currUserCode = res.data.data.userCode;
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
          }else {
          this.$message.error(res.data.msg);
        }
        });
    },
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.fileImg.push(obj);
        if (this.form.certificateImageCodes != undefined) {
          this.form.certificateImageCodes =
            this.form.certificateImageCodes + "," + res.data.data.split(",")[0];
        } else {
          this.form.certificateImageCodes = res.data.data.split(",")[0];
        }
      });
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
    // 导出excel
    Export() {
      this.$request.parkingDownloadExcel(this.params);
    },
    /** 搜索按钮操作 */
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
    },
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params.parkingCode = undefined;
      this.handleQuery();
    },
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
    // 修改按钮
    handleUpdate(row) {
      if (!row.parkingBelongTypeId && !row.userName) {
        this.$message.error("请先关联用户");
        return;
      }
      this.reset();
      const id = row.parkingCode;
      this.parkingCode = row.parkingCode;
      this.$request.parkingFind(id).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.open = true;
          if (
            res.data.data.userAddr &&
            res.data.data.parkingBelongTypeId != 48
          ) {
            this.isAddress = true;
          } else {
            this.isAddress = false;
          }
          this.title = "修改";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 所有人类型选择改变后
    choosePeople() {
      this.chooseShow = true;
    },
    // 查看按钮
    handleCheak(row) {
      this.$router.push({
        path: "/parkingDetail",
        name: "parkingDetail",
        params: {
          code: row.parkingCode,
        },
      });
    },
    // 关联按钮
    handleEdit(row) {
      if (row.parkingBelongTypeId && row.userName) {
        this.$message.error("该车位已关联用户");
        return;
      }
      this.reset();
      this.isAddress = false;
      this.parkingCode = row.parkingCode;
      this.open = true;
      this.title = "关联";
    },
    // 出租
    rentOut(row) {
      if (!row.parkingBelongTypeId && !row.userName) {
        this.$message.error("请先关联用户");
        return;
      }
      this.rentOutReset();
      this.isAddress = false;
      this.parkingCode = row.parkingCode;
      this.rentOutOpen = true;
      this.title = "出租";
    },
    // 过户
    ownerShip(row) {
      if (!row.parkingBelongTypeId && !row.userName) {
        this.$message.error("请先关联用户");
        return;
      }
      this.ownerShipReset();
      this.isAddress = false;
      this.parkingCode = row.parkingCode;
      console.log(row.userCode);
      if (row.userCode) {
        this.preUserCode = row.userCode;
      } else {
        this.preUserCode = "";
      }
      this.ownerShipOpen = true;
      this.title = "过户";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
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
    // 新增的提交
    submitForm() {
      let that = this;
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.parkingCode = this.parkingCode;
          if (this.form.createTime) {
            this.$request.parkingUpdate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$request.parkingCreate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("关联成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    // 出租
    rentOutSubmitForm() {
      this.$refs["rentOutForm"].validate((valid) => {
        if (valid) {
          this.rentOutForm.parkingCode = this.parkingCode;
          this.$request.parkingCreateRent(this.rentOutForm).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("出租成功");
              this.rentOutOpen = false;
              this.getList();
              this.$refs.rentOutForm.resetFields();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },

    // 过户
    ownerShipSubmitForm() {
      this.$refs["ownerShipForm"].validate((valid) => {
        if (valid) {
          this.ownerShipForm.parkingCode = this.parkingCode;
          this.ownerShipForm.preUserCode = this.preUserCode;
          console.log(this.ownerShipForm.preUserCode, this.preUserCode);
          this.$request
            .parkingCreateTransfer(this.ownerShipForm)
            .then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("过户成功");
                this.ownerShipOpen = false;
                this.getList();
                this.$refs.ownerShipForm.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },

    // 表单重置
    reset(val) {
      if (val) {
        this.form = {
          parkingBelongTypeId: val,
          userName: undefined,
          userCode: undefined,
          mobile: undefined,
          parkingCode: undefined,
          certificateTypeId: undefined,
          certificateNo: undefined,
          certificateImageCodes: undefined,
          userAddr: undefined,
          buyTime: undefined,
          parkingStatus: undefined,
          parkingUsingStatus: undefined,
          remark: undefined,
        };
      } else {
        this.form = {
          parkingBelongTypeId: 48,
          userName: undefined,
          userCode: undefined,
          mobile: undefined,
          certificateNo: undefined,
          parkingCode: undefined,
          certificateTypeId: undefined,
          certificateImageCodes: undefined,
          userAddr: undefined,
          buyTime: undefined,
          parkingStatus: undefined,
          parkingUsingStatus: undefined,
          remark: undefined,
        };
      }
    },
    rentOutReset(val) {
      if (val) {
        this.rentOutForm = {
          tenantTypeId: val,
          userName: undefined,
          userCode: undefined,
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
          userCode: undefined,
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
          currUserCode: undefined,
          userCode: undefined,
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
          userCode: undefined,
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

    //获取列表
    getList() {
      this.loading = true;
      this.$request.parkingAll(this.params).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    chooseGetList() {
      this.chooseLoading = true;
      this.$request.detailAll(this.chooseParams).then((res) => {
        if (res.data.status === 200) {
          this.chooseTableData = res.data.data.rows;
          this.chooseTotal = res.data.data.records;
          this.chooseParams.page = res.data.data.page;
          this.chooseLoading = false;
        } else {
          this.chooseLoading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .choose {
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/.el-radio-button__inner {
      border: none;
    }
  }
}
.operation {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
.el-divider--horizontal {
  margin: 10px 0;
}
.elinput {
  width: 75%;
}
.btn-buka {
  width: 20%;
  margin-left: 4%;
  color: #fff;
}
.pagination {
  text-align: center;
  margin-top: 34px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-date-editor.el-input {
  width: 100% !important;
}
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>
