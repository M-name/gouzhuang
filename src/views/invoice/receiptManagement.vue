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
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
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
          label: "收据查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "收据作废",
          style: { color: "#F56C6C" },
         icon: "iconfont icon-cancel",
          handler: (row) => this.cancellation(row),
          isShow: (row) => {
            return row.receiptStatus != 2;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "receiptCode", label: "收据编码" },
        { prop: "uniformOrderCode", label: "统一订单编码" },
        {
          prop: "receiptStatus",
          label: "收据状态",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "开收据时间段",
          type: "datePicker",
        },
        { prop: "createBy", label: "办理员工" },
      ],
      //表格列
      column: [
        { prop: "receiptCode", label: "收据编码" },
        { prop: "uniformOrderCode", label: "统一订单编码", widht: "180" },
        { prop: "paymentTime", label: "支付日期", widht: "180" },
        { prop: "paidAmount", label: "支付金额" },
        { prop: "receiptStatusStr", label: "收据状态" },
        { prop: "receiptTime", label: "开具时间" },
        { prop: "paymentDetail", label: "支付描述" },
        { prop: "createTime", label: "办理时间" },
        { prop: "createBy", label: "办理员工" },
      ],
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
        receiptCode: undefined,
        uniformOrderCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        createBy: undefined,
      },
    };
  },
  created() {
    this.$request.orderGetEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "receiptStatus") {
          this.dicList.receiptStatusEnum.map((res) => {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
        // this.params.times = undefined;
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
        receiptCode: undefined,
        uniformOrderCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        createBy: undefined,
      };
      this.handleQuery();
    },
    // 查看按钮
    handleUpdate(row) {
      window.open(row.receiptUrl);
    },
    // 收据作废
    cancellation(row) {
        this.$prompt('请输入作废原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '作废作废原因不能为空'
        }).then(({ value }) => {
         this.$request.orderPaymentCancelled({id:row.id,remark:value}).then((res)=>{
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
    //获取列表
    getList() {
      this.loading = true;
      this.$request.receiptList(this.params).then((res) => {
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
      this.$request.downloadReceiptExcel(this.params);
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
