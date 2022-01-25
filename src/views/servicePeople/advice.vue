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
        <el-form-item label="问题:" prop="suggestTitle">
          <span>{{ form.suggestTitle }}</span>
        </el-form-item>
        <el-form-item label="日期:" prop="createTime">
          <span>{{ form.createTime }}</span>
        </el-form-item>
        <el-form-item label="图片:" prop="suggestImageCodes">
          <el-image
            style="width: 100px; height: 100px"
            :src="form.suggestImageCodesStr"
            :preview-src-list="[form.suggestImageCodesStr]"
          >
          </el-image>
          <!-- <img style="width: 100px" :src="form.suggestImageCodes" alt="" /> -->
          <!-- <span>{{form.suggestImageCodes}}</span> -->
        </el-form-item>

        <el-form-item label="问题描述" prop="suggestConten">
          <span>{{ form.suggestContent }}</span>
        </el-form-item>
        <el-form-item  label="处理描述" prop="feedbackContent">
          <el-input
            type="textarea"
            autosize
            :disabled="isCheak"
            v-model="form.feedbackContent"
            :placeholder="isCheak?form.suggesDetail.feedbackContent:'请输入处理描述'"
          />
        </el-form-item>
      </el-form>
      <div v-if="!isCheak" slot="footer" class="dialog-footer">
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
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        feedbackContent: [
          { required: true, message: "处理描述不能为空", trigger: "change" },
        ],
      },
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
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleEdit(row),
          isShow: (row) => {
            return row.suggestStatus != 0;
          },
        },
        {
          label: "处理",
          icon: "iconfont icon-accept",
          handler: (row) => this.handleUpdate(row),
          isShow: (row) => {
            return row.suggestStatus == 0;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: " 住户姓名" },
        { prop: "mobile", label: " 住户手机号" },
        {
          prop: "suggestTitle",
          label: "问题",
        },
        {
          prop: "times",
          label: "提交时间段",
          type: "datePicker",
        },
        {
          prop: "suggestStatus",
          label: "处理状态",
          type: "select",
          options: [
            { value: 0, label: "待处理" },
            { value: 1, label: "已处理" },
          ],
        },
      ],
      //表格列
      column: [
        {
          prop: "visitorName",
          label: "住户信息 ",
          render: (h, scope) => {
            return h("div", [scope.row.userName + "/ " + scope.row.mobile]);
          },
        },
        { prop: "suggestTitle", label: "问题" },
        { prop: "createTime", label: "提交日期" },
        { prop: "suggestImageCodesStr", label: "图片", type: "image" },
        {
          prop: "suggestStatus",
          label: "处理状态 ",
          formatter: (row, column, index) => {
            return row.suggestStatus == 0 ? "待处理" : "已处理";
          },
        },
      ],
      // 是否为查看
      isCheak: false,
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      loading: false,
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        suggestStatus: undefined,
        suggestTitle: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).map((key) => {
        if (datas[key].value == "" + value) {
          actions.push(datas[key].label);
          return false;
        }
      });
      return actions.join("");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
    },
    // 表单重置
    reset() {
      this.form = {
        suggestTitle: undefined,
        createTime: undefined,
        suggestImageCodes: undefined,
        suggestContent: undefined,
        feedbackContent: undefined,
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
        this.params.times = undefined;
      } else {
        this.params.startTime = undefined;
        this.params.endTime = undefined;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        suggestStatus: undefined,
        suggestTitle: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.suggestFindPage(this.params).then((res) => {
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
    // 查看
    handleEdit(row) {
      // this.reset();
      const id = row.suggestCode;
      this.$request.suggestFindOne(id).then((res) => {
        if (res.data.status == 200) {
          this.form =res.data.data;
          console.log(this.form.suggesDetail.feedbackContent)
          this.open = true;
          this.title = "查看";
          this.isCheak = true;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    handleUpdate(row) {
      this.reset();
      const id = row.suggestCode;
      this.$request.suggestFindOne(id).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.open = true;
          this.isCheak = false;
          this.title = "处理";
          console.log(this.form);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$request.dealReply(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("处理成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 修改取消
    cancel() {
      this.open = false;
      // this.reset();
      this.$refs.form.resetFields();
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
