<template>
  <div class="contant">
    <div class="search">
      <el-input
        size="small"
        style="display: inline-block; width: 270px"
        placeholder="请输入楼栋编码"
        prefix-icon="el-icon-search"
        v-model="params.buildingCode"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12"
            ><el-form-item label="楼幢" prop="blockNo">
              <el-input
                v-model="form.blockNo"
                placeholder="请输入楼幢"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="单元" prop="unitNo">
              <el-input
                v-model="form.unitNo"
                placeholder="请输入单元"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼层" prop="floorNo">
              <el-input
                v-model="form.floorNo"
                placeholder="请输入楼层"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="房间号" prop="roomNo">
              <el-input
                v-model="form.roomNo"
                placeholder="请输入房间号"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房屋面积(㎡)" prop="buildingArea">
              <el-input
                v-model="form.buildingArea"
                placeholder="请输入房屋面积"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="房间数" prop="roomNum">
              <el-input
                v-model="form.roomNum"
                placeholder="请输入房间数"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客餐厅数" prop="hallNum">
              <el-input
                v-model="form.hallNum"
                placeholder="请输入客餐厅数"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="厨房数量" prop="kitchenNum">
              <el-input
                v-model="form.kitchenNum"
                placeholder="请输入厨房数量"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="卫生间数" prop="washroomNum">
          <el-input v-model="form.washroomNum" placeholder="请输入卫生间数" />
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
  name: "addArticle",
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "buildingCode", label: "楼幢编码", widht: "180" },
        { prop: "blockNo", label: "幢" },
        { prop: "unitNo", label: "单元" },
        { prop: "floorNo", label: "楼层" },
        { prop: "roomNo", label: "房间号" },
        { prop: "buildingArea", label: "房屋面积", widht: "180" },
        { prop: "roomNum", label: "房间数" },
        { prop: "hallNum", label: "客餐厅数" },
        { prop: "kitchenNum", label: "厨房数量" },
        { prop: "washroomNum", label: "卫生间数" },
        { prop: "createTime", label: "创建时间" },
        { prop: "remark", label: "备注" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        buildingArea: [
          { required: true, message: "房屋面积不能为空", trigger: "change" },
          this.$rules.decimal(undefined, "change"),
        ],
        roomNum: [
          { required: true, message: "房间数不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        hallNum: [
          { required: true, message: "客餐厅数不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        kitchenNum: [
          { required: true, message: "厨房数量不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        washroomNum: [
          { required: true, message: "卫生间数不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        blockNo: [
          { required: true, message: "楼幢不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        unitNo: [
          { required: true, message: "单元不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        floorNo: [
          { required: true, message: "楼层不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        roomNo: [
          { required: true, message: "房间号不能为空", trigger: "change" },
          this.$rules.moreThanZeroNumber(undefined, "change"),
        ],
        displayOrder: [
          { required: true, message: "显示顺序不能为空", trigger: "change" },
        ],
      },
      // 查询或请求参数
      params: {
        buildingCode: "",
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
        buildingCode: "",
        page: 1,
        pageSize: 20,
      };
      this.getList();
    },
    // 修改按钮
    handleUpdata(index, row) {
      this.reset();
      const id = row.id;
      this.$request.houseFinDict(id).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改楼幢";
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
            this.$request.houseUpdateDict(this.form).then((res) => {
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
            this.$request.houseCreate(this.form).then((res) => {
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
        blockNo: "",
        unitNo: "",
        floorNo: "",
        roomNo: "",
        remark: "",
        buildingArea: "",
        roomNum: "",
        hallNum: "",
        kitchenNum: "",
        washroomNum: "",
        displayOrder: 0,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加楼幢";
    },
    //获取字典列表
    getList() {
      this.$request.houseList(this.params).then((res) => {
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
      this.params.page = val;
      this.getList();
    },

    // 删除
    handleDelete(index, row) {
      let that = this;
      this.$confirm("是否确认删除该楼幢?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.houseDelDict(row.id).then((res) => {
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
.searchs {
  width: 78px;
  height: 32px;
  font-size: 14px;
  background: #1790fd;
  color: #fff;
  border-radius: 4px;
}
/deep/.el-dialog__body {
  padding: 30px 40px 30px 10px;
}
</style>
