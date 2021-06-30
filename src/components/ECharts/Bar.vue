<template>
  <div :id="ids" :style="{ height: height + 'px' }"></div>
</template>
<script>
/* eslint-disable no-undef */
import echarts from "echarts";
export default {
  props: {
    ids: {
      // 饼状图数据
      type: String,
      default: () => {
        return "";
      },
    },
    height: {
      // 饼状图数据
      type: Number,
      default: () => {
        return 100;
      },
    },
    isCommer: {
      // 饼状图数据
      type: Boolean,
      default: () => {
        return false;
      },
    },
    title: {
      // 饼状图数据
      type: String,
      default: () => {
        return "";
      },
    },
    titleColor: {
      // 饼状图数据
      type: String,
      default: () => {
        return "#000";
      },
    },
    data: {
      // 饼状图数据
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 曲线图
    let myChart = echarts.init(document.getElementById(this.ids));
    myChart.setOption({
      title: {
        text: this.title,
        left: "0%",
        textStyle: {
          fontSize: "14",
          fontWeight: "400",
          color: this.titleColor,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["进入", "外出"],
        orient: "horizontal",
        x: "right",
        y: " center",
        padding: [20, 20, 0, 0],
        textStyle: {
          color: this.titleColor,
        },
      },
      grid: {
        left: "0%",
        right: "1%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.data.line,
          axisLine: {
            lineStyle: {
              color: this.titleColor,
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine:this.isCommer?{
          show: false, //y轴线消失
          lineStyle: {
            color: this.titleColor,
          },
        }:{
            lineStyle: {
              color: this.titleColor,
            },
          },
          splitLine: this.isCommer?{
            show: true,
            lineStyle: {
              type: "dashed",
            },
          }:{
            show: true,
            lineStyle: {
              type: "solid",
            },
          },
        },
      ],
      series: [
        {
          name: "进入",
          type: "line",
          smooth: true,
          areaStyle: {
            color: "#39A0FC",
          },
          itemStyle: {
            normal: {
              color: "#39A0FC", // 改变折线点的颜色
              ineStyle: {
                color: "#39A0FC", // 改变折线颜色
              },
            },
          },
          data: this.data.in,
        },
        {
          name: "外出",
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
          data: this.data.out,
        },
      ],
    });
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }, 50);
  },
};
</script>
