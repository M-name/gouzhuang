<template>
  <div :id="ids" style="height: 120px"></div>
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
    titleColor: {
      // 饼状图数据
      type: String,
      default: () => {
        return "#000";
      },
    },
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
    const myChart = echarts.init(document.getElementById(this.ids));
    myChart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
        color: "black",
        borderWidth: "1", //边框宽度设置1
        borderColor: "gray", //设置边框颜色
        textStyle: {
          color: "black", //设置文字颜色
        },
        formatter: "{b} : {c} ({d}%)",
      },

      grid: {
        width: "50%",
        height: "70%",
        top: "10%",
        left: "8%",
      },
      legend: {
        icon: "circle",
        show: false,
      },
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#588dd5", "#f5994e"],
      graphic: [{ //环形图中间添加文字
            type: 'text', //通过不同top值可以设置上下显示
            left: 'center',
            top: '45%',
            style: {
                text: '设备种类'+'\n'+'9',
                textAlign: 'center',
                fill: '#fff', //文字的颜色
                width: 30,
                height: 30,
                fontSize: 12,
                fontFamily: "Microsoft YaHei"
            }
        }],
      series: [
        {
          type: "pie",
          radius: ["50%", "65%"],
          center: ["50%", "50%"],
          data: this.datas,
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            // label: {
            //   show: true,
            // },
          },
          labelLine: {
            show: false,
          },
        },
      ],
    });
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }, 50);
    // myChart.on("mouseover", (params) => {
    //   let op = myChart.getOption();
    //   if (params.seriesIndex === 0) {
    //     let _label = {
    //       normal: {
    //         show: true,
    //         position: "center",
    //         formatter: [
    //           `{a|${params.name}}`,
    //           `{b|${params.percent + "%"}}`,
    //         ].join("\n"),
    //         rich: {
    //           a: {
    //             color: this.titleColor,
    //             fontSize: 13,
    //             lineHeight: 30,
    //           },
    //           b: {
    //             color: this.titleColor,
    //             fontSize: 13,
    //           },
    //         },
    //       },
    //     };

    //     op.series[0].label = _label;
    //     myChart.setOption(op, true);
    //   }
    // });
  },
};
</script>
