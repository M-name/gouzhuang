<template>
  <div ref="bar" :id="ids" :style="{ height: height + 'px' }"></div>
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
    colorList: {
      // 饼状图数据
      type: Array,
      default: () => {
        return ["#00C4F5","#F8D618","#FF5A00","#FF5A00"];
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
     // const colorArr = ["#00C4F5","#F8D618","#FF5A00","#FF5A00"]
    let legendData = [];
    let seriesData = [];
//     if (this.data) {
      for (var i = 0; i < this.data.list.length; i++) {
        legendData.push(this.data.list[i].name);
        seriesData.push({
          name: this.data.list[i].name,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            normal: {
              color: this.colorList[i], // 改变折线点的颜色
              ineStyle: {
                color: this.colorList[i], // 改变折线颜色
              },
            },
          },
          data: this.data.list[i].num,
        });
      }
//     }
    // 曲线图
    let myChart = echarts.init(this.$refs.bar);
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
        data: legendData,
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
          axisLine: this.isCommer
            ? {
                show: false, //y轴线消失
                lineStyle: {
                  color: this.titleColor,
                },
              }
            : {
                lineStyle: {
                  color: this.titleColor,
                },
              },
          splitLine: this.isCommer
            ? {
                show: true,
                lineStyle: {
                  type: "dashed",
                },
              }
            : {
                show: true,
                lineStyle: {
                  type: "solid",
                },
              },
        },
      ],
      series:seriesData,
    });
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }, 50);
  },
};
</script>
