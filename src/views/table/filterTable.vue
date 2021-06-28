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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="完成人：" prop="managerCode">
          <el-select v-model="form.managerCode" placeholder="请选择">
            <el-option-group
              v-for="group in staffList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间:" prop="finishTime">
          <el-date-picker
            v-model="form.finishTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
      // 表单校验
      rules: {
        managerCode: [
          { required: true, message: "完成人未选择", trigger: "change" },
        ],
        finishTime: [
          { required: true, message: "完成时间未选择", trigger: "change" },
        ],
      },
      // 表单参数
      form: {},
      // 工作人员列表
      staffList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
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
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "完成",
          icon: "el-icon-tickets",
          handler: (row) => this.handleFinish(row),
        },
        {
          label: "派单",
          icon: "iconfont icon-assign",
          handler: (row) => this.handlePayout(row),
          isShow: (row) => {
            return row.repaireStatus < 30;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房屋编码 " },
        { prop: "userName", label: " 报修用户" },
        {
          prop: "mobile",
          label: "用户手机号",
        },
        {
          prop: "repaireCode",
          label: "工单编号",
        },
        {
          prop: "repaireStatus",
          label: "处理状态",
          type: "select",
          options: [],
        },
        {
          prop: "managerName",
          label: "维修员工",
        },
      ],
      //表格列
      column: [
        { prop: "createTime", label: "提交时间 " },
        { prop: "repaireCode", label: "工单编号", widht: "180" },
        { prop: "repairType", label: "报修类型", widht: "180" },
        { prop: "buildingCodeStr", label: "报修房屋" },
        {
          prop: "userName",
          label: "联系方式",
          render: (h, scope) => {
            return h("div", [scope.row.userName + "/ " + scope.row.mobile]);
          },
        },
        {
          prop: "repaireStatus",
          label: "处理状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(this.roleStatus, row.repaireStatus);
          },
        },
        { prop: "publishTypeValue", label: "派发策略" },
        { prop: "managerName", label: "维修员工" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      roleStatus: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        mobile: undefined,
        repaireStatus: undefined,
        managerName: undefined,
      },
    };
  },
  created() {
    this.$request.alarmGetStaff().then((res) => {
      const list = res.data.data;
      let staff = [];
      for (var i = 0; i < Object.keys(list).length; i++) {
        let arr = { label: "", options: [] };
        arr.label = Object.keys(list)[i];
        for (var j = 0; j < list[Object.keys(list)[i]].length; j++) {
          arr.options.push({
            value: list[Object.keys(list)[i]][j].userCode,
            label: list[Object.keys(list)[i]][j].realName,
          });
        }
        staff.push(arr);
      }
      this.staffList = staff;
    });
    this.$request.findRepairAlleuems().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < lists.repaireProgressEnum.length; i++) {
        let arr = {};
        arr.value = lists.repaireProgressEnum[i].type;
        arr.label = lists.repaireProgressEnum[i].value;
        role.push(arr);
      }
      this.roleStatus = role;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "repaireStatus") {
          item.options = role;
        }
      });
    });
    this.getList();
  },
  methods: {
    // 新增的提交
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          that.$request.repairProcessed(this.form).then((res) => {
            if (res.data.status == 200) {
              that.$message.success("提交成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              this.open = false;
              that.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        managerCode: "",
        remark: "",
        repaireCode: "",
        finishTime: undefined,
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        mobile: undefined,
        repaireStatus: undefined,
        managerName: undefined,
      };
      this.handleQuery();
    },
    // 完成按钮
    handleFinish(row) {
      this.reset();
      this.open = true;
      this.title = "订单完成";
      this.form.repaireCode = row.repaireCode;
    },
    // 查看按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/detailInfo",
        name: "detailInfo",
        params: {
          type: 0,
          code: row.repaireCode,
        },
      });
    },
    handlePayout(row) {
      this.$router.push({
        path: "/detailInfo",
        name: "detailInfo",
        params: {
          type: 1,
          code: row.repaireCode,
        },
      });
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.getRepairProcessList(this.params).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          that.$message.error(res.data.msg);
          this.loading = false;
        }
      });
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
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
/deep/.el-dialog__body {
  padding: 30px 25px 30px 10px;
}
</style>
