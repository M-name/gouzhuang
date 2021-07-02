<template>
  <div :id="ids" :style="{ height: height + 'px' }"></div>
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
    height: {
      // 饼状图数据
      type: Number,
      default: () => {
        return 150;
      },
    },
    axis: {
      // 饼状图数据
      type: Array,
      default: () => {
        return ["地区","数量","人数"];
      },
    },
    titleColor: {
      // 饼状图数据
      type: String,
      default: () => {
        return "#fff";
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
        top: "20%",
        left: "0",
        right: "15%",
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        nameTextStyle: {
          color: this.titleColor,
        },
        type: "category",
        name: this.axis[0],
        data: this.data.item,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: this.titleColor,
          },
        },
        axisLine: {
          show: true,
        },
      },
      yAxis: {
        nameTextStyle: {
          color: this.titleColor,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: this.titleColor, 
          },
        },
        type: "value",
        name:  this.axis[1],
      },
      series: [
        {
          name:  this.axis[2],
          type: "bar",
          barWidth: "60%",
          data: this.data.list,
          itemStyle: {
            normal: {
              color: function (params) {
                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
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
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: this.titleColor,
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
