<template>
  <div class="contant">
    <div class="both left">
      <div class="peoplenum">
        <p class="title">小区人口信息</p>
        <div class="pie">
          <div style="width: 49%; display: inline-block">
            <pie :datas="pieData" v-if="flag" />
          </div>
          <div class="pie-info" style="width: 49%; display: inline-block">
            <p class="num-title">总人口数</p>
            <p class="pie-num">{{ progressList.count }}</p>
            <div class="pie-right">
              <span style="background: #39a0fc" class="block"></span>
              <span class="num"
                >常住人口：<span style="color: #39a0fc"
                  >{{ progressList.permanent }}
                </span>
                人</span
              >
            </div>
            <div class="pie-right">
              <span style="background: #fead3f" class="block"></span>
              <span class="num"
                >流动人口：<span style="color: #fead3f"
                  >{{ progressList.flow }}
                </span>
                人</span
              >
            </div>
          </div>
        </div>
        <div class="place">
          <p
            @click="choosePlace('education')"
            :class="tabsOne == 'education' ? 'choose' : 'nochoose'"
          >
            流动人口
          </p>
          <div class="education" v-if="tabsOne == 'education'">
            <div
              style="width: 45%; display: inline-block; margin-left: 3%"
              v-for="(item, index) in progressList.flowList"
              :key="index"
            >
              <div class="progress">
                <span>{{ item.blockNo }}</span>
                <div class="progress-line">
                  <el-progress :percentage="item.permanent" :format="format" />
                </div>
                <span>{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="peopleage">
        <p class="title">小区人口年龄分布</p>
        <AgePie v-if="pieShow" :datas="agePieList" />
        <div style="padding: 0 10px">
          <CommonTable
            :defColumns="ageColumns"
            :dataList="ageTableData"
            :options="tableOptions"
          />
        </div>
      </div>
    </div>
    <div class="both center">
      <div class="map">
        <Map @getLnglat="getPosi"></Map>
      </div>
      <div class="statistic">
        <p class="titlein">车辆进出趋势</p>
        <div class="choose-date">
          <el-radio-group text-color="#409EFF" fill="#fff" v-model="zoneName">
            <el-radio-button label="1">本日</el-radio-button>
            <el-radio-button label="2">本周</el-radio-button>
            <el-radio-button label="3">本月</el-radio-button>
          </el-radio-group>
        </div>
        <bar v-if="lineShow" :data="data" title="" ids="group" />
      </div>
    </div>
    <div class="both right">
      <div class="today">
        <span class="titles">车辆统计</span>
        <div class="today-in">
          <div><i class="iconfont icon-jinru-cheliang1"></i></div>
          <div class="in-both">{{ carInOut.inCount }}<span>进</span></div>
          <div class="in-people">
            <p>{{ carInOut.residentInCount }}</p>
            <p style="color: #999999">登记车辆</p>
          </div>
          <div class="in-people">
            <p>{{ carInOut.visitorInCount }}</p>
            <p style="color: #999999">访客车辆</p>
          </div>
        </div>
        <div class="today-out">
          <div><i class="iconfont icon-waichu-cheliang1"></i></div>
          <div class="in-both">{{ carInOut.outCount }}<span>出</span></div>
          <div class="in-people">
            <p>{{ carInOut.residentOutCount }}</p>
            <p style="color: #999999">登记车辆</p>
          </div>
          <div class="in-people">
            <p>{{ carInOut.visitorOutCount }}</p>
            <p style="color: #999999">访客车辆</p>
          </div>
        </div>
        <p style="color: #fead3f; margin-top: 30px; margin-bottom: 20px">
          进出车辆
        </p>
        <div>
          <div
            class="pedestrian-peoples"
            style="background: #fff6e9; padding: 3px 1px"
          >
            <div style="width: 22%; text-align: center">车辆</div>
            <div style="width: 22%; text-align: center">位置</div>
            <div style="width: 30%; text-align: center">时间</div>
            <div style="width: 22%; text-align: center">进/出</div>
          </div>
          <vue-seamless-scroll
            :class-option="optionSingleHeight"
            :data="carInOut.list"
            class="seamless-warp"
          >
            <ul class="item">
              <li v-for="(item, index) in carInOut.list" :key="index">
                <div class="pedestrian-people">
                  <div style="width: 22%; text-align: center">
                    {{ item.plateNo }}
                  </div>
                  <div style="width: 22%; text-align: center">
                    {{ item.entranceName }}
                  </div>
                  <div style="width: 30%; text-align: center">
                    {{ item.crossTimeStr }}
                  </div>
                  <div style="width: 22%; text-align: center">
                    {{ item.vehicleOutValue }}
                  </div>
                </div>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
      <div class="roominfo">
        <span class="titles">小区房屋信息</span
        ><span>(总户数:{{ roominfo.count }})</span>
        <div class="roominfo-right">
          <span class="block"></span>
          <span class="num">入住率：{{ 100 - roominfo.vacantRate }}%</span>
        </div>
        <div class="room-box">
          <div class="room-info">
            <span class="room-name">出租</span
            ><span class="room-num">{{ roominfo.leaseCount }}</span>
          </div>
          <div class="room-info">
            <span class="room-name">自住</span
            ><span class="room-num">{{ roominfo.selfCount }}</span>
          </div>
          <div class="room-info">
            <span class="room-name">空置</span
            ><span class="room-num">{{ roominfo.vacantCount }}</span>
          </div>
          <div class="room-info">
            <span class="room-name">未知</span
            ><span class="room-num">{{ roominfo.otherCount }}</span>
          </div>
        </div>
        <p class="rent-title">出租情况</p>
        <div class="rent-out">
          <div class="rentinfo">
            <span style="background: #5cc372" class="block"></span>
            <span class="num">出租 {{ roominfo.leaseRate }}%</span>
          </div>
          <div class="rentinfo">
            <span style="background: #39a0fc" class="block"></span>
            <span class="num">自住 {{ roominfo.selfRate }}%</span>
          </div>
          <div class="rentinfo">
            <span style="background: #fead3f" class="block"></span>
            <span class="num">空置 {{ roominfo.vacantRate }}%</span>
          </div>
          <div class="rentinfo">
            <span style="background: #fe6768" class="block"></span>
            <span class="num">未知 {{ roominfo.otherRate }}%</span>
          </div>
        </div>
      </div>
      <div class="carinfo">
        <span class="titles">小区车辆信息</span>
        <div class="car-statistics">
          <div class="statistics-item">
            <i class="iconfont icon-cheweiquyu"></i>
            <div>
              <p class="statistics-num">{{ carInfo.regionCount }}</p>
              <p class="statistics-title">车位区域</p>
            </div>
          </div>
          <div class="statistics-item">
            <i class="iconfont icon-cheweishuliang"></i>
            <div>
              <p class="statistics-num">{{ carInfo.parkingCount }}</p>
              <p class="statistics-title">车位数量</p>
            </div>
          </div>
          <div class="statistics-item">
            <i class="iconfont icon-cheliangzongshu"></i>
            <div>
              <p class="statistics-num">{{ carInfo.carCount }}</p>
              <p class="statistics-title">车辆总数</p>
            </div>
          </div>
        </div>
        <p class="cat-top">车牌地区比例</p>
        <div style="margin-top: 10px">
          <Thebar v-if="flags" :data="objectData" ids="carBar" />
        </div>
      </div>
    </div>
    <div style="height:20px"></div>
  </div>
</template>
<script>
import Pie from "@/components/ECharts/Pie";
import Bar from "@/components/ECharts/Bar";
import Thebar from "@/components/ECharts/Thebar";
import AgePie from "@/components/ECharts/agePie";
import lineBar from "@/components/ECharts/lineBar";
import vueSeamlessScroll from "vue-seamless-scroll";
import Map from "@/components/Map/index";
export default {
  name: "Analysis",
  components: {
    Pie,
    Bar,
    Thebar,
    lineBar,
    AgePie,
    vueSeamlessScroll,
    Map,
  },
  data() {
    return {
      lineShow: false,
      pieShow:false,
      ageColumns: [
        { prop: "ageGroup", label: "年龄分布" },
        { prop: "count", label: "人数" },
        { prop: "percentage", label: "分布百分比",
        render: (h, scope) => {
            return h("div", [scope.row.percentage + "% "]);
          }, },
      ],
      agePieList:[],
      ageTableData: [],
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      // 房屋信息
      roominfo: {},
      objectData: {
        item: [],
        list: [],
      },
      carInfo: {},
      listData: [],
      zoneName: "1",
      tabsOne: "education",
      // 车辆进出数据
      carInOut: {},
      flag: false,
      flags: false,
      data: {
        line: [],
        in: [],
        out: [],
      },
      activeName: "1",
      color: "#5cc372",
      colorTow: "#edf9ef",
      width: "50%",
      // 小区人口统计数据
      progressList: [],
      pieData: [
        { value: null, name: "常住人口" },
        { value: null, name: "流动人口" },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      if (from.path == "/login") {
        location.reload();
      }
    });
  },
  mounted() {},
  created() {
    this.$request.buildingPopulation().then((res) => {
      this.flag = false;
      if (res.data.status == 200) {
        this.progressList = res.data.data;
        this.pieData[0].value = this.progressList.permanent;
        this.pieData[1].value = this.progressList.flow;
        this.flag = true;
        for (var i = 0; i < this.progressList.flowList.length; i++) {
          if (this.progressList.flowList[i].count >= 100) {
            this.progressList.flowList[i].permanent = 100;
          } else {
            this.progressList.flowList[i].permanent =
              this.progressList.flowList[i].count;
          }
        }
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.$request.buildingStatistics().then((res) => {
      if (res.data.status == 200) {
        this.roominfo = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.$request.parkingCar().then((res) => {
      this.flags = false;
      if (res.data.status == 200) {
        this.carInfo = res.data.data;
        for (var i = 0; i < this.carInfo.list.length; i++) {
          this.objectData.item.push(this.carInfo.list[i].plateProvince);
          this.objectData.list.push(this.carInfo.list[i].carCount);
        }
        this.flags = true;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.$request.faceVehicle().then((res) => {
      if (res.data.status == 200) {
        this.carInOut = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
     this.$request.ageStatistics().then((res) => {
      if (res.data.status == 200) {
        
        this.ageTableData = res.data.data;
        res.data.data.map(res =>{
          this.agePieList.push({
            value: res.count,
             name:res.ageGroup
          })
        })
        this.pieShow = true;
      } else {
        this.$message.error(res.data.msg);
      }
    });

    this.getCarLine();
  },
  watch: {
    zoneName: {
      handler(newValue, oldValue) {
        this.getCarLine();
      },
      //,deep: true
    },
  },
  methods: {
    // 获取车辆进出趋势
    getCarLine() {
      this.lineShow = false;
      this.$request.vehicleTrend(this.zoneName).then((res) => {
        if (res.data.status == 200) {
          this.data = {
            line: [],
            in: [],
            out: [],
          };
          res.data.data.map((res) => {
            this.data.line.push(res.time);
            this.data.in.push(res.in);
            this.data.out.push(res.out);
          });
          this.lineShow = true;
          console.log(this.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    format(percentage) {
      return "";
    },
    choosePlace(str) {
      this.tabsOne = str;
    },
    getPosi(lng, lat, address) {
      console.log(lng);
      console.log(lat);
      console.log(address);
    },
  },
  computed: {
    optionSingleHeight() {
      return {
        step: 0.3,
      };
    },
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.pie-info {
  vertical-align: top;
  .num-title {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  .pie-num {
    font-size: 28px;
    font-weight: 700;
    color: #333333;
  }
  .pie-right {
    height: 20px;
    line-height: 20px;
    .block {
      display: inline-block;
      width: 8px;
      height: 8px;
    }
    .num {
      font-size: 12px;
      font-weight: 400;
      color: #333333;
    }
  }
}
.seamless-warp {
  height: 160px;
  overflow: hidden;
}
.pedestrian-people {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}
.pedestrian-peoples {
  display: flex;
  justify-content: space-around;
  div {
    width: 24%;
    text-align: center;
  }
}
.both {
  display: inline-block;
  // height: 110vh;
}
.date {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  margin-right: 20px;
  color: #999999;
}
.title {
  font-size: 16px;
  font-weight: 700;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  padding: 16px 0 0 24px;
  color: #000;
}
.titlein {
  font-size: 16px;
  font-weight: 700;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  padding: 16px 0 0 0;
  color: #000;
}
.title-people {
  font-size: 16px;
  font-weight: 700;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  padding: 0 0 0 20px;
  color: #000;
}
.titles {
  font-size: 16px;
  font-weight: 700;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  color: #000;
}
.choose {
  background: #39a0fc;
  color: #fff;
}
.nochoose {
  background: #e9f5ff;
  color: #333;
}
.infochoose {
  background: #5cc372;
  color: #fff;
}
.noinfochoose {
  background: #edf9ef;
  color: #333;
}
.contant {
  display: flex;
  justify-content: space-between;
  // width: 100%;
  .left {
    width: 25%;
    .peoplenum {
      border-radius: 4px;
      // width: 100%;
      height: 480px;
      background: #fff;
      .place {
        padding-left: 5px;
        p {
          width: 95%;
          height: 24px;
          padding: 0 2% 0 2%;
          margin: 0 0 10px 0;
          line-height: 24px;
          text-align: center;
          font-size: 12px;
          // cursor: pointer;
          display: inline-block;
        }
      }
      .peopleinfo {
        // width: 100%;
        padding: 0 2% 0 2%;
        margin-top: 10px;
        p {
          width: 31%;
          height: 24px;
          cursor: pointer;
          margin: 10px 0 10px 0;
          line-height: 24px;
          text-align: center;
          font-size: 12px;
          display: inline-block;
        }
      }
    }
    .peopleage {
      background: #fff;
      border-radius: 4px;
      height: 550px;
      margin-top: 16px;
    }
  }
  .center {
    width: 48%;
    .map {
      border-radius: 4px;
      // width: 100%;
      padding: 10px;
      height: 460px;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .statistic {
      // width: 92%;
      border-radius: 4px;
      height: 549px;
      margin-top: 16px;
      background: #fff;
      padding: 0 24px 0 24px;
    }
  }
  .right {
    width: 25%;
    .today {
      padding: 24px;
      height: 432px;
      border-radius: 4px;
      background: #fff;
      .statistics {
        height: 77px;
        line-height: 77px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
      .today-in {
        height: 48px;
        line-height: 48px;
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        i {
          font-size: 40px;
          color: #5cc372;
        }
        .in-both {
          font-size: 24px;
          font-weight: 700;
          color: #333333;
          span {
            margin-left: 5px;
            font-size: 14px;
            font-weight: 400;
            color: #5cc372;
          }
        }
        .in-people {
          text-align: center;
          p {
            height: 24px;
            line-height: 24px;
            font-size: 14px;
          }
        }
      }
      .today-out {
        margin-top: 20px;
        height: 48px;
        line-height: 48px;
        display: flex;
        justify-content: space-between;
        i {
          font-size: 40px;
          color: #39a0fc;
        }
        .in-both {
          font-size: 24px;
          font-weight: 700;
          color: #333333;
          span {
            margin-left: 5px;
            font-size: 14px;
            font-weight: 400;
            color: #39a0fc;
          }
        }
        .in-people {
          text-align: center;
          p {
            height: 24px;
            line-height: 24px;
            font-size: 14px;
          }
        }
      }
    }
    .pedestrian {
      height: 528px;
      background: #ffffff;
      border-radius: 4px;
      margin-top: 16px;
      padding: 16px 24px;
      p {
        font-size: 14px;
        font-weight: 400;
        margin: 16px 0 8px 0;
      }
      span {
        display: block;
        margin-top: 10px !important;
      }
    }
  }
}
.roominfo {
  height: 145px;
  border-radius: 4px;
  margin-top: 16px;
  padding: 24px;
  background: #fff;
}
.progress {
  width: 100%;
  // text-align: center;
  display: flex;
  justify-content: space-between;
}
.progress-line {
  width: 35%;
  height: 24px;
  display: inline-block;
}
/deep/.el-progress-bar {
  padding: 0;
}
.roominfo-right {
  height: 20px;
  line-height: 20px;
  float: right;
  .block {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #39a0fc;
    margin-right: 3px;
  }
  .num {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    float: right;
  }
}
.room-box {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
}
.rent-title {
  margin-top: 10px;
  margin-bottom: 5px;
}
.rent-out {
  display: flex;
  justify-content: space-between;
  // margin-top:15px;
  .rentinfo {
    height: 20px;
    line-height: 20px;
    float: right;
    .block {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 3px;
    }
    .num {
      font-size: 10px;
      font-weight: 400;
      color: #333333;
      float: right;
    }
  }
}
.room-info {
  background: #e9f5ff;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  width: 45%;
  margin-top: 8px;
  display: inline-block;
  .room-name {
    float: left;
    margin-left: 5px;
  }
  .room-num {
    float: right;
    margin-right: 5px;
  }
}
.carinfo {
  height: 310px;
  border-radius: 4px;
  margin-top: 16px;
  padding: 16px 24px;
  background: #fff;
  .carUnm {
    font-size: 14px;
    margin-top: 16px;
    span {
      font-size: 28px;
      color: #333333;
      margin-left: 24px;
    }
  }
  .plate-number {
    font-size: 14px;
    margin-top: 20px;
  }
  .other {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .other-block {
      width: 28%;
      display: inline-block;
      .other-info {
        // width: 100%;
        margin-top: 8px;
        .other-num {
          font-size: 14px;
          font-weight: 400;
          float: left;
          color: #333333;
        }
        .other-progress {
          font-size: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          float: right;
          color: #5cc372;
        }
      }
      .other-line {
        // width: 100%;
        height: 8px;
        margin-top: 30px;
        font-size: 0;
        .line-both {
          height: 100%;
          display: inline-block;
        }
      }
    }
  }
}
/deep/.el-table th {
  padding: 0;
}
/deep/.el-radio-button__inner {
  border: none !important;
}
.choose-date {
  text-align: right;
}
.car-item {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 16px;
}
.cat-top {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-top: 27px;
}
.car-statistics {
  display: flex;
  justify-content: space-around;
  margin-top: 35px;
  .statistics-item {
    i {
      font-size: 40px;
      color: #5cc372;
    }
    div {
      display: inline-block;
      // margin-left: 5px;
      text-align: center;
      .statistics-num {
        font-size: 20px;
        font-weight: 700;
        color: #333333;
      }
      .statistics-title {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
/deep/.common-table {
  margin-top: 0 !important;
}
/deep/.el-table td,
.el-table th {
  padding: 0;
}
</style>
