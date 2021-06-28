<template>
  <div class="contant">
    <div class="search">
      <el-input
        size="small"
        style="display: inline-block; width: 270px"
        placeholder="请输入字典名"
        prefix-icon="el-icon-search"
        v-model="params.dictName"
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdata(scope.$index, scope.row)"
              >修改</el-button
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
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="form.dictCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number
            v-model="form.displayOrder"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
      loading: false,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "dictName", label: "二级字典名称", widht: "180" },
        { prop: "dictCode", label: "二级字典编号" },
        { prop: "remark", label: "备注" },
        { prop: "createTime", label: "创建时间" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      //上级code
      code: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictCode: [
          { required: true, message: "字典编码不能为空", trigger: "change" },
        ],
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "change" },
        ],
        displayOrder: [
          { required: true, message: "当前状态不能为空", trigger: "change" },
        ],
      },
      // 查询或请求参数
      params: {
        dictName: "",
        page: 1,
        pageSize: 20,
        parentCode: "",
      },
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("allCode", this.$route.params.code);
      this.params.parentCode = this.$route.params.code;
      this.code = this.$route.params.code;
    } else {
      this.params.parentCode = localStorage.getItem("allCode");
      this.code = localStorage.getItem("allCode");
    }
    this.getList();
  },
  methods: {
    //重置
    resetQuery() {
      this.params = {
        dictName: "",
        page: 1,
        parentCode: this.code,
      };
      this.getList();
    },
    // 修改按钮
    handleUpdata(index, row) {
      this.reset();
      const id = row.id;
      this.$request.findDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改字典值";
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
            this.$request.updateDict(this.form).then((res) => {
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
            this.$request.createSecond(this.form).then((res) => {
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
        dictCode: "",
        dictName: "",
        parentCode: this.params.parentCode,
        displayOrder: 0,
        remark: "",
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加字典值";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request.allSecond(this.params).then((res) => {
        if (res.data.status === 200) {
          this.loading = false;
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
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
      this.$confirm("是否确认删除该字典值?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.delSecond(row.id).then((res) => {
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
