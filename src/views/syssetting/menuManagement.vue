<template>
  <div class="contant">
    <el-tabs v-model="activeName">
      <el-tab-pane label="智慧物业PC端" name="pc">
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
            @selection-change="wxhandleSelectionChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="智慧物业小程序" name="wx">
        <div style="padding-right: 20px; background: #fff">
          <CommonSearch
            @resetQuery="resetQuery"
            @handleQuery="handleQuery"
            :queryParams.sync="wxparams"
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
                  :disabled="wxmultiple"
                  @click="handleDelete()"
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </div>
          <CommonTable
            :total="wxtotal"
            :loading="wxloading"
            :defColumns="column"
            @pagination="wxgetList"
            :dataList="wxtableData"
            :options="tableOptions"
            :page.sync="wxparams.page"
            :limit.sync="wxparams.pageSize"
            :operations="tableOperations"
            @selection-change="handleSelectionChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加或修改字典值 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
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
      activeName: "pc",
      //加载状态
      loading: false,
      wxloading: false,
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
          label: "查看子菜单",
          icon: "iconfont icon-submenu",
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
        { prop: "menuCode", label: "菜单编码", widht: "180" },
        { prop: "menuName", label: "菜单名称" },
        { prop: "iconName", label: "菜单图标" },
        { prop: "menuRoute", label: "菜单路由" }, //
        { prop: "displayOrder", label: "显示顺序" },
        { prop: "createTime", label: "创建时间" }, //
        { prop: "createBy", label: "创建员工" }, //
      ],
      ids: [],
      wxids: [],
      // 表格参数
      tableData: [],
      wxtableData: [],
      // 总条数
      total: 0,
      wxtotal: 0,
      // 表单参数
      form: {},
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
      multiple: true,
      wxmultiple: true,
      // 查询或请求参数
      params: {
        menuName: undefined,
        page: 1,
        menuType: 0,
        pageSize: 20,
      },
      wxparams: {
        menuName: undefined,
        page: 1,
        menuType: 1,
        pageSize: 20,
      },
    };
  },
  mounted() {
    this.getList();
    this.wxgetList();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    wxhandleSelectionChange(selection) {
      this.wxids = selection.map((item) => item.id);
      this.wxmultiple = !selection.length;
    },
    // /** 搜索按钮操作 */
    handleQuery() {
      if (this.activeName == "pc") {
        this.params.page = 1;
        this.getList();
      } else {
        this.wxparams.page = 1;
        this.wxgetList();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.activeName == "pc") {
        this.params = {
          menuName: undefined,
          page: 1,
          menuType: 0,
          pageSize: 20,
        };
      } else {
        this.wxparams = {
          menuName: undefined,
          page: 1,
          menuType: 1,
          pageSize: 20,
        };
      }

      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      this.$request.roleFindMenu(row.id).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改菜单";
        } else {
          that.$message.error(res.data.msg);
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
          if (this.activeName == "pc") {
            this.form.menuType = 0;
          } else {
            this.form.menuType = 1;
          }
          if (this.form.createTime) {
            this.$request.roleMenuUpdate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                if (this.activeName == "pc") {
                  this.getList();
                } else {
                  this.wxgetList();
                }
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
                if (this.activeName == "pc") {
                  this.getList();
                } else {
                  this.wxgetList();
                }
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
        menuType: undefined,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增菜单";
    },
    //获取pc菜单列表
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
    //获取微信小程序菜单列表
    wxgetList() {
      this.wxloading = true;
      this.$request.roleMenuList(this.wxparams).then((res) => {
        if (res.data.status == 200) {
          this.wxtableData = res.data.data.rows;
          this.wxtotal = res.data.data.records;
          this.wxparams.page = res.data.data.page;
          this.wxloading = false;
        } else {
          this.$message.error(res.data.msg);
          this.wxloading = false;
        }
      });
    },

    //查看二级的跳转
    handleEdit(row) {
      if (this.activeName == "pc") {
        this.$router.push({
          path: "/pcSecondMenu",
          name: "pcSecondMenu",
          params: {
            code: row.menuCode,
            name: row.menuName,
          },
        });
      } else {
        this.$router.push({
          path: "/wxSecondMenu",
          name: "wxSecondMenu",
          params: {
            code: row.menuCode,
            name: row.menuName,
          },
        });
      }
    },

    // 删除
    handleDelete(row) {
      let that = this;
      let list = [];
      let id = [];
      if (row) {
        list.push(row.id);
      }
      if (this.activeName == "pc") {
        id = list.length > 0 ? list : this.ids;
      } else {
        id = list.length > 0 ? list : this.wxids;
      }

      this.$confirm("是否确认删除选中的菜单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.roleDelMenu(id).then((res) => {
            if (res.data.status == 200) {
              if (that.activeName == "pc") {
                that.getList();
              } else {
                that.wxgetList();
              }

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
.contant {
  background: #fff;
  padding-left: 20px;
  padding-top: 10px;
}
.pagination {
  text-align: center;
  margin-top: 34px;
}
.operation {
  background: #fff;
  padding: 0 20px 20px 0;
}
.button {
  height: 50px;
  line-height: 50px;
}
.common-search {
  padding-bottom: 0px;
  padding-left: 0px;
}
/deep/.el-dialog__body{
  padding: 30px 20px  30px 10px;
}
</style>
