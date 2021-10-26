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
              >新增子消息类型</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <p class="parent-type">
              上级消息类型：<span>{{ parentType }}</span>
            </p>
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="子消息编码" prop="msgTypeCode">
          <el-input v-model="form.msgTypeCode" placeholder="请输入消息编码" />
        </el-form-item>
        <el-form-item
          label="子消息类型名称"
          prop="msgTypeName"
          label-width="130px"
        >
          <el-input
            v-model="form.msgTypeName"
            placeholder="请输入消息类型名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number
            v-model="form.displayOrder"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="子消息类型描述" prop="msgTypeDesc">
          <el-input
            v-model="form.msgTypeDesc"
            placeholder="请输入消息类型描述"
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
  name: "userControl",
  data() {
    return {
      // 父级类型
      parentType: "",
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
        { prop: "msgTypeCode", label: "子消息类型编码" },
        { prop: "msgTypeName", label: "子消息类型名称" },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "msgTypeCode", label: "子消息类型编码" },
        { prop: "msgTypeName", label: "子消息类型名称" },
        { prop: "msgTypeDesc", label: "子消息类型描述" },
        { prop: "displayOrder", label: "显示顺序" },
        { prop: "createTime", label: "创建时间" },
        { prop: "createBy", label: "创建员工" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        msgTypeName: [
          {
            required: true,
            message: "子消息类型名称不能为空",
            trigger: "change",
          },
        ],
        msgTypeCode: [
          {
            required: true,
            message: "子消息类型编码不能为空",
            trigger: "change",
          },
        ],
      },
      ids: [],
      parentId: undefined,
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        msgTypeCode: undefined,
        msgTypeName: undefined,
        parentCode: "",
      },
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("messageParentCode", this.$route.params.code);
      localStorage.setItem("messageParentType", this.$route.params.type);
      this.parentId = this.$route.params.code;
      this.params.parentCode = this.$route.params.code;
      this.parentType = this.$route.params.type;
    } else {
      this.parentId = localStorage.getItem("messageParentCode");
      this.params.parentCode = localStorage.getItem("messageParentCode");
      this.parentType = localStorage.getItem("messageParentType");
    }
    this.getList();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
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
        msgTypeCode: undefined,
        msgTypeName: undefined,
        parentCode: this.parentId,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      this.$request.msgDictFindDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改字典";
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
            this.$request.msgDictUpdateDict(this.form).then((res) => {
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
            this.$request.msgDictCreateSecond(this.form).then((res) => {
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
        msgTypeCode: "",
        msgTypeDesc: "",
        msgTypeName: "",
        parentCode: this.params.parentCode,
        displayOrder: 0,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加字典";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request.msgDictAllSecond(this.params).then((res) => {
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
      this.$confirm("是否确认删除该字典?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.msgDictDelSecond(row.id).then((res) => {
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
.parent-type {
  font-size: 15px;
  font-weight: bold;
  padding-left: 20px;
  span {
    font-weight: 500;
    color: #39a0fc;
  }
}
</style>
