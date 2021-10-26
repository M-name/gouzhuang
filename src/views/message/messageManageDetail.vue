<template>
  <div class="content">
    <div class="static">
      <i class="el-icon-menu" style="font-size: 16px; color: #409eff"></i>
      <span class="info">统计信息</span>
      <el-divider></el-divider>
      <div class="static-pie">
        <div id="pie" style="height: 240px"></div>
      </div>
      <div class="static-bar">
        <div id="bar" style="height: 240px"></div>
      </div>
    </div>
    <div class="list">
      <div style="padding-right: 20px; background: #fff">
        <CommonSearch
          @resetQuery="resetQuery"
          @handleQuery="handleQuery"
          :queryParams.sync="params"
          :searchList="commonSearchList"
        />
      </div>
      <div class="operation">
        <CommonTable
          :total="total"
          :loading="loading"
          :defColumns="column"
          @pagination="getList"
          :dataList="tableData"
          :options="tableOptions"
          :page.sync="params.page"
          :limit.sync="params.pageSize"
          :operations="tableOperations"
          @selection-change="handleSelectionChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      batchCodes: undefined,
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        // {
        //   label: "查看",
        //   icon: "el-icon-edit",
        //   handler: (row) => this.handleCheck(row),
        // },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "msgParentCode",
          label: "消息类型",
          type: "select",
          options: [],
        },
        {
          prop: "msgTypeCode",
          label: "消息子类型",
          type: "select",
          options: [],
        },
        {
          prop: "msgTitle",
          label: "消息标题",
        },
        { prop: "sendStatus", label: "发送状态", type: "select", options: [] },
        { prop: "sendChannel", label: "发送渠道", type: "select", options: [] },
        { prop: "isRead", label: "读取状态", type: "select", options: [] },

        {
          prop: "times",
          label: "发送时间段",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "msgParentCodeStr", label: "消息大类" },
        { prop: "msgTypeCodeStr", label: "消息子类" },
        { prop: "msgTitle", label: "消息标题" },
        { prop: "isUseTemplateStr", label: "是否使用模板" },
        { prop: "batchCode", label: "消息编码" },
        { prop: "isBatchSendStr", label: "是否批量发送" },
        { prop: "batchCode", label: "发送批次号" },
        { prop: "currBatchCode", label: "发送编码" },
        { prop: "sendAccount", label: "接收账号" },
        { prop: "isReadStr", label: "是否已读" },
        { prop: "sendChannelStr", label: "发送渠道" },
        { prop: "sendStatusStr", label: "发送状态" },
        { prop: "sendCount", label: "发送次数" },
        { prop: "sendTime", label: "发送时间" },
        { prop: "readTime", label: "读取时间" },
        { prop: "sendBy", label: "发送员工" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        batchCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
        sendStatus: undefined,
        sendChannel: undefined,
        isRead: undefined,
      },
      // 饼状图数据
      pieData: {
        title: "全部发送记录统计",
        data: [],
      },
      barData: {
        title: "渠道发送记录统计",
        data: [],
      },
    };
  },
  watch:{
    "params.msgParentCode": {
      handler(newName, oldName) {
        if (newName) {
          this.params.msgTypeCode = undefined;
          this.$request
            .msgTemplateTypeList({ type: 1, msgTypeCode: newName })
            .then((res) => {
              this.commonSearchList.forEach((item) => {
                if (item.type == "select" && item.prop == "msgTypeCode") {
                  item.options = [];
                  res.data.data.map((res) => {
                    item.options.push({
                      label: res.msgTypeName,
                      value: res.msgTypeCode,
                    });
                  });
                }
              });
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$request.msgTemplateTypeList({ type: 0 }).then((res) => {
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "msgParentCode") {
          res.data.data.map((res) => {
            item.options.push({
              label: res.msgTypeName,
              value: res.msgTypeCode,
            });
          });
        }
      });
    });
    this.$request.msgTemplateFindEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "sendStatus") {
          this.dicList.msgSendStatus.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "sendChannel") {
          this.dicList.templateChannelEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "isRead") {
          this.dicList.msgIsReadEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("batchCodes", this.$route.params.code);
      this.params.batchCode = this.$route.params.code;
      this.batchCodes =this.$route.params.code;
    } else {
      this.params.batchCode = localStorage.getItem("batchCodes");
      this.batchCodes =localStorage.getItem("batchCodes");
    };
    this.$request
      .msgSendLeftCensus({ batchCode: this.batchCodes })
      .then((res) => {
        this.pieData.data = res.data.data.map((item) => {
          return {
            name: item.name,
            value: item.num,
          };
        });
        this.creatPie();
      });

    this.$request
      .msgSendRightCensus({ batchCode: this.batchCodes })
      .then((res) => {
        this.barData.data = res.data.data;
        this.creatBar();
      });

    let myChartBar = echarts.init(document.getElementById("bar"));
    let myChart = echarts.init(document.getElementById("pie"));
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
        myChartBar.resize();
      });
    }, 50);
    this.getList();
  },
  methods: {
    // 创建饼状图
    creatPie() {
      let myChart = echarts.init(document.getElementById("pie"));
      myChart.setOption({
        color: ["#5470c6", "#91cc75", "#fac858"],
        title: {
          text: this.pieData.title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        series: [
          {
            // name: "条数",
            type: "pie",
            radius: "50%",
            data: this.pieData.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    // 创建柱状图
    creatBar() {
      let legendList = [];
      let wait = [];
      let fail = [];
      let success = [];
      this.barData.data.map((item) => {
        legendList.push(item.name);
        item.list.map((res) => {
          if (res.name == "待发送") {
            wait.push(res.num);
          } else if (res.name == "发送成功") {
            success.push(res.num);
          } else if (res.name == "发送失败") {
            fail.push(res.num);
          }
        });
      });
      console.log(wait, fail, success);
      let myChartBar = echarts.init(document.getElementById("bar"));
      myChartBar.setOption({
        color: ["#5470c6", "#91cc75", "#fac858", "#73c0de"],
        title: {
          text: this.barData.title,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["待发送", "发送成功", "发送失败"],
        },
        grid: {
          bottom: "30",
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: legendList,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "待发送",
            type: "bar",
            barGap: "0",
            data: wait,
          },
          {
            name: "发送成功",
            type: "bar",
            data: success,
          },
          {
            name: "发送失败",
            type: "bar",
            data: fail,
          },
        ],
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsCode);
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
        this.params.times = undefined;
      } else {
        this.params.startTime = undefined;
        this.params.endTime = undefined;
      }
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        batchCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
        sendStatus: undefined,
        sendChannel: undefined,
        isRead: undefined,
      };
      this.params.batchCode = this.batchCodes;
      this.handleQuery();
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request
        .msgSendDetailList(this.params)
        .then((res) => {
          if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
        })
    },
  },
};
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 20px 0;
}
.content {
  .static {
    background: #fff;
    padding: 20px;
    .info {
      font-size: 18px;
    }
    .static-pie {
      width: 40%;
      display: inline-block;
      margin-right: 10%;
    }
    .static-bar {
      width: 45%;
      display: inline-block;
    }
  }
  .list {
    background: #fff;
    margin-top: 20px;
    padding: 20px;
  }
}
</style>