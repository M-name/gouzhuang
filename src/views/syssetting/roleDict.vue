<template>
  <div class="contant">
    <div class="search">
      <el-input
        size="small"
        style="display: inline-block; width: 270px"
        placeholder="请输入角色名称"
        prefix-icon="el-icon-search"
        v-model="params.roleName"
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
      <el-table
        :header-cell-style="{ background: '#F4F4F4' }"
        :data="tableData"
        v-loading="loading"
      >
        <el-table-column
          v-for="(item, index) in column"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :key="index"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="iconfont icon-change"
              @click="handleUpdata(scope.$index, scope.row)"
              >修改角色</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="iconfont icon-allot"
              @click="handleAllocation(scope.$index, scope.row)"
              >分配权限</el-button
            >
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
    <!-- 添加或修改字典值 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="请输入角色说明" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="displayOrder">
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
    <el-dialog
      :title="title"
      :visible.sync="allocationOpen"
      :before-close="allocationCancel"
      width="900px"
      append-to-body
    >
      <h3>物业系统PC端菜单</h3>
      <el-divider></el-divider>
      <div style="margin-top: 15px; width: 800px; margin-bottom: 40px">
        <tree-transfer
          v-loading="rolePcLoading"
          :title="treeTitle"
          :from_data="fromData"
          :to_data="toData"
          placeholder="请输入菜单名称进行过滤"
          :defaultProps="{ label: 'menuName', children: 'list' }"
          :mode="mode"
          height="400px"
          filter
          openAll
        >
        </tree-transfer>
      </div>
      <h3>微信小程序菜单</h3>
      <el-divider></el-divider>
      <div style="margin-top: 15px; width: 800px">
        <tree-transfer
          v-loading="roleWxLoading"
          :title="treeTitle"
          :from_data="wxfromData"
          :to_data="wxtoData"
          placeholder="请输入菜单名称进行过滤"
          :defaultProps="{ label: 'menuName', children: 'list' }"
          :mode="mode"
          height="400px"
          filter
          openAll
        >
        </tree-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allocationSubmitForm"
          >确 定</el-button
        >
        <el-button @click="allocationCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTransfer from "el-tree-transfer";
export default {
  name: "filterTable",
  components: {
    treeTransfer,
  },
  data() {
    return {
      rolePcLoading: false,
      roleWxLoading: false,
      loading: false,
      // 穿梭框格式
      mode: "transfer",
      // 穿梭框左右标题
      treeTitle: ["未选择菜单权限", "已选择菜单权限"],
      // pc穿梭框已选择列表
      toData: [],
      // pc穿梭框未选择列表（初始未全部列表）
      fromData: [],
      // wx穿梭框已选择列表
      wxtoData: [],
      // wx穿梭框未选择列表（初始未全部列表）
      wxfromData: [],
      // 是否显示弹出层
      open: false,
      allocationOpen: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "roleCode", label: "角色编码" },
        { prop: "roleName", label: "角色名称" },
        { prop: "roleDesc", label: "角色说明" },
        { prop: "createTime", label: "创建时间" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        roleCode: [
          { required: true, message: "角色编码不能为空", trigger: "change" },
        ],
        roleDesc: [
          { required: true, message: "角色说明不能为空", trigger: "change" },
        ],
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "change" },
        ],
        displayOrder: [
          { required: true, message: "显示顺序不能为空", trigger: "change" },
        ],
      },
      // 角色编码
      roleCode: "",
      // 查询或请求参数
      params: {
        roleName: "",
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
        roleName: "",
        page: 1,
        pageSize: 20,
      };
      this.getList();
    },
    // 修改按钮
    handleUpdata(index, row) {
      this.reset();
      const id = row.id;
      this.$request.roleFinDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改角色";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 页面权限分配按钮
    handleAllocation(index, row) {
      this.allocationOpen = true;
      this.roleCode = row.roleCode;
      this.title = "角色名称:" + row.roleName;
      this.rolePcLoading = true;
      this.roleWxLoading = true;
      this.$request
        .roleTreeMenu({ menuType: 0, roleCode: row.roleCode })
        .then((res) => {
          if (res.data.status === 200) {
            this.rolePcLoading = false;
            let lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              for (var j = 0; j < lists[i].list.length; j++) {
                lists[i].list[j].pid = lists[i].id;
              }
            }
            this.toData = lists;
          } else {
            this.rolePcLoading = false;
            this.$message.error(res.data.msg);
          }
        });
      this.$request
        .roleTreeMenu({ menuType: 1, roleCode: row.roleCode })
        .then((res) => {
          if (res.data.status === 200) {
            this.roleWxLoading = false;
            let lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              for (var j = 0; j < lists[i].list.length; j++) {
                lists[i].list[j].pid = lists[i].id;
              }
            }
            this.wxtoData = lists;
          } else {
            this.roleWxLoading = false;
            this.$message.error(res.data.msg);
          }
        });

      this.$request
        .roleNotMenu({ menuType: 0, roleCode: row.roleCode })
        .then((res) => {
          if (res.data.status === 200) {
            let lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              for (var j = 0; j < lists[i].list.length; j++) {
                lists[i].list[j].pid = lists[i].id;
              }
            }
            this.fromData = lists;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      this.$request
        .roleNotMenu({ menuType: 1, roleCode: row.roleCode })
        .then((res) => {
          if (res.data.status === 200) {
            let lists = res.data.data.list;
            for (var i = 0; i < lists.length; i++) {
              for (var j = 0; j < lists[i].list.length; j++) {
                lists[i].list[j].pid = lists[i].id;
              }
            }
            this.wxfromData = lists;
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
    allocationCancel() {
      this.allocationOpen = false;
      this.toData = [];
      this.fromData = [];
      this.wxtoData = [];
      this.wxfromData = [];
    },
    // 新增的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.createTime) {
            this.$request.roleUpdateDict(this.form).then((res) => {
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
            this.$request.roleCreate(this.form).then((res) => {
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
    allocationSubmitForm() {
      const list = this.wxtoData.concat(this.toData);
      this.$request
        .roleTreeCreate({ roleCode: this.roleCode, list: list })
        .then((res) => {
          if ((res.data.status = 200)) {
            this.allocationOpen = false;
            this.msgSuccess("分配成功");
            this.getList();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 表单重置
    reset() {
      this.form = {
        roleCode: "",
        roleDesc: "",
        roleName: "",
        displayOrder: 0,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加角色";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request.roleList(this.params).then((res) => {
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
    handleDelete(index, row) {
      let that = this;
      this.$confirm("是否确认删除该角色?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.roleDelDict(row.id).then((res) => {
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
.el-divider--horizontal {
  margin: 15px 0;
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
// /deep/.el-dialog__body{
//   padding: 30px 30px  30px 10px;
// }
</style>
