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
      <!-- <div class="button">
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
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="single"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
        </el-row>
      </div> -->
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
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
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
      //表格操作列内容
      tableOperations: [
        //    {
        //      label: "查看",
        //      icon: "el-icon-edit",
        //      handler: (row) => this.handleEdit(row),
        //    },
        // {
        //   label: "修改",
        //   icon: "el-icon-edit",
        //   handler: (row) => this.handleUpdate(row),
        // },
        //    {
        //      label: "删除",
        //      style: { color: "#F56C6C" },
        //      icon: "el-icon-delete",
        //      handler: (row) => this.handleDelete(row),
        //    },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "mobile", label: "手机号" },
        { prop: "email", label: "电子邮箱" },
        {
          prop: "roleCode",
          label: "用户角色",
          type: "select",
          options: [],
        },
        {
          prop: "userStatus",
          label: "用户状态",
          type: "select",
          options: [],
          optionValue: "value",
          optionLabel: "label",
        },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "mobile", label: "手机号" },
        { prop: "nickname", label: "昵称", widht: "180" },
        { prop: "email", label: "电子邮箱", widht: "180" },
        { prop: "roleCode", label: "用户角色" },
        { prop: "userStatus", label: "用户状态" },
        { prop: "createTime", label: "注册时间" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        mobile: undefined,
        realName: undefined,
        roleCode: undefined,
        userStatus: undefined,
      },
    };
  },
  created() {
    this.$request.findEnum().then((res) => {
      let role = [];
      let status = [];
      let lists = res.data.data;
      for (var i = 0; i < Object.keys(lists.roleMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.roleMap)[i];
        arr.label = lists.roleMap[Object.keys(lists.roleMap)[i]];
     //    console.log(arr);
        role.push(arr);
      }
      for (var i = 0; i < Object.keys(lists.userStatusMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.userStatusMap)[i];
        arr.label = lists.userStatusMap[Object.keys(lists.userStatusMap)[i]];
        status.push(arr);
      }
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "userStatus") {
          item.options = status;
        }
        if (item.type == "select" && item.prop == "roleCode") {
          item.options = role;
        }
      });
    });
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
        mobile: undefined,
        realName: undefined,
        roleCode: undefined,
        userStatus: undefined,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      //  const id = row.id || this.ids;
      const id = row.id;
      this.$request.deptFinDict(id).then((res) => {
        this.form = res.data.data;
        this.open = true;
        this.title = "修改角色";
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
              }
            });
          } else {
            this.$request.deptCreate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              }
            });
          }
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        deptCode: "",
        deptDesc: "",
        deptName: "",
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request
        .userAll(this.params)
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 删除
    handleDelete(row) {
      let that = this;
      console.log(this.ids[0]);
       //  const id = row.id || this.ids[0];
      this.$confirm("是否确认删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deptDelDict(row.id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
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
</style>
