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
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="importExcel"
              >导出Excel文件</el-button
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
        <el-form-item label="发票编码：" prop="applyCode">
          <el-input v-model="form.applyCode" placeholder="请输入发票编码" />
        </el-form-item>
        <el-form-item label="开票时间：" prop="invoiceTime">
          <el-date-picker
            v-model="form.invoiceTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发票备注：" prop="invoiceRemark">
          <el-input v-model="form.invoiceRemark" placeholder="请输入发票备注" />
        </el-form-item>
        <el-form-item label="发票上传：" prop="invoiceUrl">
          <el-upload
            ref="uploadVadio"
            action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadVadioFile"
            :headers="header"
            :with-credentials="true"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
  name: "userControl",
  data() {
    return {
      // 上传请求头
      header: {
        "Content-Type": "multipart/form-data",
      },
      //加载状态
      loading: false,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "发票上传",
          icon: "iconfont icon-upload",
          handler: (row) => this.handleUpdate(row),
          isShow: (row) => {
            return !row.invoiceUrl;
          },
        },
        {
          label: "发票作废",
          style: { color: "#F56C6C" },
          icon: "iconfont icon-cancel",
          handler: (row) => this.cancellation(row),
          isShow: (row) => {
            return row.invoiceStatus != 2;
          },
        },
        {
          label: "发票查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleCheck(row),
          isShow: (row) => {
            return row.invoiceUrl;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: "申请人姓名" },
        { prop: "invoiceTitle", label: "发票抬头" },
        { prop: "creditCode", label: "统一社会信用代码" },
        {
          prop: "invoiceStatus",
          label: "开票状态",
          type: "select",
          options: [],
        },
        {
          prop: "openType",
          label: "开票类型",
          type: "select",
          options: [],
          optionValue: "value",
          optionLabel: "label",
        },
        {
          prop: "times",
          label: "开票时间段",
          type: "datePicker",
        },
      ],
      open: false,
      title: "",
      //表格列
      column: [
        { prop: "userName", label: "申请人姓名" },
        { prop: "applyTime", label: "申请时间", widht: "180" },
        { prop: "invoiceTitle", label: "发票抬头", widht: "180" },
        { prop: "creditCode", label: "统一社会信用代码" },
        { prop: "invoiceStatusStr", label: "开票状态" },
        { prop: "invoiceAmount", label: "开票金额" },
        { prop: "openTypeStr", label: "开票类型" },
        { prop: "invoiceTypeStr", label: "发票类型" },
        { prop: "bankName", label: "开户行名称" },
        { prop: "enterpriseAccount", label: "开户账号" },
        { prop: "enterpriseAddr", label: "注册场所地址" },
        { prop: "enterprisePhone", label: "注册固定电话" },
      ],
      // 表单校验
      rules: {
        applyCode: [
          { required: true, message: "发票编码不能为空", trigger: "change" },
        ],
        invoiceTime: [
          { required: true, message: "开票时间未选择", trigger: "change" },
        ],
      },
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        invoiceTitle: undefined,
        creditCode: undefined,
        invoiceStatus: undefined,
        openType: undefined,
        invoiceType: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    this.$request.invoiceGetEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "invoiceStatus") {
          this.dicList.invoiceStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "openType") {
          this.dicList.invoiceTypeEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.getList();
  },
  methods: {
    // 查看发票
    handleCheck(row) {
      window.open(row.invoiceUrl)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 发票提交
    submitForm() {
      let that = this;
      console.log(this.form);
      if (!this.form.invoiceUrl) {
        this.$message.error("未上传文件");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$request.invoiceCreate(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("上传成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 表单重置
    reset(val) {
      this.form = {
        applyCode: undefined,
        invoiceTime: undefined,
        invoiceRemark: undefined,
        invoiceUrl: undefined,
        id:undefined,
      };
    },
    //上传发票
    uploadVadioFile(param) {
      var form = new FormData();
      // 文件对象
      console.log(param);
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        if (this.form.invoiceUrl != undefined) {
          this.form.invoiceUrl =
            this.form.invoiceUrl + "," + res.data.data.split(",")[1];
        } else {
          this.form.invoiceUrl = res.data.data.split(",")[1];
        }
      });
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
        invoiceTitle: undefined,
        creditCode: undefined,
        invoiceStatus: undefined,
        openType: undefined,
        invoiceType: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 发票作废
    cancellation(row) {
        this.$prompt('请输入作废原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '作废作废原因不能为空'
        }).then(({ value }) => {
         this.$request.invoiceCancelled({id:row.id,remark:value}).then((res)=>{
           if(res.data.status == 200) {
             this.$message.success('提交作废成功')
              this.getList();
           }else{
             this.$message.error(res.data.msg)
           }
         })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消作废'
          });
        });
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      this.form.id = row.id;
      this.open = true;
      this.title = "发票上传";
    },

    //获取列表
    getList() {
      this.loading = true;
      this.$request.invoiceApplylist(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    // 导出
    importExcel() {   
      this.$request.downloadInvoiceExcel(this.params);
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
