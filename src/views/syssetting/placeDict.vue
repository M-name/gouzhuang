<template>
  <div class="contant">
    <div class="search">
      <el-input
        size="small"
        style="display: inline-block; width: 270px"
        placeholder="请输入字典名"
        prefix-icon="el-icon-search"
        v-model="params.areaName"
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
        :total="total"
        :loading="loading"
        :defColumns="column"
        :dataList="tableData"
        @pagination="getList"
        :options="tableOptions"
        :page.sync="params.page"
        :limit.sync="params.pageSize"
        :operations="tableOperations"
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
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
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
  </div>
</template>

<script>
export default {
  name: "filterTable",
  data() {
    return {
      loading: false,
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
        multiSelect: false, //多选框
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "areaCode", label: "区域编码", widht: "180" },
        { prop: "areaName", label: "区域名称" },
        { prop: "displayOrder", label: "显示顺序" },
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
        areaCode: [
          { required: true, message: "字典编码不能为空", trigger: "change" },
        ],
        areaName: [
          { required: true, message: "字典名称不能为空", trigger: "change" },
        ],
        displayOrder: [
          { required: true, message: "当前状态不能为空", trigger: "change" },
        ],
      },
      // 查询或请求参数
      params: {
        areaName: "",
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
        areaName: "",
        page: 1,
        pageSize: 20,
      };
      this.getList();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      this.$request.findPlaceDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改区域";
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
            this.$request.updatePlaceDict(this.form).then((res) => {
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
            this.$request.createProvince(this.form).then((res) => {
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
        areaCode: "",
        areaName: "",
        areaLevel: 0,
        displayOrder: 0,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增区域";
    },
    //获取区域列表
    getList() {
      this.loading = true;
      this.$request.allProvince(this.params).then((res) => {
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

    // 条数的监听
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    // 页数的监听
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },

    //查看二级的跳转
    handleEdit(row) {
      this.$router.push({
        path: "/secondPlace",
        name: "secondPlace",
        params: {
          code: row.areaCode,
        },
      });
    },

    // 删除
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该区域?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.delProvince(row.id).then((res) => {
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
