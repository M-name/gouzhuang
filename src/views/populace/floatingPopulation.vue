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
              icon="el-icon-download"
              size="mini"
              @click="exportExcel"
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
        @selection-change="handleSelectionChange"
      />
    </div>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12"
            ><el-form-item label="用户姓名:">
              <p>{{ dialogDate.userName }}</p>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="证件号码:" prop="msgTitle">
              <p>{{ dialogDate.certificateCode }}</p>
            </el-form-item></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item label="性别:" prop="msgTitle">
              <p>{{ dialogDate.userSexStr }}</p>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="电话:" prop="msgTitle">
              <p>{{ dialogDate.mobile }}</p>
            </el-form-item></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="12"
            ><el-form-item label="租用起始:" prop="msgTitle">
              <p>{{ dialogDate.rentBeginTime }}</p>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="租用截止:" prop="msgTitle">
              <p>{{ dialogDate.rentEndTime }}</p>
            </el-form-item></el-col
          >
        </el-row>

        <el-form-item label="搬出时间" prop="moveOutTime">
          <el-date-picker
            v-model="form.moveOutTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="搬出原因" prop="moveOutReason">
          <el-input v-model="form.moveOutReason" placeholder="请输入搬出原因" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      rules: {
        moveOutTime: [
          { required: true, message: "搬出时间未选择", trigger: "change" },
        ],
        moveOutReason: [
          { required: true, message: "搬出原因不能为空", trigger: "change" },
        ],
      },
      dialogDate: {},
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
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
          handler: (row) => this.handleCheck(row),
        },
        {
          label: "住户搬出",
          icon: "iconfont icon-moveout",
          style: { color: "#F56C6C" },
          handler: (row) => this.moveOut(row),
          isShow: (row) => {
            return row.liveStatus == 0;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "住户姓名" },
        { prop: "certificateCode", label: "证件编号" },
        { prop: "mobile", label: "住户电话" },
        { prop: "contactMethod", label: "联系人电话" },
        {
          prop: "liveStatus",
          label: "居住状态",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "userName", label: "住户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "liveTypeIdStr", label: "住户类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "住户性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "住户电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      form: {},
      // 字典列表
      dicLists: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        liveTypeId: 2,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        contactMethod: undefined,
        liveStatus: undefined,
      },
    };
  },
  created() {
    this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
      let lists = res.data.data;
      let live = [];
      let rea = [];
      let cert = [];
      for (var i = 0; i < lists.liveStatusEnum.length; i++) {
        let arr = {};
        arr.value = lists.liveStatusEnum[i].type;
        arr.label = lists.liveStatusEnum[i].value;
        live.push(arr);
      }
      for (var i = 0; i < lists.liveTypeEnum.length; i++) {
        let arr = {};
        arr.value = lists.liveTypeEnum[i].type;
        arr.label = lists.liveTypeEnum[i].value;
        rea.push(arr);
      }
      for (var i = 0; i < lists.certificateEnum.length; i++) {
        let arr = {};
        arr.value = lists.certificateEnum[i].type;
        arr.label = lists.certificateEnum[i].value;
        cert.push(arr);
      }
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "liveStatus") {
          item.options = live;
        }
        if (item.type == "select" && item.prop == "liveTypeId") {
          item.options = rea;
        }
        if (item.type == "select" && item.prop == "certificateTypeId") {
          item.options = cert;
        }
      });
    });
    this.getList();
  },
  methods: {
    // 搬出处理
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$request.tenantMove(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("提交成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        moveOutReason: undefined,
        moveOutTime: undefined,
        id: undefined,
      };
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsCode);
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        liveTypeId: 2,
        page: 1,
        pageSize: 20,
        liveTypeId: 2,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        contactMethod: undefined,
        liveStatus: undefined,
      };
      this.handleQuery();
    },
    // 新增
    addList() {
      this.$router.push({
        path: "/addPeople",
        name: "addPeople",
      });
    },
    // 修改按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/editPeople",
        name: "editPeople",
        params: {
          code: row.userCode,
          id: row.id,
        },
      });
    },
    // 查看按钮
    handleCheck(row) {
      this.$router.push({
        path: "/peopleDetail",
        name: "peopleDetail",
        params: {
          code: row.userCode,
        },
      });
    },
    // 住户搬出
    moveOut(row) {
      this.reset();
      this.form.id = row.id;
      this.$request.tenantInfo(row.id).then((res) => {
        if (res.data.status === 200) {
          this.open = true;
          this.title = "住户搬出";
          this.dialogDate = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.detailAll(this.params).then((res) => {
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
    // 导出
    exportExcel() {
      this.$request.downloadldExcel();
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
.el-form-item__content .el-input {
  width: 90% !important;
}
</style>
