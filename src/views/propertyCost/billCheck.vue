<template>
  <div class="content">
    <div class="tabs">
      <el-tabs v-model="orderParam.feeName" @tab-click="getOrderStatis">
        <el-tab-pane label="住宅托管费" name="住宅托管费"> </el-tab-pane>
        <el-tab-pane label="房屋能耗费" name="房屋能耗费"></el-tab-pane>
        <el-tab-pane label="车位管理费" name="车位管理费"></el-tab-pane>
        <el-tab-pane label="车位租赁费" name="车位租赁费"></el-tab-pane>
      </el-tabs>
      <div class="cost-form">
        <div class="cost-statistics">
          <img src="@/assets/yingshengcheng.png" alt="" />
          <div>
            <p>应生成</p>
            <span>{{ orderList.create }}</span>
          </div>
        </div>
        <div class="cost-statistics">
          <div class="cost-statistics">
            <img src="@/assets/shengchenglv.png" alt="" />
            <div>
              <p>已生成</p>
              <span>{{ orderList.created }}</span>
            </div>
          </div>
        </div>
        <div class="cost-statistics">
          <div class="cost-statistics">
            <img src="@/assets/yishengcheng.png" alt="" />
            <div>
              <p>待生成</p>
              <span>{{ orderList.toGenerated }}</span>
            </div>
          </div>
        </div>
        <div class="cost-statistics">
          <div class="cost-statistics">
            <img src="@/assets/fuhelv.png" alt="" />
            <div>
              <p>生成率</p>
              <span>{{ orderList.percentage }}</span>
            </div>
          </div>
        </div>
        <div class="cost-statistics">
          <div class="cost-statistics">
            <img src="@/assets/zhangdanzonge.png" alt="" />
            <div>
              <p>账单总额（元）</p>
              <span>{{ orderList.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cost-content">
      <div class="search-box">
        <CommonSearch
          @resetQuery="resetQuery"
          @handleQuery="handleQuery"
          :queryParams.sync="params"
          :searchList="commonSearchList"
        />
      </div>
      <div class="btn">
        <el-button
          size="small"
          type="primary"
          :disabled="multiple"
          @click="submit()"
          >批量提交复核</el-button
        >
        <el-button size="small" type="primary" @click="submitAll()"
          >一键提交复核</el-button
        >
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
      ></CommonTable>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        paymentStatus: 0,
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        parkingCode: undefined,
      },
      // 表格参数
      tableData: [],
      //加载状态
      loading: false,
      // 总条数
      total: 0,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
        {
          label: "提交",
          icon: "iconfont icon-publish",
          handler: (row) => this.submit(row),
        },
      ],
      // 表格列
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
        { prop: "buildingCodeStr", label: "房屋编码" },
        { prop: "buildingArea", label: "房屋面积(m²)", width: "160" },
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "feeName", label: "费用名称" },
        { prop: "orderAmount", label: "应支付(元)" },
        { prop: "discountAmount", label: "优惠金额(元)" },
        { prop: "paidAmount", label: "实际已付(元)" },
        { prop: "paymentStatusValue", label: "账单状态" },
        { prop: "createTime", label: "生成日期" },
      ],
      // 搜索配置
      commonSearchList: [
        { prop: "userName", label: "住户姓名" },
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "parkingCode", label: "车位编码" },
      ],
      // 生成记录所需参数
      orderParam: {
        feeName: "住宅托管费",
      },
      billList: [],
      // 生成记录展示
      orderList: {},
      // 非多个禁用
      multiple: true,
    };
  },
  mounted() {
    this.getOrderStatis();
  },
  methods: {
    // 生成记录统计
    getOrderStatis() {
      this.params.feeName = this.orderParam.feeName;
      this.getList();
      this.$request.orderStatisticsCreate(this.orderParam).then((res) => {
        if (res.data.status == 200) {
          this.orderList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取表格列表
    getList() {
      this.loading = true;
      this.params.feeName = this.orderParam.feeName;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.billList = selection;
      this.multiple = !selection.length;
      console.log(this.billList);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        paymentStatus: 0,
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        parkingCode: undefined,
      };
      this.handleQuery();
    },
    // 删除按钮
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该账单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.orderDelete(row.id).then(() => {
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
    // 提交复核
    submit(row) {
      let that = this;
      let list = [];
      if (row) {
        list.push(row);
      }
      const id = list.length > 0 ? list : this.billList;
      console.log(id, "list");
      this.$confirm("确定将所选账单提交复核吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.orderSubmitBatch(id).then((res) => {
            if (res.data.status == 200) {
              that.$message.success("提交成功");
              that.getList();
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    // 一键提交复核
    submitAll() {
      this.$confirm("是否确认提交所有账单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.orderSubmitAll().then((res) => {
            if (res.data.status == 200) {
              that.$message.success("提交成功");
              that.getList();
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
.tabs {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.tabs-change {
  height: 110px;
  background: #999;
}
/deep/.el-tabs__nav {
  margin-left: 20px;
}
.cost {
  line-height: 52px;
  background: #f6f6f6;
  padding: 0 20px;
  span {
    margin-right: 50px;
    font-size: 14px;
    color: #333333;
  }
}
.cost-form {
  display: flex;
  justify-content: space-between;
  padding: 0 5%;
  margin: 20px 0;
  .cost-statistics {
    img {
      width: 60px;
      height: 60px;
      display: inline-block;
    }
    div {
      display: inline-block;
      vertical-align: top;
      margin-left: 22px;
      p {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        margin-top: 3px;
      }
      span {
        display: inline-block;
        font-size: 25px;
        font-weight: 400;
        color: #333333;
        margin-top: 8px;
      }
    }
  }
}
// /deep/.el-input {
//   width: 100% !important;
// }
.cost-content {
  margin-top: 20px;
  background: #fff;
  padding: 24px;
}
.search-box {
  display: flex;
  align-items: center;
  /deep/.common-search {
    vertical-align: bottom;
    box-sizing: border-box;
    padding-left: 0;
    padding-bottom: 0;
  }
}
.btn {
  padding: 20px 0 0 0;
  //     text-align: right;
}
</style>