<template>
  <div :id="ids" style="height: 250px"></div>
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
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    let year = new Date().getFullYear();
    let month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const dataStr = year + "-" + month;
    //     function getVirtulData(year) {
    //       year = year || "2020";
    //       var date = +echarts.number.parseDate(year + "-01-01");
    //       var end = +echarts.number.parseDate(year + "-12-31");
    //       var dayTime = 3600 * 24 * 1000;
    //       var data = [];
    //       for (var time = date; time <= end; time += dayTime) {
    //         data.push([
    //           echarts.format.formatTime("yyyy-MM-dd", time),
    //           Math.floor(Math.random() * 10000),
    //         ]);
    //       }
    //       console.log(data);
    //       return data;

    //     }
    // 日历图
    let myChart = echarts.init(document.getElementById(this.ids));
    myChart.setOption({
     //  backgroundColor: "#10305f",
      visualMap: {
        show: false,
        min: 0,
        max: 1000,
          //  inRange: {
          //      color: ['#000'],
          //      opacity: [1, 0.3]
          //  },
          //   outOfRange: {
          //         color: ['#000'],
          //      opacity: [1, 0.3]
          //      },
          //  controller: {
          //      inRange: {
          //          opacity: [0.3, 0.6]
          //      },
          //     outOfRange: {
          //         backgroundColor: '#000',
          //      opacity: [1, 0.3]
          //      },
          //  },
        left: "center",
        pieces: [
          // 自定义每一段的范围，以及每一段的文字
          { gte: 5600, color: "#f31b21" }, // 不指定 max，表示 max 为无限大（Infinity）。
          { gte: 3, lte: 5600, color: "#E4881D" },
          { gte: 2, lte: 3, color: "#FF0E00" },
          { gte: 1, lte: 2, color: "#ECF529" },
          { lte: 1, color: "#56E4FF" },
        ],
        //    bottom: 20,
      },
      calendar: {
        orient: "vertical",
        yearLabel: {
          margin: 30,
        },
        monthLabel: {
          nameMap: "cn",
          margin: 20,
          color: "#fff",
        },
        dayLabel: {
          color: "#fff",
          firstDay: 1,
          nameMap: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        },
        cellSize: 40,
        range: dataStr,
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: this.data,
        itemStyle:{
            backgroundColor: "#10305f",
        }
      },
    });
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }, 50);
  },
};
</script>
