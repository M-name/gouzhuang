<template>
  <div class="contant">
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
              >新增</el-button
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
      <div class="table">
        <el-table
          :header-cell-style="{ background: '#F4F4F4' }"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            v-for="(item, index) in column"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
            <template slot-scope="scope">
              <el-switch
                v-if="item.type === 'switch'"
                v-model="scope.row.subscribeStatus"
                :active-value="0"
                :inactive-value="1"
                @change="changeSwitch(scope.row)"
              />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                class="delet"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加或修改字典值 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="告警类型：" prop="alarmMainCode">
          <el-select v-model="form.alarmMainCode" placeholder="请选择">
            <el-option
              v-for="item in parentAlarm"
              :key="item.alarmTypeCode"
              :label="item.alarmTypeName"
              :value="item.alarmTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警子类型：" prop="alarmTypeCode">
          <el-select v-model="form.alarmTypeCode" placeholder="请选择">
            <el-option
              v-for="item in childAlarm"
              :key="item.alarmTypeCode"
              :label="item.alarmTypeName"
              :value="item.alarmTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅人：" prop="updateBy">
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
        <el-form-item label="通知渠道:" prop="notifyChannelIds">
          <el-checkbox-group v-model="form.notifyChannelIds">
            <el-checkbox
              v-for="(item, index) in dictLists.templateChannelEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-checkbox
            >
          </el-checkbox-group>
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
  name: "filterTable",
  data() {
    return {
      dictLists: {},
      // 工作人员列表
      staffList: [],
      //加载状态
      loading: false,
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
          prop: "userName",
          label: "订阅人",
        },
      ],
      //表格操作列内容
      tableOperations: [
        // {
        //   label: "修改",
        //   icon: "el-icon-edit",
        //   handler: (row) => this.handleUpdate(row),
        // },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
      ],
      // 表格参数
      tableOptions: {
        border: false, //边框
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 告警类型数据
      parentAlarm: [],
      childAlarm: [],
      //表格列
      column: [
        { prop: "alarmMain", label: "告警类型", widht: "180" },
        { prop: "alarmType", label: "告警类型子类型" },
        { prop: "userName", label: "订阅人" }, //
        { prop: "subscribeTime", label: "订阅时间" },
        { prop: "subscribeStatus", label: "订阅状态", type: "switch" }, //
        { prop: "notifyChannelIds", label: "通知方式" }, //
      ],
      ids: [],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        alarmTypeCode: [
          {
            required: true,
            message: "告警子类型未选择",
            trigger: "blur",
          },
        ],
        alarmMainCode: [
          {
            required: true,
            message: "告警类型未选择",
            trigger: "blur",
          },
        ],
        updateBy: [
          {
            required: true,
            message: "订阅人未选择",
            trigger: "blur",
          },
        ],
        notifyChannelIds: [
          {
            required: true,
            message: "通知渠道未选择",
            trigger: "blur",
          },
        ],
      },
      multiple: true,
      // 查询或请求参数
      params: {
        alarmMainCode: undefined,
        alarmSubCode: undefined,
        userName: undefined,
        page: 1,
        pageSize: 20,
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
    "form.alarmMainCode": {
      handler(newName, oldName) {
        if (newName) {
          this.childAlarm = [];
          this.$request.alarmTypeDictFindSubCode(newName).then((res) => {
            this.childAlarm = res.data.data;
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$request.alarmTypeSubscribeGetEnum().then((res) => {
      this.dictLists = res.data.data;
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
    this.$request.alarmTypeDictFindSubCode("00").then((res) => {
      this.parentAlarm = res.data.data;
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
    // 修改条数的监听
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    // 修改页数的监听
    handleCurrentChange(val) {
      this.s.page = val;
      this.getList();
    },
    // 开启/取消订阅
    changeSwitch(row) {
      this.$request
        .alarmTypeSubscribeUpdate({
          id: row.id,
          subscribeStatus: row.subscribeStatus,
        })
        .then((res) => {});
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      console.log(selection);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        alarmMainCode: undefined,
        alarmSubCode: undefined,
        userName: undefined,
        page: 1,
        pageSize: 20,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      const id = row.alarmTypeCode;
      this.$request.alarmTypeDictFindOne(id).then((res) => {
        this.form = res.data.data;
        this.open = true;
        this.title = "修改告警类型";
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
          this.form.updateBy = undefined;
          this.form.notifyChannelIds = this.form.notifyChannelIds.toString();
          this.$request.alarmTypeSubscribeAdd(this.form).then((res) => {
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
      });
    },
    // 表单重置
    reset() {
      this.form = {
        alarmMainCode: undefined,
        alarmSubCode: undefined,
        updateBy: undefined,
        notifyChannelIds: [],
        userName: undefined,
        userCode: undefined,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增告警类型";
    },
    //获取区域列表
    getList() {
      this.loading = true;
      this.$request.alarmTypeSubscribeFindQuery(this.params).then((res) => {
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
      this.$confirm("是否确认删除选中的告警类型?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.alarmTypeDictDelete(id).then(() => {
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
.delet {
  color: #f56c6c;
}
.pagination {
  text-align: center;
  margin-top: 34px;
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
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>
