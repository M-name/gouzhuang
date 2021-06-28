<template>
  <div id="mainPie" style="height: 290px"></div>
</template>
<script>
/* eslint-disable no-undef */
import echarts from "echarts";
export default {
  props: {
    datas: {
      // 饼状图数据
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    // 饼状图
    const myChart = echarts.init(document.getElementById("mainPie"));
    myChart.setOption({
      //       title: {
      //         text: '某站点用户访问来源',
      //         subtext: '纯属虚构',
      //         left: 'center'
      //     },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "horizontal",
        top:"220"
      },
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
      series: [
        {
          name: "年龄分布",
          type: "pie",
          radius: "50%",
          center: ["50%", "40%"],
          data:this.datas,
          label: {
            //饼图图形上的文本标签
            normal: {
              show: true,
              //     position: "inner", //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 16, //文字的字体大小
              },
              formatter: "{d}%",
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
