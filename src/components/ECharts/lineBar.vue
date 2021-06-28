<template>
  <div :id="ids" style="height: 110px"></div>
</template>
<script>
/* eslint-disable no-undef */
import echarts from "echarts";
export default {
  props: {
    ids: {
      // id
      type: String,
      default: () => {
        return "";
      },
    },
    title: {
      // 标题
      type: String,
      default: () => {
        return "";
      },
    },
    data: {
      // 数据
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: 0,
        left: "3%",
        //    right: "4%",
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        show: false,
      },
      yAxis: {
        type: "category",
        data: this.data.item,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          name: "人数",
          type: "bar",
          barWidth: "60%",
          data: this.data.list,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  "#c23531",
                  "#2f4554",
                  "#61a0a8",
                  "#d48265",
                  "#91c7ae",
                  "#749f83",
                  "#ca8622",
                ];
                return colorList[params.dataIndex % colorList.length];
              },
              label: {
                show: true, //开启显示
                position: "right", //在上方显示
                textStyle: {
                  //数值样式
                  color: "black",
                  //    fontSize: 16,
                },
              },
            },
          },
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
