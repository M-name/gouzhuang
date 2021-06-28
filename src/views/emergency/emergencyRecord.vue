<template>
  <div class="content">
    <div class="static">
      <div class="static-item">
        <img src="@/assets/daichuli.png" alt="" />
        <div>
          <p>待处理</p>
          <span>{{ statisticList.pending }}</span>
        </div>
      </div>
      <div class="static-item">
        <img src="@/assets/chulizhong.png" alt="" />
        <div>
          <p>处理中</p>
          <span>{{ statisticList.being }}</span>
        </div>
      </div>
      <div class="static-item">
        <img src="@/assets/yichuli.png" alt="" />
        <div>
          <p>已处理</p>
          <span>{{ statisticList.processed }}</span>
        </div>
      </div>
      <div class="static-item">
        <img src="@/assets/yizuofei.png" alt="" />
        <div>
          <p>已作废</p>
          <span>{{ statisticList.haveVoide }}</span>
        </div>
      </div>
      <div class="static-item">
        <img src="@/assets/gaojingleiji.png" alt="" />
        <div>
          <p>告警累计</p>
          <span>{{ statisticList.sum }}</span>
        </div>
      </div>
    </div>
    <div class="operation">
      <div style="background: #fff">
        <CommonSearch
          @resetQuery="resetQuery"
          @handleQuery="handleQuery"
          :queryParams.sync="params"
          :searchList="commonSearchList"
        />
      </div>
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="excelImport"
              >导出Excel</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              :disabled="multiple"
              @click="handleDelete()"
              >删除</el-button
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
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <!-- <i class="el-icon-s-custom"></i> -->
        <!-- <span>告警信息</span>
        <el-divider></el-divider> -->
        <el-form-item style="margin-bottom: 15px" label="告警类型名称：">
          <p>{{ updateInfo.alarmType }}</p>
        </el-form-item>
        <el-form-item style="margin-bottom: 15px" label="告警主体类型：">
          <p>{{ updateInfo.alarmSubject }}</p>
        </el-form-item>
        <el-form-item style="margin-bottom: 15px" label="告警简要描述：">
          <p>{{ updateInfo.alarmContent }}</p>
        </el-form-item>

        <el-form-item style="margin-bottom: 15px" label="告警信息详情：">
          <p>{{ updateInfo.alarmTitle }}</p>
        </el-form-item>
        <!-- <span>告警处理</span>
        <el-divider></el-divider> -->
        <el-form-item
          label="处理状态:"
          prop="alarmHandleStatus"
          label-width="100px"
        >
          <el-radio-group v-model="updateInfo.alarmHandleStatus">
            <el-radio
              v-for="(item, index) in dictList.alarmStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理时间:" prop="handleTime" label-width="100px">
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="form.handleTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择处理时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="处理员工:" prop="updateBy" label-width="100px">
          <el-select v-model="form.updateBy" placeholder="请选择">
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
        <el-form-item label="处理描述:" prop="handleDesc" label-width="100px">
          <el-input v-model="form.handleDesc" placeholder="请输入处理描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="detailOpen"
      width="800px"
      append-to-body
    >
      <el-form label-width="140px">
        <!-- <i class="el-icon-s-custom"></i> -->
        <span>告警信息</span>
        <el-divider></el-divider>
        <el-form-item style="margin-bottom: 0px" label="告警类型名称：">
          <p>{{ detailInfo.alarmType }}</p>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px" label="告警主体类型：">
          <p>{{ detailInfo.alarmSubject }}</p>
        </el-form-item>
        <el-form-item style="margin-bottom: 0px" label="告警简要描述：">
          <p>{{ detailInfo.alarmContent }}</p>
        </el-form-item>

        <el-form-item style="margin-bottom: 0px" label="告警信息详情：">
          <p>{{ detailInfo.alarmTitle }}</p>
        </el-form-item>
      </el-form>
      <p style="margin-top: 20px">处理信息</p>
      <el-divider></el-divider>
      <CommonTable
        :defColumns="detailColumn"
        :dataList="detailTableData"
        :options="detailTableOptions"
      />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      multiple: true,
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      detailTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "告警处理",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
          isShow: (row) => {
            return row.alarmHandleStatus == 0 || row.alarmHandleStatus == 1;
          },
        },
        {
          label: "详情查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleEdit(row),
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
        {
          prop: "alarmMainCode",
          label: "告警类型",
          type: "select",
          options: [],
        },
        {
          prop: "alarmSubCode",
          label: "告警子类型",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "告警时间段",
          type: "datePicker",
        },
        {
          prop: "alarmHandleStatus",
          label: "处理状态",
          type: "select",
          options: [],
        },
      ],
      // 是否显示弹出层
      open: false,
      detailOpen: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "alarmType", label: "告警类型名称 " },
        { prop: "alarmTitle", label: "告警类型描述" },
        { prop: "alarmRankStr", label: "告警级别" },
        { prop: "alarmTime", label: "告警时间" },
        { prop: "createTime", label: "入库时间" },
        {
          prop: "alarmHandleStatus",
          label: "处理状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(
              this.dictList.alarmStatusEnum,
              row.alarmHandleStatus
            );
          },
        },
      ],
      detailColumn: [
        { prop: "handleTime", label: "处理时间 " },
        { prop: "userName", label: "处理员工" },
        { prop: "alarmHandleStatus", label: "处理状态" },
        { prop: "handleDesc", label: "处理描述" },
      ],
      // 表格参数
      tableData: [],
      detailTableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      updateInfo: {},
      detailInfo: {},
      // 表单校验
      rules: {
        handleTime: [
          { required: true, message: "处理时间未选择", trigger: "change" },
        ],
        updateBy: [
          { required: true, message: "处理员工未选择", trigger: "change" },
        ],
      },
      ids: [],
      roleStatus: [],
      dictList: {},
      // 统计数据
      statisticList: {},
      staffList: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        alarmHandleStatus: undefined,
        alarmSubCode: undefined,
        alarmMainCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  watch: {
    "params.alarmMainCode": {
      handler(newName, oldName) {
        if (newName) {
          this.params.alarmSubCode = undefined;
          this.$request.alarmTypeDictFindSubCode(newName).then((res) => {
            this.commonSearchList.forEach((item) => {
              if (item.type == "select" && item.prop == "alarmSubCode") {
                item.options = [];
                res.data.data.map((res) => {
                  item.options.push({
                    label: res.alarmTypeName,
                    value: res.alarmTypeCode,
                  });
                });
              }
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$request.alarmStatistics().then((res) => {
      this.statisticList = res.data.data;
    });
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
    this.$request.alarmGetEnum().then((res) => {
      this.dictList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "alarmHandleStatus") {
          this.dictList.alarmStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.$request.alarmTypeDictFindSubCode("00").then((res) => {
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "alarmMainCode") {
          res.data.data.map((res) => {
            item.options.push({
              label: res.alarmTypeName,
              value: res.alarmTypeCode,
            });
          });
        }
      });
    });
    this.getList();
  },
  methods: {
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      datas.map((key) => {
        if (key.type == "" + value) {
          actions.push(key.value);
          return false;
        }
      });
      return actions.join("");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
        alarmHandleStatus: undefined,
        alarmSubCode: undefined,
        alarmMainCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 告警处理按钮
    handleUpdate(row) {
      this.reset();
      this.$request.alarmFindOne(row.alarmCode).then((res) => {
        if (res.data.status == 200) {
          this.updateInfo = res.data.data;
          this.open = true;
          this.title = "告警处理";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 详情查看按钮
    handleEdit(row) {
      this.$request.alarmFindDetails(row.alarmCode).then((res) => {
        if (res.data.status == 200) {
          this.detailInfo = res.data.data;
          this.detailTableData = res.data.data.alarmProgressLogList;
          this.detailOpen = true;
          this.title = "告警详情";
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
    // 新增的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.userName = this.form.updateBy.split(",")[0];
          this.form.userCode = Number(this.form.updateBy.split(",")[1]);
          this.updateInfo.alarmProgressLog = this.form;
          this.$request.alarmUpdate(this.updateInfo).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("处理成功");
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
        handleTime: undefined,
        updateBy: undefined,
        handleDesc: undefined,
        userCode: undefined,
        userName: undefined,
      };
    },

    // 导出
    excelImport() {},
    //获取列表
    getList() {
      this.loading = true;
      this.$request.alarmFindQuery(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
      });
    },

    // 删除
    handleDelete(row) {
      let that = this;
      let list = [];
      if (row) {
        list.push(row.id);
      }
      const id = list.length > 0 ? list : this.ids;
      this.$confirm("是否确认删除该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.alarmDelete(id).then(() => {
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
.static {
  background: #fff;
  padding: 40px 0;
  display: flex;
  justify-content: space-around;
  .static-item {
    //    background-image: linear-gradient(to right,#54ADFF, #66CEF9);
    img {
      display: inline-block;
      width: 80px;
      height: 80px;
    }
    div {
      vertical-align: top;
      display: inline-block;
      margin-left: 18px;
      p {
        font-size: 16px;
        color: #999999;
        margin-bottom: 12px;
      }
      span {
        font-size: 32px;
        color: #333333;
      }
    }
  }
}
.operation {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
// /deep/.el-form-item__content .el-input__inner{
//   width: 70%  !important;
// }
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
</style>