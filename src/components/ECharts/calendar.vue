<template>
  <div :id="ids" style="height: 200px"></div>
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
    function getVirtulData(year) {
      year = year || "2017";
      var date = +echarts.number.parseDate(year + "-01-01");
      var end = +echarts.number.parseDate(year + "-12-31");
      var dayTime = 3600 * 24 * 1000;
      var data = [];
      for (var time = date; time <= end; time += dayTime) {
        data.push([
          echarts.format.formatTime("yyyy-MM-dd", time),
          Math.floor(Math.random() * 10000),
        ]);
      }
      return data;
    }
    // 日历图
    let myChart = echarts.init(document.getElementById(this.ids));
    myChart.setOption({
      visualMap: {
        show: false,
        min: 0,
        max: 10000,
      },
      calendar: {
        orient: "vertical",
        yearLabel: {
          margin: 40,
        },
        monthLabel: {
          nameMap: "cn",
          margin: 20,
        },
        dayLabel: {
            firstDay: 1,
            nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        },
        cellSize: 40,
        range: "2017-02",
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: getVirtulData(2017),
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
