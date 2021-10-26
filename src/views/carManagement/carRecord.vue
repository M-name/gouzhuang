<template>
  <div class="container">
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
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="addList"
              >新建车辆档案</el-button
            >
          </el-col>
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
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="83px">
        <i class="el-icon-s-custom"></i>
        <span>车辆基本信息</span>
        <el-divider></el-divider>
        <el-form-item label="车牌号:" prop="plateNo">
          <el-input v-model="form.plateNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车身颜色:" prop="carColor">
          <el-select v-model="form.carColor" placeholder="请选择">
            <el-option
              v-for="item in dicList.vehicleColorEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型:" prop="carModel">
          <el-select v-model="form.carModel" placeholder="请选择">
            <el-option
              v-for="item in dicList.vehicleTypeEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌型号:" prop="brandModel">
          <el-input
            v-model="form.brandModel"
            placeholder="请输入品牌型号（例：大众）"
          />
        </el-form-item>
        <el-form-item label="车位编码:" prop="parkingCode">
          <el-input
            @change="parkingCodeChange"
            v-model="form.parkingCode"
            placeholder="请输入车位编码"
          />
        </el-form-item>
        <el-form-item label="录入状态:" prop="entryStatus">
          <el-select v-model="form.entryStatus" placeholder="请选择">
            <el-option
              v-for="item in dicList.entryStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印状态:" prop="printStatus">
          <el-select v-model="form.printStatus" placeholder="请选择">
            <el-option
              v-for="item in dicList.printStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆备注:" prop="remark">
          <el-input
            type="textarea"
            autosize
            v-model="form.remark"
            placeholder="请输入车辆备注"
          />
        </el-form-item>
        <i class="el-icon-s-custom"></i>
        <span>所有人基本信息</span>
        <el-divider></el-divider>
        <el-form-item label="车主类型:" prop="carOwnerTypeId">
          <el-radio-group @change="carOwnerReset" v-model="form.carOwnerTypeId">
            <el-radio
              v-for="(item, index) in dicList.carOwnerEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isOutPeople" label="车主姓名:" prop="carOwner">
          <el-input
            class="elinput"
            :disabled="isOutPeople"
            v-model="form.carOwner"
            placeholder="请输入车主姓名"
          />
          <el-button class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item v-else label="车主姓名:" prop="carOwner">
          <el-input
            :disabled="isOutPeople"
            v-model="form.carOwner"
            placeholder="请输入车主姓名"
          />
        </el-form-item>
        <el-form-item label="联系方式:" prop="ownerMobile">
          <el-input v-model="form.ownerMobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="证件类型:" prop="certificateTypeId">
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
        <el-form-item label="证件号码:" prop="identityNo">
          <el-input
            :disabled="isOutPeople"
            v-model="form.identityNo"
            placeholder="请输入证件号码"
          />
        </el-form-item>
        <el-form-item label="证件上传:" prop="certificateImageCode">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :on-remove="getLocalImgs"
            :file-list="fileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
      <image width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      //表格操作列内容
      chooseTableOperations: [
        {
          label: "选择",
          icon: "el-icon-edit",
          handler: (row) => this.choose(row),
        },
      ],
      chooseTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
        border: false, // 边框
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
      // 是否为外来人员
      isOutPeople: false,
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //加载状态
      loading: false,
      chooseLoading: false,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleCheak(row),
        },
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
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "plateNo", label: "车牌号 " },
        { prop: "parkingCode", label: " 车位编码" },
        {
          prop: "carOwnerTypeId",
          label: "车主类型",
          type: "select",
          options: [],
        },
        {
          prop: "entryStatus",
          label: "录入状态",
          type: "select",
          options: [],
        },
        {
          prop: "printStatus",
          label: "打印状态",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "登记时间段",
          type: "datePicker",
        },
      ],
      // 是否显示弹出层
      open: false,
      chooseShow: false,
      // 弹出层标题
      title: "",
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
      //表格列
      column: [
        { prop: "plateNo", label: "车牌号 " },
        { prop: "carColorStr", label: "车身颜色" },
        { prop: "carModelStr", label: "车辆类型" },
        { prop: "brandModel", label: "品牌型号" },
        { prop: "carOwner", label: "车主姓名" },
        { prop: "ownerMobile", label: "车主联系方式" },
        { prop: "identityNo", label: "车主证件编码" },
        { prop: "carOwnerTypeIdStr", label: "车主类型" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "entryStatusStr", label: "录入状态" },
        { prop: "printStatusStr", label: "打印状态" },
        { prop: "createTime", label: "登记时间" },
        { prop: "remark", label: "备注" },
        { prop: "handleBy", label: "办理人员" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carOwner: [
          { required: true, message: "车主姓名不能为空", trigger: "change" },
        ],
        ownerMobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          this.$rules.mobile(undefined, "blur"),
        ],
        plateNo: [
          { required: true, message: "车牌号不能为空", trigger: "change" },
        ],
        carColor: [
          { required: true, message: "车身颜色不能为空", trigger: "change" },
        ],
        carModel: [
          { required: true, message: "车辆类型不能为空", trigger: "change" },
        ],
        brandModel: [
          { required: true, message: "品牌型号不能为空", trigger: "change" },
        ],
        parkingCode: [
          { required: true, message: "车位编码不能为空", trigger: "change" },
        ],
        certificateTypeId: [
          { required: true, message: "证件类型不能为空", trigger: "change" },
        ],
        identityNo: [
          { required: true, message: "证件编码不能为空", trigger: "change" },
        ],
      },
      ids: [],
      dicList: [],
      roleStatus: [],
      fileImg: [],
      uploadImgList: [],
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
        plateNo: undefined,
        parkingCode: undefined,
        carOwnerTypeId: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  watch: {
    "form.carOwnerTypeId": {
      handler(newName, oldName) {
        if (newName == 52) {
          this.isOutPeople = true;
        } else {
          this.isOutPeople = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$request.parkingFindEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "carOwnerTypeId") {
          this.dicList.carOwnerEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "printStatus") {
          this.dicList.printStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "entryStatus") {
          this.dicList.entryStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
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
    this.getList();
    this.chooseGetList();
  },
  methods: {
    // 输入车位编码后
    parkingCodeChange(val) {
      this.$request.parkingFindParkingCode(val).then((res) => {
        if (res.data.status == 200) {
          this.form.carOwnerTypeId = res.data.data.tenantTypeId;
          this.form.carOwner = res.data.data.userName;
          if (res.data.data.userCode) {
            this.form.userCode = res.data.data.userCode;
          } else {
            this.form.userCode = undefined;
          }
          this.form.ownerMobile = res.data.data.mobile;
          this.form.certificateTypeId = res.data.data.certificateTypeId;
          this.form.identityNo = res.data.data.certificateNo;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 选择所有人按钮操作
    choose(row) {
      this.$request
        .peopleFfindUser({ id: row.id, userCode: row.userCode })
        .then((res) => {
          if (res.data.status == 200) {
            this.form.carOwner = res.data.data.userName;
            this.form.userCode = res.data.data.userCode;
            this.form.ownerMobile = res.data.data.mobile;
            this.form.certificateTypeId = res.data.data.certificateTypeId;
            this.form.identityNo = res.data.data.certificateCode;
            this.chooseShow = false;
            if (res.data.data.userAddr) {
              this.isAddress = true;
            } else {
              this.isAddress = false;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    chooseGetList() {
      this.chooseLoading = true;
      this.$request.detailAll(this.chooseParams).then((res) => {
        if (res.data.status == 200) {
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
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
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
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        if (res.data.status == 200) {
          const url = res.data.data.split(",")[1];
          const obj = { url };
          this.fileImg.push(obj);
          this.uploadImgList.push({
            code: res.data.data.split(",")[0],
            url: res.data.data.split(",")[1],
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 删除上传图片
    getLocalImgs(file, fileList) {
      this.uploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          console.log(index);
          this.uploadImgList.splice(index, 1);
        }
      });
    },
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).map((key) => {
        if (datas[key].value == "" + value) {
          actions.push(datas[key].label);
          return false;
        }
      });
      return actions.join("");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
      } else {
        this.params.startTime = undefined;
        this.params.endTime = undefined;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        plateNo: undefined,
        parkingCode: undefined,
        carOwnerTypeId: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      this.$request.parkingFindCar(row.id).then((res) => {
        this.form = res.data.data;
        this.open = true;
        this.title = "修改车辆档案";
      });
    },
    handleCheak(row) {
      this.$router.push({
        path: "/carDetail",
        name: "carDetail",
        params: {
          code: row.id,
        },
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
      this.$refs.upload.clearFiles();
    },
    // 导出excel
    Export() {
      this.$request.parkingDownloadCarExcel(this.params);
    },
    // 新增的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.createTime) {
            this.$request.parkingUpdateCar(this.form).then((res) => {
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
            let str = [];
            for (var i = 0; i < this.uploadImgList.length; i++) {
              str.push(this.uploadImgList[i].code);
              console.log(this.uploadImgList[i].code);
            }
            this.form.certificateImageCode = str.toString();
            this.$request.parkingCreateCar(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
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
    // 所有人类型选择改变后
    choosePeople() {
      this.chooseShow = true;
    },
    // 表单重置
    reset() {
      this.form = {
        plateNo: undefined,
        carColor: undefined,
        carModel: undefined,
        brandModel: undefined,
        parkingCode: undefined,
        entryStatus: 0,
        printStatus: 0,
        remark: undefined,
        carOwnerTypeId: 53,
        carOwner: undefined,
        userCode: undefined,
        ownerMobile: undefined,
        certificateTypeId: undefined,
        identityNo: undefined,
        certificateImageCode: undefined,
      };
      this.fileImg = [];
      this.uploadImgList = [];
    },
    carOwnerReset() {
      this.form.carOwner = undefined;
      this.form.ownerMobile = undefined;
      this.form.certificateTypeId = undefined;
      this.form.identityNo = undefined;
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新建车辆档案";
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.parkingCarList(this.params).then((res) => {
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

    // 删除
    handleDelete(row) {
      let that = this;
      const id = row.id;
      this.$confirm("是否确认删除该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.parkingDelCar(id).then((res) => {
            if (res.data.status == 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
  },
};
</script>

<style lang="scss" scoped>
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
.el-form-item__content .el-select {
  width: 100% !important;
}
</style>
