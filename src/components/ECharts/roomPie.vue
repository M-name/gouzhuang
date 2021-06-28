<template>
  <div id="main" style="height: 140px"></div>
</template>
<script>

/* eslint-disable no-undef */
import echarts from "echarts"
export default {
  props: {
    datas: {
      // 饼状图数据
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  mounted () {
    // 饼状图
    const myChart = echarts.init(document.getElementById('main'))
    myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          right: "0",
          orient: "vertical",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.datas,
          },
        ],
      });
    setTimeout(function () {
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }, 50)
  }
}
</script>
