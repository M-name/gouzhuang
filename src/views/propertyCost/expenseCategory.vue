<template>
  <div class="contant">
    <div class="search">
      <el-select
        style="display: inline-block; width: 270px"
        v-model="params.feeCode"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in feeDictFirst"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
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
      >
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
              v-model="scope.row.isUsing"
              :active-value="1"
              :inactive-value="0"
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
              icon="el-icon-tickets"
              @click="handleEdit(scope.$index, scope.row)"
              >查看</el-button
            >
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
        <el-form-item label="费用编码" prop="feeCode">
          <el-input v-model="form.feeCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="费用类别" prop="feeName">
          <el-input v-model="form.feeName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="费用说明" prop="feeContent">
          <el-input v-model="form.feeContent" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number
            v-model="form.displayOrder"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUsing">
          <el-switch
            v-model="form.isUsing"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
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
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "feeCode", label: "费用编码", widht: "180" },
        { prop: "feeName", label: "费用类别" },
        { prop: "feeContent", label: "费用说明" },
        { prop: "displayOrder", label: "显示顺序" },
        { prop: "isUsing", label: "是否启用", type: "switch" },
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
        feeCode: [
          { required: true, message: "费用编码不能为空", trigger: "change" },
        ],
        feeName: [
          { required: true, message: "费用类别不能为空", trigger: "change" },
        ],
        displayOrder: [
          { required: true, message: "显示顺序不能为空", trigger: "change" },
        ],
      },
      //费用字典（一级）
      feeDictFirst: [],
      // 查询或请求参数
      params: {
        feeCode: "",
        page: 1,
        pageSize: 20,
      },
    };
  },
  mounted() {
    //获取费用字典
    this.$request.feeFindEnum().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < lists.feeDictFirstEnum.length; i++) {
        let arr = {};
        arr.value = lists.feeDictFirstEnum[i].feeCode;
        arr.label = lists.feeDictFirstEnum[i].feeName;
        role.push(arr);
      }
      this.feeDictFirst = role;
      console.log(this.feeDictFirst);
    });
    this.getList();
  },
  methods: {
    //重置
    resetQuery() {
      this.params = {
        feeCode: "",
        page: 1,
        pageSize: 20,
      };
      this.getList();
    },
    // 表格单个禁用
    changeSwitch(row) {
      this.$request.feeUpdate(row).then((res) => {
        // if (res.data.status === 200) {
        //   this.msgSuccess("修改成功");
        //   this.open = false;
        //   this.getList();
        //   this.$refs.form.resetFields();
        // }
      });
    },
    // 修改按钮
    handleUpdata(index, row) {
      this.reset();
      const id = row.id;
      this.$request.feeFind(id).then((res) => {
        this.form = res.data.data;
        this.open = true;
        this.title = "修改字典值";
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
            this.$request.feeUpdate(this.form).then((res) => {
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
            this.$request.feeCreateFirst(this.form).then((res) => {
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
        feeCode: "",
        feeName: "",
        feeContent: "",
        displayOrder: 0,
        isUsing: 1,
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
      this.$request.feeAllFirst(this.params).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
        } else {
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
      this.s.page = val;
      this.getList();
    },

    //查看二级的跳转
    handleEdit(index, row) {
      this.$router.push({
        path: "/expenseDetail",
        name: "expenseDetail",
        params: {
          code: row.feeCode,
          name: row.feeName,
        },
      });
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
          that.$request.feeDelFirst(row.id).then((res) => {
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

<style scoped lang="scss">
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

/deep/.el-input__inner {
  height: 32px;
}
/deep/.el-input__icon {
  height: 115%;
}
.searchs {
  width: 78px;
  height: 32px;
  font-size: 14px;
  background: #1790fd;
  color: #fff;
  border-radius: 4px;
}
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>
