<template>
  <div id="main" style="height: 120px"></div>
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
    const myChart = echarts.init(document.getElementById("main"));
    myChart.setOption({
      tooltip: {
        trigger: "item",
        show:false
        // formatter: function (param) {
        //   return (
        //     param.marker +
        //     param.data.name +
        //     ": " +
        //     '<span style="font-size:14px;color:' +
        //     param.color +
        //     ';">' +
        //     param.data.value +
        //     "</span>" +
        //     "&nbsp" +
        //     param.percent +
        //     "%"
        //   );
        // },
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
      color: ["#39A0FC", "#FEAD3F"],
      series: [
        {
          type: "pie",
          radius: ["50%", "65%"],
          center: ["50%", "50%"],
          itemStyle: {
            borderColor: "#fff",
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: "20",
          //   },
          // },
          data: this.datas,
          label: {
            normal: {
              position: "center",
              show: false,
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
    myChart.on("mouseover", (params) => {
      let op = myChart.getOption();
      if (params.seriesIndex === 0) {
        let _label = {
          normal: {
            show: true,
            position: "center",
            formatter: [
              `{a|${params.name}}`,
              `{b|${params.percent + "%"}}`,
            ].join("\n"),
            rich: {
              a: {
                color: "#000",
                fontSize: 15,
                lineHeight: 30,
              },
              b: {
                color: "#000",
                fontSize: 15,
              },
            },
          },
        };

        op.series[0].label = _label;
        myChart.setOption(op, true);
      }
    });
  },
};
</script>
