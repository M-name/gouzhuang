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
              icon="el-icon-circle-plus-outline"
              size="mini"
              :disabled="multiple"
              @click="addList"
              >选中收费</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="importExcel"
              >导出账单Excel</el-button
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
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="支付详情:" prop="paymentDetail">
          <el-input
            disabled
            v-model="form.paymentDetail"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="支付金额:" prop="amountPaid">
          <el-input disabled v-model="form.amountPaid" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-radio-group @change="payChange" v-model="radio">
            <el-radio label="BARCODE_PAY">条码支付</el-radio>
            <el-radio label="TRANSFER">转账</el-radio>
            <el-radio label="CASH">现金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缴费人:">
          <el-radio-group @change="peopleChange" v-model="peopleRadio">
            <el-radio label="USER">户主本人</el-radio>
            <el-radio label="OTHER">非户主本人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="radio == 'BARCODE_PAY'"
          label="条形码:"
          prop="authCode"
        >
          <el-input
            :disabled="form.authCode"
            ref="input"
            v-model="form.authCode"
            placeholder="请输入条形码"
          />
        </el-form-item>
        <el-form-item
          v-if="peopleRadio == 'OTHER'"
          label="支付住户:"
          prop="payer"
        >
          <el-input
            class="elinput"
            disabled
            v-model="form.payer"
            placeholder="请输入住户姓名"
          />
          <el-button class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item label="支付备注:" prop="paymentRemark">
          <el-input v-model="form.paymentRemark" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="!form.authCode && radio == 'BARCODE_PAY'"
          type="primary"
          @click="submitForm"
          >支 付</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="tipOpen"
      width="500px"
      append-to-body
    >
      <el-form label-width="120px">
        <el-form-item label="提示:"
          ><span
            >订单支付错误请在<span style="color: #fead3f">15分钟</span
            >后前往撤销</span
          ></el-form-item
        >
        <el-form-item label="订单编号:"
          ><span style="color: #fe6768">{{
            form.uniformOrderCode ? form.uniformOrderCode : ""
          }}</span></el-form-item
        >
      </el-form>
    </el-dialog>
    <el-dialog title="所有人选择" width="800px" :visible.sync="chooseShow">
      <div style="margin-top: -20px">
        <CommonSearch
          @resetQuery="chooseResetQuery"
          @handleQuery="chooseHandleQuery"
          :queryParams.sync="chooseParams"
          :searchList="chooseSearchList"
        />
      </div>
      <CommonTable
        :total="chooseTotal"
        :loading="chooseLoading"
        :tooltipShow="true"
        :defColumns="chooseColumn"
        @pagination="chooseGetList"
        :dataList="chooseTableData"
        :options="chooseTableOptions"
        :page.sync="chooseParams.page"
        :limit.sync="chooseParams.pageSize"
        :operations="chooseTableOperations"
      />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      chooseShow: false,
      radio: "BARCODE_PAY",
      peopleRadio: "USER",
      // 表单参数
      form: {},
      code: "",
      // 是否显示弹出层
      open: false,
      tipOpen: false,
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
      chooseLoading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      billList: [],
      // 新闻状态字典
      publishStatusMap: [],
      rules: {
        payer: [{ required: true, message: "支付住户未选择", trigger: "blur" }],
      },
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      chooseTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
        border: false, // 边框
      },
      //表格操作列内容
      chooseTableOperations: [
        {
          label: "选择",
          icon: "el-icon-edit",
          handler: (row) => this.choose(row),
        },
      ],
      //表格操作列内容
      tableOperations: [
        {
          label: "删除",
          icon: "el-icon-delete",
          style: { color: "#F56C6C" },
          handler: (row) => this.handleDelete(row),
          isShow: (row) => {
            return row.paymentStatus == 3;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: "住户姓名" },
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "parkingCode", label: "车位编码" },
        {
          prop: "paymentStatus",
          label: "账单状态",
          type: "select",
          options: [
            { value: 3, label: "待支付" },
            { value: 4, label: "已支付" },
          ],
        },
        {
          prop: "feeName",
          label: "费用类别",
          type: "select",
          options: [],
        },
        { prop: "orderYear", label: "账单年度" },
        {
          prop: "times",
          label: "支付时间段",
          type: "datePicker",
        },
        // { prop: "orderYear", label: "账单年度" },
      ],
      chooseSearchList: [
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "身份证号" },
        { prop: "mobile", label: "电话号码" },
        { prop: "hao", label: "门禁号" },
        {
          prop: "liveType",
          label: "证件类型",
          type: "select",
          options: [],
        },
        {
          prop: "liveStatus",
          label: "居住状态",
          type: "select",
          options: [],
        },
        {
          prop: "liveTypeId",
          label: "住户类型",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "orderYear", label: "账单年度" },
        {
          prop: "serviceEndTime",
          label: "账单周期",
          render: (h, scope) => {
            return h("div", [
              scope.row.serviceStartTime + "~" + scope.row.serviceEndTime,
            ]);
          },
        },
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "buildingArea", label: "房屋面积(m²)", width: "160" },
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "feeName", label: "费用名称" },
        { prop: "orderAmount", label: "应支付(元)" },
        { prop: "discountAmount", label: "优惠金额(元)" },
        { prop: "paidAmount", label: "实际已付(元)" },
        {
          prop: "paymentStatus",
          label: "账单状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(this.payDict, row.paymentStatus);
          },
        },
        { prop: "createTime", label: "生成日期" },
      ],
      //用户选择表格列
      chooseColumn: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
      // 账单状态
      payDict: [],
      // 表格参数
      tableData: [],
      //用户选择表格数据
      chooseTableData: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      dicList: [],
      userInfo: { name: "", code: "" },
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        paymentStatus: undefined,
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        parkingCode: undefined,
        orderYear: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
      // 用户查询或请求参数
      chooseParams: {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      },
    };
  },
  created() {
    this.$request.orderGetEnum().then((res) => {
      this.dicList = res.data.data;
      this.dicList.paymentStatusEnum.map((res) => {
        this.payDict.push({
          value: res.type,
          label: res.value,
        });
      });
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "feeName") {
          this.dicList.feeDictSecondEnum.map((res) => {
            item.options.push({
              label: res.feeName,
              value: res.feeName,
            });
          });
        }
      });
    });
    this.getList();
    this.chooseGetList();
    window.document.onkeypress = (e) => {
      if (this.radio == "BARCODE_PAY") {
        if (window.event) {
          // IE
          this.nextCode = e.keyCode;
        } else if (e.which) {
          // Netscape/Firefox/Opera
          this.nextCode = e.which;
        }

        if (e.which === 13) {
          // 键盘回车事件
          if (this.code.length < 3) return; // 扫码枪的速度很快，手动输入的时间不会让code的长度大于2，所以这里不会对扫码枪有效
          // console.log("扫码结束。");
          // console.log("条形码：", this.code);
          this.parseQRCode(this.code); // 获取到扫码枪输入的内容，做别的操作
          this.lastCode = "";
          this.lastTime = "";
          return;
        }

        this.nextTime = new Date().getTime();
        if (!this.lastTime && !this.lastCode) {
          this.code = ""; // 清空上次的条形码
          this.code += e.key;
          // console.log("扫码开始---", this.code);
        }
        if (
          this.lastCode &&
          this.lastTime &&
          this.nextTime - this.lastTime > 500
        ) {
          // 当扫码前有keypress事件时,防止首字缺失
          this.code = e.key;
          // console.log("防止首字缺失。。。", this.code);
        } else if (this.lastCode && this.lastTime) {
          this.code += e.key;
          // console.log("扫码中。。。", this.code);
        }
        this.lastCode = this.nextCode;
        this.lastTime = this.nextTime;
      }
    };
  },
  methods: {
    // 选择所有人按钮操作
    choose(row) {
      this.$request
        .peopleFfindUser({ id: row.id, userCode: row.userCode })
        .then((res) => {
          if (res.data.status == 200) {
            this.form.payer = res.data.data.userName;
            this.form.userCode = res.data.data.userCode;
            this.chooseShow = false;
          } else {
            that.$message.error(res.data.data);
          }
        });
    },
    chooseGetList() {
      this.chooseLoading = true;
      this.$request.detailAll(this.chooseParams).then((res) => {
        if (res.data.status == 200) {
          this.chooseTableData = res.data.data.rows;
          this.chooseTotal = res.data.data.records;
          this.chooseParams.page = res.data.data.page;
          this.chooseLoading = false;
        } else {
          this.chooseLoading = false;
        }
      });
    },
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
    },
    chooseResetQuery() {
      this.chooseParams = {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      };
      this.chooseHandleQuery();
    },
    // 所有人类型选择改变后
    choosePeople() {
      this.chooseShow = true;
    },
    // 支付方式发生改变
    payChange(val) {
      if (val == "BARCODE_PAY") {
        this.form.paymentRemark = "";
        this.form.authCode = undefined;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      } else {
        this.form.paymentRemark = "";
        this.form.authCode = undefined;
      }
    },
    // 支付人类型发生改变
    peopleChange(val) {
      if (val == "USER") {
        this.form.payer = this.userInfo.name;
        this.form.userCode = this.userInfo.code;
      } else if (val == "OTHER") {
        this.form.payer = undefined;
        this.form.userCode = undefined;
      }
    },
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
    parseQRCode(code) {
      this.form.authCode = code;
    },
    //支付超时后的处理
    afterPay(str) {
      let status = undefined;
      if (str == "QUERY_WX") {
        this.$request.queryWXPay(this.form.uniformOrderCode).then((res) => {
          if (res.data.data == "SUCCESS") {
            status = true;
          } else {
            status = false;
          }
        });
      } else {
        this.$request.queryAliPay(this.form.uniformOrderCode).then((res) => {
          if (res.data.data == "SUCCESS") {
            status = true;
          } else {
            status = false;
          }
        });
      }
      return status;
    },
    // 支付
    submitForm() {
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认支付?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(function () {
              if (that.radio == "BARCODE_PAY") {
                const loading = that.$loading({
                  lock: true,
                  text: "Loading",
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)",
                });
                that.$request.orderPaymentCreatPay(that.form).then((res) => {
                  if (res.data.data == "SUCCESS") {
                    that.open = false;
                    that.$message.success("支付成功");
                    loading.close();
                    that.getList();
                  } else if (
                    res.data.data == "QUERY_WX" ||
                    res.data.data == "QUERY_ALI"
                  ) {
                    setTimeout(() => {
                      if (that.afterPay(res.data.data)) {
                        that.$message.success("支付成功");
                        that.getList();
                        loading.close();
                        that.open = false;
                      } else {
                        that.getList();
                        that.open = false;
                        loading.close();
                        that.tipOpen = true;
                      }
                    }, 5000);
                  } else {
                    that.$message.error(res.data.data || res.data.msg);
                    that.getList();
                    loading.close();
                    that.open = false;
                  }
                });
              } else if (that.radio == "TRANSFER") {
                that.$request.orderPaymentTransferPay(that.form).then((res) => {
                  if (res.data.status == 200) {
                    if (res.data.data != "SUCCESS") {
                      that.$message.error(res.data.data);
                      that.getList();
                      that.open = false;
                    } else {
                      that.open = false;
                      that.$message.success("支付成功");
                      that.getList();
                    }
                  } else {
                    that.$message.error(res.data.data);
                    that.getList();
                    that.open = false;
                  }
                });
              } else {
                that.$request.orderPaymentCashPay(that.form).then((res) => {
                  if (res.data.status == 200) {
                    if (res.data.data != "SUCCESS") {
                      that.$message.error(res.data.data);
                      that.getList();
                      that.open = false;
                    } else {
                      that.open = false;
                      that.$message.success("支付成功");
                      that.getList();
                    }
                  } else {
                    that.$message.error(res.data.data);
                    that.getList();
                    that.open = false;
                  }
                });
              }
            })

            .catch(function () {});
        }
      });
    },
    //导出excel
    importExcel() {
      this.$request.orderDownloadExcel(this.params);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.billList = selection;
      this.ids = selection.map((item) => item.orderCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
        paymentStatus: undefined,
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        parkingCode: undefined,
        orderYear: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 选中收费
    addList() {
      let that = this;
      this.radio = "BARCODE_PAY";
      this.$request.orderPaymentCreateOrder(this.ids).then((res) => {
        if (res.data.status == 200) {
          this.title = "确认缴费";
          res.data.data.paymentRemark = undefined;
          this.form = res.data.data;
          this.userInfo.name = res.data.data.payer;
          this.userInfo.code = res.data.data.userCode;
          this.open = true;
          this.$nextTick(() => {
            this.$refs.input.focus();
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    //获取表格列表
    getList() {
      this.loading = true;
      if (this.params.orderYear) {
        this.params.orderYear = Number(this.params.orderYear);
      }
      this.$request.orderFindAll(this.params).then((res) => {
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
.elinput {
  width: 75%;
}
.btn-buka {
  width: 20%;
  margin-left: 4%;
  color: #fff;
}
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>
