<template>
  <div class="contant">
    <div class="search">
      <el-input
        size="small"
        style="display: inline-block; width: 270px"
        placeholder="请输入名称"
        prefix-icon="el-icon-search"
        v-model="params.deptName"
      >
      </el-input>
      <el-button
        style="margin-left: 20px"
        @click="getList"
        class="searchs"
        icon="el-icon-search"
        size="small"
        type="primary"
        >搜索</el-button
      >
      <el-button
        style="margin-left: 10px"
        class="reset"
        @click="resetQuery"
        icon="el-icon-refresh"
        size="small"
        >重置</el-button
      >
      <el-button
        style="float: right"
        size="small"
        type="primary"
        @click="addList"
        icon="el-icon-circle-plus-outline"
        >新增</el-button
      >
    </div>
    <div class="table">
      <CommonTable
        :loading="loading"
        :defColumns="column"
        :dataList="tableData"
        :page.sync="params.page"
        :limit.sync="params.pageSize"
        :total="total"
        :options="tableOptions"
        :operations="tableOperations"
        @pagination="getList"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="部门编码" prop="deptCode">
          <el-input v-model="form.deptCode" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="部门说明" prop="deptDesc">
          <el-input v-model="form.deptDesc" placeholder="请输入部门说明" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" />
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
  name: "deptDict",
  data() {
    return {
      loading: false,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "deptCode", label: "部门编码", widht: "180" },
        { prop: "deptName", label: "部门名称" },
        { prop: "deptDesc", label: "部门说明" },
        { prop: "createTime", label: "创建时间" },
      ],
      // 表格参数
      tableOptions: {
        border: false, //边框
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
      // 表格数据
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptCode: [
          { required: true, message: "部门编码不能为空", trigger: "change" },
        ],
        deptDesc: [
          { required: true, message: "部门说明不能为空", trigger: "change" },
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "change" },
        ],
      },
      // 查询或请求参数
      params: {
        deptName: "",
        page: 1,
        pageSize: 20,
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //重置
    resetQuery() {
      this.params = {
        deptName: "",
        page: 1,
        pageSize: 20,
      };
      this.getList();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      let id = row.id;
      this.$request.deptFinDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改角色";
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
            this.$request.deptUpdateDict(this.form).then((res) => {
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
            this.$request.deptCreate(this.form).then((res) => {
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
        createBy: JSON.parse(localStorage.getItem("userInfo")).userCode,
        deptCode: "",
        deptDesc: "",
        deptName: "",
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加部门";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request
        .deptList(this.params)
        .then((res) => {
          if (res.data.status === 200) {
            this.loading = false;
            this.tableData = res.data.data.rows;
            this.total = res.data.data.records;
            this.params.page = res.data.data.page;
          } else {
            this.loading = false;
            this.$message.error(res.data.msg);
          }
        })
    },

    // 修改条数的监听
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    // 修改页数的监听
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },

    // 删除
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该部门?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deptDelDict(row.id).then((res) => {
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
.search {
  width: 100%;
  background: #fff;
  height: 50px;
}
.contant {
  background: #fff;
  padding: 32px 24px;
}
.delet {
  color: #f56c6c;
}
.pagination {
  text-align: center;
  margin-top: 34px;
}
.reset {
  width: 78px;
  height: 32px;
  font-size: 14px;
  background: #fff;
  color: #999;
  border-radius: 4px;
}
.searchs {
  width: 78px;
  height: 32px;
  font-size: 14px;
  background: #1790fd;
  color: #fff;
  border-radius: 4px;
}
/deep/.el-dialog__body{
  padding: 30px 30px  30px 10px;
}
</style>
