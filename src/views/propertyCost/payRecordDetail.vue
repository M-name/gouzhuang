<template>
  <div>
    <div style="padding-right: 20px; background: #fff">
      <CommonSearch
        @resetQuery="resetQuery"
        @handleQuery="handleQuery"
        :queryParams.sync="params"
        :searchList="commonSearchList"
      />
    </div>
    <div class="cost-form">
      <div class="cost-statistics">
        <img src="@/assets/zongshouru.png" alt="" />
        <div>
          <p>总收入</p>
          <span>{{ infoList.sum }}</span>
        </div>
      </div>
      <div class="cost-statistics">
        <div class="cost-statistics">
          <img src="@/assets/zhuzhaituoguanfei.png" alt="" />
          <div>
            <p>物业服务费</p>
            <span>{{ infoList.residence }}</span>
          </div>
        </div>
      </div>
      <div class="cost-statistics">
        <div class="cost-statistics">
          <img src="@/assets/nenghaofei.png" alt="" />
          <div>
            <p>房屋能耗费</p>
            <span>{{ infoList.energyConsumption }}</span>
          </div>
        </div>
      </div>
      <div class="cost-statistics">
        <div class="cost-statistics">
          <img src="@/assets/cheweiguanlifei.png" alt="" />
          <div>
            <p>车位管理费</p>
            <span>{{ infoList.parkingManagement }}</span>
          </div>
        </div>
      </div>
      <div class="cost-statistics">
        <div class="cost-statistics">
          <img src="@/assets/cheweichuzufei.png" alt="" />
          <div>
            <p>车位租赁费</p>
            <span>{{ infoList.carRental }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cost-form">
      <div class="cost-statistic">
        <img src="@/assets/zhuzhaituoguanfei.png" alt="" />
        <div>
          <p>物业服务费缴纳情况</p>
          <span>总户数: {{ infoList.residencePayTotal }}</span>
          <span>已缴户数: {{ infoList.residencePayCount }}</span>
          <span>未缴户数: {{ infoList.residencePayNot }}</span>
          <span>缴纳率: {{ infoList.residencePayRate }}%</span>
        </div>
      </div>
      <div class="cost-statistic">
        <div class="cost-statistics">
          <img src="@/assets/nenghaofei.png" alt="" />
          <div>
            <p>房屋能耗费缴纳情况</p>
            <span>总户数: {{ infoList.energyConsumptionPayTotal }}</span>
            <span>已缴户数: {{ infoList.energyConsumptionPayCount }}</span>
            <span>未缴户数: {{ infoList.energyConsumptionPayNot }}</span>
            <span>缴纳率: {{ infoList.energyConsumptionPayRate }}%</span>
          </div>
        </div>
      </div>
      <div class="cost-statistic">
        <div class="cost-statistics">
          <img src="@/assets/cheweiguanlifei.png" alt="" />
          <div>
            <p>车位管理费缴纳情况</p>
            <span>总户数: {{ infoList.parkingManagementPayTotal }}</span>
            <span>已缴户数: {{ infoList.parkingManagementPayCount }}</span>
            <span>未缴户数: {{ infoList.parkingManagementPayNot }}</span>
            <span>缴纳率: {{ infoList.parkingManagementPayRate }}%</span>
          </div>
        </div>
      </div>
      <div class="cost-statistic">
        <div class="cost-statistics">
          <img src="@/assets/cheweichuzufei.png" alt="" />
          <div>
            <p>车位租赁费缴纳情况</p>
            <span>总户数: {{ infoList.carRentalPayTotal }}</span>
            <span>已缴户数: {{ infoList.carRentalPayCount }}</span>
            <span>未缴户数: {{ infoList.carRentalPayNot }}</span>
            <span>缴纳率: {{ infoList.carRentalPayRate }}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="static">
      <i class="el-icon-menu" style="font-size: 16px; color: #409eff"></i>
      <span class="info">费用统计</span>
      <el-divider></el-divider>
      <div class="static-pie">
        <div id="pie" style="height: 240px"></div>
      </div>
      <div class="static-bar">
        <div id="bar" style="height: 240px"></div>
      </div>
    </div>
    <div class="static">
      <i class="el-icon-menu" style="font-size: 16px; color: #409eff"></i>
      <span class="info">近30日支付金额趋势图</span>
      <el-divider></el-divider>
      <div class="static-line">
        <div id="line" style="height: 240px"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      params: {
        time: undefined,
        orderYear: new Date().getFullYear(),
      },
      infoList: {},
      // 公用搜索组件内容
      commonSearchList: [{ prop: "time", label: "收费日期", type: "picker" }],
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    let myChartBar = echarts.init(document.getElementById("bar"));
    let myChartLine = echarts.init(document.getElementById("line"));
    let myChart = echarts.init(document.getElementById("pie"));
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
        myChartBar.resize();
        myChartLine.resize();
      });
    }, 50);
  },
  methods: {
    getList() {
      this.$request.orderPaymentStatistics(this.params).then((res) => {
        if (res.data.status == 200) {
          this.infoList = res.data.data;
          this.creatPie();
          this.creatBar();
          this.creatLine();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 创建饼状图
    creatPie() {
      let myChart = echarts.init(document.getElementById("pie"));
      myChart.setOption({
        color: [
          "#2ec7c9",
          "#b6a2de",
          "#5ab1ef",
          "#ffb980",
          "#d87a80",
          "#8d98b3",
          "#e5cf0d",
          "#97b552",
        ],
        title: {
          text: "支付方式统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "75%",
        },
        series: [
          {
            // name: "条数",
            type: "pie",
            radius: "50%",
            center: ["40%", "50%"],
            data: this.infoList.payTypeList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    // 创建柱状图
    creatBar() {
      let myChartBar = echarts.init(document.getElementById("bar"));
      myChartBar.setOption({
        color: ["#5470c6", "#91cc75", "#fac858", "#73c0de"],
        title: {
          text: "费用类别统计",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          bottom: "30",
          // left:"5%",
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.infoList.feeDict,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            type: "bar",
            data: this.infoList.feeAmount,
          },
        ],
      });
    },
    // 创建折线图
    creatLine() {
      let myChart = echarts.init(document.getElementById("line"));
      myChart.setOption({
        title: {
          text: "",
          left: "0%",
          textStyle: {
            fontSize: "14",
            fontWeight: "400",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          orient: "horizontal",
          x: "right",
          y: " center",
          padding: [10, 30, 0, 0],
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "5%",
          top: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.infoList.dateTime,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "金额",
            type: "line",
            smooth: true,
            areaStyle: {
              color: "#5CC372",
            },
            itemStyle: {
              normal: {
                color: "#8cd5c2", // 改变折线点的颜色
                ineStyle: {
                  color: "#8cd5c2", // 改变折线颜色
                },
              },
            },
            data: this.infoList.timeAmount,
          },
        ],
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        time: undefined,
        orderYear: new Date().getFullYear(),
      };
      this.handleQuery();
    },
  },
};
</script>
<style lang="scss" scoped>
.cost-form {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 30px 5%;
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
  .cost-statistic {
    img {
      width:70px;
      height: 70px;
      display: inline-block;
      vertical-align: middle;
    }
    div {
      display: inline-block;
      vertical-align: middle;
      margin-left: 22px;
      p {
        font-size: 15px;
        font-weight: 400;
        color: #333;
        margin-top: 3px;
      }
      span {
        display: block;
        font-size: 14px;
        font-weight: 400;
        color: #999;
        margin-top: 8px;
      }
    }
  }
}
.static {
  background: #fff;
  padding: 20px;
  .info {
    font-size: 18px;
  }
  .static-pie {
    width: 45%;
    display: inline-block;
    margin-right: 7%;
    background: #f0f2f5;
    padding: 20px 0;
  }
  .static-bar {
    width: 45%;
    display: inline-block;
    background: #f0f2f5;
    padding: 20px 10px;
  }
  .static-line {
    width: 100%;
    background: #f0f2f5;
    padding: 20px 0;
  }
}
</style>