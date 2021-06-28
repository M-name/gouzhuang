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
          <span style="margin-left: 10px"
            >上级菜单：<span style="color: #409eff">{{
              this.parentName
            }}</span></span
          >
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="父级菜单：">
          <el-input
            disabled
            v-model="parentName"
            placeholder="请输入菜单编码"
          />
        </el-form-item>
        <el-form-item label="菜单编码：" prop="menuCode">
          <el-input v-model="form.menuCode" placeholder="请输入菜单编码" />
        </el-form-item>
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标：" prop="iconName">
          <el-input v-model="form.iconName" placeholder="请输入菜单图标名称" />
        </el-form-item>
        <el-form-item label="菜单路由：" prop="menuRoute">
          <el-input v-model="form.menuRoute" placeholder="请输入菜单路由" />
        </el-form-item>
        <el-form-item label="显示顺序：" prop="displayOrder">
          <el-input-number
            v-model="form.displayOrder"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
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
      multiple: true,
      //加载状态
      loading: false,
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "menuName",
          label: "菜单名称",
        },
      ],
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
        { prop: "menuCode", label: "菜单编码", widht: "180" },
        { prop: "menuName", label: "菜单名称" },
        { prop: "iconName", label: "菜单图标" },
        { prop: "menuRoute", label: "菜单路由" }, //
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
      // 表单校验
      rules: {
        menuCode: [
          {
            required: true,
            message: "菜单编码不能为空",
            trigger: "blur",
          },
        ],
        menuName: [
          {
            required: true,
            message: "菜单名称不能为空",
            trigger: "blur",
          },
        ],
        menuRoute: [
          {
            required: true,
            message: "菜单路由不能为空",
            trigger: "blur",
          },
        ],
      },
      parentCode: "",
      parentName: "",
      // 查询或请求参数
      params: {
        menuType: 1,
        menuName: undefined,
        page: 1,
        parentCode: "",
        pageSize: 20,
      },
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("menuwxCode", this.$route.params.code);
      localStorage.setItem("menuwxName", this.$route.params.name);
      this.params.parentCode = this.$route.params.code;
      this.parentCode = this.$route.params.code;
      this.parentName = this.$route.params.name;
    } else {
      this.params.parentCode = localStorage.getItem("menuwxCode");
      this.parentCode = localStorage.getItem("menuwxCode");
      this.parentName = localStorage.getItem("menuwxName");
    }
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
        menuName: undefined,
        parentCode: "",
        menuType: 1,
        page: 1,
        pageSize: 20,
      };
      this.params.parentCode = this.parentCode;
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      this.$request.roleFindMenu(row.id).then((res) => {
        this.form = res.data.data;
        this.open = true;
        this.title = "修改菜单";
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
            this.$request.roleMenuUpdate(this.form).then((res) => {
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
            this.$request.roleMenuCreate(this.form).then((res) => {
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
        menuCode: undefined,
        menuName: undefined,
        iconName: undefined,
        menuRoute: undefined,
        displayOrder: 0,
        menuType: 1,
        parentCode: this.parentCode,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增菜单";
    },
    //获取pc页面路由列表
    getList() {
      this.loading = true;
      this.$request.roleMenuList(this.params).then((res) => {
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
      this.$confirm("是否确认删除选中的菜单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.roleDelMenu(id).then(() => {
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
/deep/.el-dialog__body{
  padding: 30px 20px  30px 10px;
}
</style>
