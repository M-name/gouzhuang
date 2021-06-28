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
      width="750px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="回访时间:" prop="revisitTime">
          <el-date-picker
            v-model="form.revisitTime"
            type="datetime"
            style="width:100%"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回访内容:" prop="revisitContent">
          <el-input
            type="textarea"
             :rows="3"
            v-model="form.revisitContent"
            placeholder="请输入回访内容"
          />
        </el-form-item>
        <el-form-item label="回访人:" prop="createBy">
          <el-select v-model="form.createBy" placeholder="请选择回访人">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
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
       // 工作人员列表
      staffList: [],
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
          handler: (row) => this.handleEdit(row),
        },
        {
          label: "回访",
          icon: "iconfont icon-reuisit",
          handler: (row) => this.handleUpdate(row),
          isShow: (row) => {
            return row.revisitStatus == 0;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房屋编码 " },
        { prop: "userName", label: " 住户姓名" },
        {
          prop: "mobile",
          label: "住户手机",
        },
        {
          prop: "repaireCode",
          label: "工单编号",
        },
        {
          prop: "managerName",
          label: "维修员工",
        },
        {
          prop: "times",
          label: "完成时间",
          type: "datePicker",
        },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "createTime", label: "提交时间 " },
        { prop: "repaireCode", label: "工单编号", widht: "180" },
        { prop: "repairType", label: "报修类型", widht: "180" },
        { prop: "buildingCodeStr", label: "房屋编码" },
        {
          prop: "userName",
          label: "住户信息",
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
        { prop: "revisitStatusValue", label: "回访状态" },
        { prop: "finishTime", label: "完成时间" },
        
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisitTime: [
          { required: true, message: "回访时间未选择", trigger: "change" },
        ],
        revisitContent: [
          { required: true, message: "回访内容不能为空", trigger: "change" },
        ],
        createBy: [
          { required: true, message: "回访人不能为空", trigger: "change" },
        ],
      },
      roleStatus: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        repaireCode: undefined,
        repaireStatus: 60,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
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
            value:
              list[Object.keys(list)[i]][j].realName +
              "," +
              list[Object.keys(list)[i]][j].userCode,
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
    });
    this.getList();
  },
  methods: {
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
        this.params.times = undefined;
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
        userName: undefined,
        mobile: undefined,
        repaireCode: undefined,
        repaireStatus: 60,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 回访按钮
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.form.repaireCode = row.repaireCode;
      this.title = "回访";
    },
    // 查看按钮
    handleEdit(row) {
      this.$router.push({
        path: "/detailInfo",
        name: "detailInfo",
        params: {
          type: 2,
          code: row.repaireCode,
        },
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 新增的提交
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$request.saveRepaireRevisit(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("回访成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              that.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        repaireCode: undefined,
        revisitTime: undefined,
        revisitContent: undefined,
        createBy: undefined,
      };
    },

    // 导出
    Export() {
      this.$request.downloadExcel(this.params);
    },
    //获取报修完成记录列表
    getList() {
      this.loading = true;
      this.$request
        .getRepairList(this.params)
        .then((res) => {
          if (res.data.status === 200) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.records;
            this.params.page = res.data.data.page;
            this.loading = false;
          } else {
            this.$message.error(res.data.msg);
            this.loading = false;
          }
        })
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
/deep/.el-dialog__body{
  padding-right: 50px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
</style>
