<template>
  <div :id="ids" style="height: 250px"></div>
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
    title: {
      // 饼状图数据
      type: String,
      default: () => {
        return "";
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
        top: 20,
        textStyle: {
          fontSize: "14",
          fontWeight: "400",
          color: "#fff",
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
        textStyle: {
          color: "#fff",
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
          data: this.data.time,
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
        },
      ],
      yAxis: {
        type: "value",
        //     show:false,
        axisLine: {
          show: false, //y轴线消失
          lineStyle: {
            color: "#fff",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series: [
        {
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
          data: this.data.list,
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
