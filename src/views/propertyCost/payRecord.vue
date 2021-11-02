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
              @click="importExcel"
              type="primary"
              icon="el-icon-upload2"
              size="mini"
              >导出支付记录</el-button
            >
            <el-button @click="statistics" type="primary" size="mini"
              >统计分析</el-button
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
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="接收退款用户：">
          <p>{{ form.refundTo }}</p>
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundAmount">
          <!-- <p>{{ form.refundAmount }}</p> -->
          <el-input v-model="form.refundAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="退款原因：" prop="refundReason">
          <el-input v-model="form.refundReason" placeholder="请输入退款原因" />
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
      // 表单参数
      form: {},
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
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
          label: "撤销订单",
          icon: "iconfont icon-backout",
          handler: (row) => this.handleDelete(row),
        },
        {
          label: "开具收据",
          icon: "iconfont icon-receipt",
          handler: (row) => this.writeReceipt(row),
          isShow: (row) => {
            return row.receiptStatus == 0 && row.tradeStatus == 1;
          },
        },
        {
          label: "收据查看",
          icon: "el-icon-tickets",
          handler: (row) => this.receiptCheak(row),
          isShow: (row) => {
            return row.receiptStatus == 2;
          },
        },
        {
          label: "退款",
          icon: "iconfont icon-refund",
          handler: (row) => this.refund(row),
          isShow: (row) => {
            return row.paymentStatus == 4 || row.tradeStatus == 1;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "uniformOrderCode", label: "订单编号" },
        { prop: "subOrderCodes", label: "子订单编号" },
        {
          prop: "tradeStatus",
          label: "交易状态",
          type: "select",
          options: [],
        },
        {
          prop: "paymentMethod",
          label: "支付方式",
          type: "select",
          options: [],
        },
        {
          prop: "receiptStatus",
          label: "收据状态",
          type: "select",
          options: [],
        },
        { prop: "receiptCode", label: "收据编码" },
        {
          prop: "times",
          label: "支付时间段",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "paidTime", label: "支付时间" },
        { prop: "uniformOrderCode", label: "统一订单编号" },
        { prop: "tradeNo", label: "流水号" },
        { prop: "paymentDetail", label: "支付描述" },
        {
          prop: "paymentMethod",
          label: "支付方式",
          formatter: (row, column, index) => {
            return this.selectDictLabel(
              this.dicList.payTypeEnum,
              row.paymentMethod
            );
          },
        },
        {
          prop: "tradeStatus",
          label: "交易状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(
              this.dicList.dealStatusEnum,
              row.tradeStatus
            );
          },
        },
        { prop: "payer", label: "支付人（账号）" },
        { prop: "amountPaid", label: "支付金额" },
        { prop: "paymentRemark", label: "支付备注" },
        {
          prop: "receiptStatus",
          label: "收据状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(
              this.dicList.receiptStatusEnum,
              row.receiptStatus
            );
          },
        },
        { prop: "receiptCode", label: "收据编码" },
      ],
      // 表单校验
      rules: {
        refundReason: [
          {
            required: true,
            message: "退款原因不能为空",
            trigger: "change",
          },
        ],
        refundAmount: [
          { required: true, message: "退款金额不能为空", trigger: "change" },
          this.$rules.plusNumber(undefined, "change"),
        ],
      },
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      dicList: [],
      backAmount:'',
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        receiptCode: undefined,
        receiptStatus: undefined,
        paymentMethod: undefined,
        tradeStatus: undefined,
        uniformOrderCode: undefined,
      },
    };
  },
  created() {
    this.$request.orderGetEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "paymentMethod") {
          this.dicList.payTypeEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "receiptStatus") {
          this.dicList.receiptStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "tradeStatus") {
          this.dicList.dealStatusEnum.map((res) => {
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
    // 表单重置
    reset() {
      this.form = {
        uniformOrderCode: undefined,
        refundReason: undefined,
        refundAmount: undefined,
        refundTo: undefined,
        paymentMethod: undefined,
      };
    },
    // 退款的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.form.refundAmount > this.backAmount) {
            this.$message.warning('退款金额不能大于支付金额');
            return
          }
          this.$request.createRefund(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("退款成功");
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).map((key) => {
        if (datas[key].type == "" + value) {
          actions.push(datas[key].value);
          return false;
        }
      });
      return actions.join("");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsCode);
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
      } else {
        this.params.startTime = undefined;
        this.params.endTime = undefined;
      }
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        receiptCode: undefined,
        receiptStatus: undefined,
        paymentMethod: undefined,
        tradeStatus: undefined,
        uniformOrderCode: undefined,
      };
      this.handleQuery();
    },

    //获取表格列表
    getList() {
      console.log(this.params);
      this.loading = true;
      this.$request.getPayment(this.params).then((res) => {
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
    // 撤销
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认撤销该支付记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.revocationPay(row.uniformOrderCode).then((res) => {
            if (res.data.status == 200) {
              that.getList();
              that.msgSuccess("撤销成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    // 退款
    refund(row) {
      this.reset();
      this.open = true;
      this.backAmount = row.amountPaid;
      this.form.uniformOrderCode = row.uniformOrderCode;
      this.form.refundTo = row.payer;
      this.form.refundAmount = row.amountPaid;
      this.form.paymentMethod = row.paymentMethod;
    },
    // 开具收据
    writeReceipt(row) {
      let that = this;
      this.$confirm("是否确认开具收据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.orderDownloadPdf(row.uniformOrderCode).then((res) => {
            if (res.data.status == 200) {
              that.getList();
              that.msgSuccess("开具成功");
              window.open(res.data.data);
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    //导出excel
    importExcel() {
      this.$request.orderPaymentDownloadExcel(this.params);
    },
    // 跳转统计分析页面
    statistics() {
      this.$router.push({
        path: "/payRecordDetail",
        name: "payRecordDetail",
      });
    },
    // 收据查看
    receiptCheak(row) {
      this.$request.orderDownloadPdf(row.uniformOrderCode).then((res) => {
        if (res.data.status == 200) {
          window.open(res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
