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
    <!-- 添加或修改字典值 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="告警类型编码：" prop="alarmTypeCode">
          <el-input
            v-model="form.alarmTypeCode"
            placeholder="请输入告警类型编码"
          />
        </el-form-item>
        <el-form-item label="告警类型名称：" prop="alarmTypeName">
          <el-input
            v-model="form.alarmTypeName"
            placeholder="请输入告警类型名称"
          />
        </el-form-item>
        <el-form-item label="告警类型级别：" prop="alarmRank">
          <el-input-number
            v-model="form.alarmRank"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="显示顺序：" prop="displayOrder">
          <el-input-number
            v-model="form.displayOrder"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="告警类型描述：" prop="alarmTypeDesc">
          <el-input
            v-model="form.alarmTypeDesc"
            placeholder="请输入告警类型描述"
          />
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
      //加载状态
      loading: false,
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "alarmTypeCode",
          label: "告警类型编码",
        },
        {
          prop: "alarmTypeName",
          label: "告警类型名称",
        },
      ],
      //表格操作列内容
      tableOperations: [
        {
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleEdit(row),
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
      //表格列
      column: [
        { prop: "alarmTypeCode", label: "告警类型编码", widht: "180" },
        { prop: "alarmTypeName", label: "告警类型名称" },
        { prop: "alarmTypeDesc", label: "告警类型说明" }, //
        { prop: "displayOrder", label: "显示顺序" },
        { prop: "createTime", label: "创建时间" }, //
        { prop: "createBy", label: "创建员工" }, //
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
            message: "告警类型编码不能为空",
            trigger: "change",
          },
        ],
        alarmTypeName: [
          {
            required: true,
            message: "告警类型名称不能为空",
            trigger: "change",
          },
        ],
        alarmRank: [
          {
            required: true,
            message: "告警类型级别不能为空",
            trigger: "change",
          },
        ],
      },
      // 非多个禁用
      multiple: true,
      // 查询或请求参数
      params: {
        alarmTypeName: undefined,
        alarmTypeCode: undefined,
        page: 1,
        parentCode: "00",
        pageSize: 20,
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
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
        alarmTypeName: undefined,
        alarmTypeCode: undefined,
        page: 1,
        parentCode: "00",
        pageSize: 20,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      const id = row.alarmTypeCode;
      this.$request.alarmTypeDictFindOne(id).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改告警类型";
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
          if (this.form.createTime) {
            this.$request.alarmTypeDictUpdate(this.form).then((res) => {
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
            this.$request.alarmTypeDictAddDict(this.form).then((res) => {
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
    // 表单重置
    reset() {
      this.form = {
        alarmTypeCode: "",
        alarmTypeName: "",
        alarmRank: 1,
        alarmTypeDesc: "",
        displayOrder: 0,
        parentCode: "00",
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
      this.$request.alarmTypeDictFindQuery(this.params).then((res) => {
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

    //查看二级的跳转
    handleEdit(row) {
      this.$router.push({
        path: "/emergencySecendDict",
        name: "emergencySecendDict",
        params: {
          code: row.alarmTypeCode,
          name: row.alarmTypeName,
        },
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
          that.$request.alarmTypeDictDelete(id).then((res) => {
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
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>
