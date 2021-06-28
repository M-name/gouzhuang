<template>
  <div class="contant">
    <div class="parking">
      <div class="parking-img"><img src="@/assets/home.png" alt="" /></div>
      <div class="user-info">
        <p class="car-id">问卷标题：{{ questionDetail.surveyTitle }}</p>
        <p class="parking-info">
          问卷范围：<span
            v-for="(item, index) in questionDetail.surveyScopeStr"
            :key="index"
            >{{ item }}</span
          >
        </p>
        <p class="parking-info">
          问卷起始：{{ questionDetail.surveyBeginTime }}
        </p>
        <p class="parking-info">问卷截止：{{ questionDetail.surveyEndTime }}</p>
        <p class="parking-info">
          已提交：{{ questionDetail.committed }}，应提交：{{
            questionDetail.should
          }}
        </p>
      </div>
      <div class="pine"><div id="main" style="height: 140px"></div></div>
    </div>
    <div style="height: 40px; background: #fff"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="提交记录">
          <div class="operation">
            <el-radio-group @change="choose" v-model="radio">
              <el-radio :label="''">全部</el-radio>
              <el-radio :label="0">未提交</el-radio>
              <el-radio :label="1">已提交</el-radio>
            </el-radio-group>
             <el-button
             style="float:right;margin-bottom:10px;"
             class="excel"
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="exportDetail"
              >导出问卷明细Excel</el-button
            >
            
            <CommonTable
              :total="total"
              :loading="loading"
              :defColumns="column"
              @pagination="getList"
              :dataList="tableData"
              :options="tableOptions"
              :page.sync="params.page"
              :limit.sync="params.pageSize"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="统计分析">
          <div class="operation">
            <el-button
             style="float:right;margin-bottom:10px;margin-left:10px;"
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="exportAnalyze"
              >导出问卷分析Excel</el-button
            >
            <el-button
             style="float:right;margin-bottom:10px;"
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="upDated"
              >统计数据更新</el-button
            >
            
            <CommonTable
              :total="statisticTotal"
              :loading="statisticLoading"
              :defColumns="statisticColumn"
              @pagination="statisticGetList"
              :dataList="statisticTableData"
              :options="tableOptions"
              :page.sync="statisticParams.page"
              :limit.sync="statisticParams.pageSize"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      radio: '',
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },

      //表格列
      column: [
        { prop: "userName", label: "住户姓名 " },
        { prop: "userCode", label: "住户编号" },
        { prop: "mobile", label: "手机号" },
        { prop: "answerStatusStr", label: "答卷状态" },
        { prop: "answerTime", label: "提交时间 " },
      ],
      statisticColumn: [
        { prop: "questionOrder", label: "题号 " },
        { prop: "questionName", label: "题目" },
        { prop: "optionCodes", label: "题目选项" },
        { prop: "answerTypeStr", label: "题目类型" },
        { prop: "statisticTime", label: "统计时间 " },
        { prop: "statisticData", label: "统计分析" },
      ],
      // 用户信息
      questionDetail: {},
      // 上一级ID
      surveyId: undefined,
      // 表格参数
      tableData: [],
      datas: [],
      statisticTableData: [],
      // 总条数
      total: 0,
      statisticTotal: 0,
      loading: false,
      statisticLoading: false,
      params: {
        page: 1,
        pageSize: 20,
        surveyCode: undefined,
        answerStatus:undefined,
      },
      statisticParams: {
        page: 1,
        pageSize: 20,
        surveyCode: undefined,
      },
    };
  },
  watch: {
    datas(value) {
      this.getPie();
    },
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("surveyCode", this.$route.params.code);
      localStorage.setItem("surveyId", this.$route.params.id);
      this.params.surveyCode = this.$route.params.code;
      this.statisticParams.surveyCode = this.$route.params.code;
      this.surveyId = this.$route.params.id;
    } else {
      this.params.surveyCode = localStorage.getItem("surveyCode");
      this.statisticParams.surveyCode = localStorage.getItem("surveyCode");
      this.surveyId = localStorage.getItem("surveyId");
    }
    const myChart = echarts.init(document.getElementById("main"));
    this.getQuestion();
    this.getPie();
    this.statisticGetList();
    this.getList();
    setTimeout(function () {
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }, 50);
  },
  created() {},
  methods: {
    // 绘制饼状图
    getPie() {
      const myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
           formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: "5%",
          right: "0",
          orient: "vertical",
        },
        color:['#39A0FC','#FEAD3F'],
        series: [
          {
            center: ["40%", "50%"],
            name: "提交记录",
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
    },
    //获取提交记录
    getList() {
      this.loading = true;
      this.$request
        .surveyUserList(this.params)
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //统计分析
    statisticGetList() {
      console.log(this.statisticParams);
      this.statisticLoading = true;
      this.$request.surveyCensusLists(this.statisticParams).then((res) => {
        if (res.data.status == 200) {
          this.statisticTableData = res.data.data.rows;
          this.statisticTotal = res.data.data.records;
          this.statisticParams.page = res.data.data.page;
          this.statisticLoading = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取问题详情
    getQuestion() {
      this.$request
        .surveyFind(this.surveyId)
        .then((res) => {
          res.data.data.surveyScopeStr = res.data.data.surveyScopeStr.split(
            ","
          );
          this.questionDetail = res.data.data;
          this.datas = [
            { value: this.questionDetail.committed, name: "已提交" },
            { value: this.questionDetail.should, name: "应提交" },
          ];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 筛选提交记录
    choose(item) {
      this.params.answerStatus = item;
      this.getList();
    },
    // 统计数据更新
    upDated() {
      // this.statisticLoading = true;
      this.$request.surveyCensusUpdate(this.statisticParams).then((res) => {
        if (res.data.status == 200) {
         this.statisticGetList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //导出问卷明细Excel
    exportDetail() {
      this.$request.surveyDownloadUserExcell({surveyCode:this.params.surveyCode,answerStatus:this.params.answerStatus});
    },
     //导出问卷分析Excel
    exportAnalyze() {
      this.$request.downloadCensusExcel({surveyCode:this.params.surveyCode});
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  .parking {
    height: 120px;
    background: #fff;
    padding: 10px;
    .parking-img {
      display: inline-block;
      img {
        width: 120px;
        height: 120px;
      }
    }
    .user-info {
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      width: 45%;
      p {
        margin-bottom: 5px;
      }
      .car-id {
        font-size: 14px;
      }
      .parking-info {
        margin-top: 5px;
        font-size: 14px;
        span {
          height: 20px;
          line-height: 20px;
          padding: 2px 10px;
          border-radius: 20px;
          margin-right: 10px;
          font-size: 12px !important;
          display: inline-block;
          background: #1790fd;
          color: #fff;
          font-size: 14px;
        }
      }
      .theuser {
        margin-top: 10px;
        div {
          font-size: 16px;
        }
      }
    }
    .pine {
      // display: inline-block;
      vertical-align: top;
      width: 21%;
      float: right;
    }
  }
  .tabs {
    background: #fff;
    padding-left: 10px;
  }
}
.operation {
  background: #fff;
  padding: 10px 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
</style>