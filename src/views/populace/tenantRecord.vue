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
              icon="el-icon-money"
              size="mini"
              :disabled="multiple"
              @click="exportExcel"
              >批量开通人脸识别</el-button
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
      :visible.sync="faceOpen"
      width="900px"
      append-to-body
    >
      <CommonTable
        :total="faceTotal"
        :loading="loading"
        :defColumns="faceColumn"
        @pagination="getFaceList"
        :dataList="faceTableData"
        :options="faceTableOptions"
        :page.sync="faceParams.page"
        :limit.sync="faceParams.pageSize"
      />
    </el-dialog>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="人脸识别状态：" prop="faceAuthStatus">
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
        <!-- <el-form-item label="告警子类型：" prop="alarmTypeCode">
          <el-select v-model="form.alarmTypeCode" placeholder="请选择">
            <el-option
              v-for="item in childAlarm"
              :key="item.alarmTypeCode"
              :label="item.alarmTypeName"
              :value="item.alarmTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
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
      // 是否显示弹出层
      open: false,
      faceOpen: false,
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
      // 非选择禁用
      multiple: true,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      faceTableOptions: {
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
          label: "人脸开通记录",
          icon: "el-icon-user",
          handler: (row) => this.faceCheck(row),
        },
        {
          label: "删除",
          icon: "iconfont icon-moveout",
          style: { color: "#F56C6C" },
          handler: (row) => this.handleDelete(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "证件编号" },
        { prop: "mobile", label: "电话号码" },
        {
          prop: "faceAuthStatus",
          label: "人脸开通状态",
          type: "select",
          options: [],
        },
        // {
        //   prop: "liveTypeId",
        //   label: "住户类型",
        //   type: "select",
        //   options: [],
        // },
      ],
      //表格列
      column: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        // { prop: "liveTypeIdStr", label: "住户类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "faceAuthStatusStr", label: "人脸开通状态" },
      ],
      faceColumn: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "remark", label: "人脸开通状态" },
        { prop: "createTime", label: "开通时间" },
      ],
      // 表格参数
      tableData: [],
      faceTableData: [],
      // 总条数
      total: 0,
      faceTotal: 0,
      ids: [],
      form: {},
      // 表单校验
      rules: {
        faceAuthStatus: [
          {
            required: true,
            message: "人脸识别状态未选择",
            trigger: "blur",
          },
        ],
      },
      // 字典列表
      dicLists: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
      },
      faceParams: {
        page: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "faceAuthStatus") {
          this.dicLists.faceComparisoneEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "liveTypeId") {
          this.dicLists.liveTypeEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.getList();
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 人脸识别提交按钮
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.dtoList = this.ids;
          this.$request.detailsUpdateBatch(this.form).then((res) => {
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
        faceAuthStatus: undefined,
        dtoList: undefined,
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
      this.ids = selection;
      this.multiple = !selection.length;
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
      };
      this.handleQuery();
    },
    // 查看按钮
    handleCheck(row) {
      this.$router.push({
        path: "/tenantDetail",
        name: "tenantDetail",
        params: {
          isOrNo: row.is,
          id: row.userCode,
        },
      });
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.detailsList(this.params).then((res) => {
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
    // 获取人脸识别列表
    getFaceList() {
      this.$request.detailsLogList(this.faceParams).then((res) => {
        if (res.data.status === 200) {
           this.faceTableData = res.data.data.rows;
           this.faceTotal = res.data.data.records;
          this.faceParams.page = res.data.data.page;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 解除绑定
    handleDelete(row) {
      let that = this;
      console.log(row)
      this.$confirm("删除后关联的信息将全部清除，是否确认删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.detailsDelete(row.userCode).then((res) => {
            if (res.data.status === 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    // 查看人脸开通列表
    faceCheck(row) {
      this.faceParams.certificateCode = row.certificateCode;
      this.getFaceList();
      this.faceOpen = true;
    },
    // 开通按钮
    exportExcel() {
      this.reset();
      this.open = true;
      this.title = "开通人脸识别";
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
.el-form-item__content .el-select {
  width: 90% !important;
}
.el-form-item__content .el-input {
  width: 90% !important;
}
</style>
