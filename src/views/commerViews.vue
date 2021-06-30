<template>
  <div class="content">
    <div class="header">
      <span class="name">勾庄佳苑安防大数据分析平台</span>
      <div class="head-date">
        <div class="head-time">
          <p>{{ nowDate }}</p>
          <p>{{ nowWeek }}</p>
        </div>
        <p class="time">{{ nowTime }}</p>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <!-- 果壳箱 -->
        <div class="shuck baimg">
          <div class="title">
            <span>果壳箱</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="shuk-num">
            <div class="num-item">
              <i class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">布控</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">正常</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ecf529" class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ff0e00" class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">43</p>
              </div>
            </div>
          </div>
          <div class="shuk-static"><Calendar ids="shukStatic" /></div>
        </div>
        <!-- 智慧井盖 -->
        <div class="shuck baimg">
          <div class="title">
            <span>智慧井盖</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="shuk-num">
            <div class="num-item">
              <i class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">布控</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">正常</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ecf529" class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ff0e00" class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">43</p>
              </div>
            </div>
          </div>
          <div class="shuk-static">
            <manholeBar :data="data" title="警情趋势" ids="manhole" />
          </div>
        </div>
        <!-- 人员进出 -->
        <div class="people baimg">
          <div class="title">
            <span>人员进出</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div
            style="width: 45%; padding: 15px 15px 0 0; display: inline-block"
          >
            <div
              class="pedestrian-peoples"
              style="background: #fff6e9; padding: 3px 1px"
            >
              <div style="width: 22%; text-align: center">姓名</div>
              <div style="width: 22%; text-align: center">位置</div>
              <div style="width: 30%; text-align: center">时间</div>
              <div style="width: 22%; text-align: center">进/出</div>
            </div>
            <vue-seamless-scroll
              :class-option="optionSingleHeight"
              :data="list"
              class="seamless-warp"
            >
              <ul class="item">
                <li v-for="(item, index) in list" :key="index">
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
                    <div style="width: 22%; text-align: center; color: red">
                      {{ item.vehicleOutValue }}
                    </div>
                  </div>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
          <div class="people-static">
            <bar
              :data="peopleData"
              :isCommer="true"
              titleColor="#fff"
              :height="200"
              title=""
              ids="people"
            />
          </div>
        </div>
      </div>

      <div class="center">
        <!-- 设备建设概况 -->
        <div class="equipment">
          <p class="equipment-title">设备建设概况</p>
          <div class="pie-static" style="width: 30%; display: inline-block">
            <Pie :datas="pieData" titleColor="#fff" ids="equipmentPie" />
          </div>
          <div class="pie-info" style="width: 69%; display: inline-block">
            <div class="info-item">
              <span style="background: #39a0fc" class="block"></span
              ><span class="text">摄像头</span><span class="text">61%</span
              ><span class="text">122</span>
            </div>
            <div class="info-item">
              <span style="background: #fbd437" class="block"></span
              ><span class="text">果壳箱</span><span class="text">61%</span
              ><span class="text">122</span>
            </div>
            <div class="info-item">
              <span style="background: #4ecb73" class="block"></span
              ><span class="text">智慧烟感</span><span class="text">61%</span
              ><span class="text">122</span>
            </div>
            <div class="info-item">
              <span style="background: #a53ff5" class="block"></span
              ><span class="text">智慧井盖</span><span class="text">61%</span
              ><span class="text">122</span>
            </div>
          </div>
        </div>
        <!-- 警报 -->
        <div class="alarm">
          <div class="alarm-title">
            <p>警</p>
            <span>报</span>
          </div>
          <div class="alarm-info">
            <p>今天8:30：2号果壳箱未清运已超过3天，请尽快清运！</p>
            <p>今天9:30：小区北门监控到有居民高空抛物，请核实！</p>
            <p>现在：06幢2单元2号电梯有电瓶车进入，请即刻处理！</p>
          </div>
        </div>
        <!-- 地图 -->
        <div class="map" style="text-align:center"><img style="height:100%" src="../../src/assets/7.png" alt=""></div>
        <!-- 车辆进出 -->
        <div class="people baimg">
          <div class="title">
            <span>车辆进出</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div
            style="width: 45%; padding: 15px 15px 0 0; display: inline-block"
          >
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
              :data="list"
              class="seamless-warp"
            >
              <ul class="item">
                <li v-for="(item, index) in list" :key="index">
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
                    <div style="width: 22%; text-align: center; color: red">
                      {{ item.vehicleOutValue }}
                    </div>
                  </div>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
          <div class="people-static">
            <bar
              :data="peopleData"
              :isCommer="true"
              titleColor="#fff"
              :height="200"
              title=""
              ids="car"
            />
          </div>
        </div>
      </div>

      <div class="right">
        <!-- 摄像头 -->
        <div class="camera baimg">
          <div class="title">
            <span>摄像头</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="camera-static">
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/1.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑北门口告警</p>
              <p class="discrip-info">描述：人员聚集</p>
            </div>
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/2.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑13幢摄像头待检修</p>
              <p class="discrip-info">描述：摄像头故障</p>
            </div>
          </div>
          <div class="camera-num">
            <div class="num-item">
              <i class="iconfont icon-shexiangtou-blue"></i>
              <div>
                <p class="classily">布控</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i class="iconfont icon-shexiangtou-blue"></i>
              <div>
                <p class="classily">正常</p>
                <p style="color: #56e4ff">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ecf529" class="iconfont icon-shexiangtou-blue"></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ff0e00" class="iconfont icon-shexiangtou-blue"></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">43</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 高空抛物 -->
        <div class="camera baimg">
          <div class="title">
            <span>高空抛物</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="camera-statics">
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/2.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑12幢二单元</p>
            </div>
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/3.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑12幢二单元</p>
            </div>
          </div>
        </div>
        <!-- 电梯电瓶车 -->
        <div class="camera baimg">
          <div class="title">
            <span>电梯电瓶车</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="camera-statics">
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/4.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑06幢二单元2号电梯</p>
            </div>
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>01/18 15:23</span></p>
              <div class="camera-img"><img src="../../src/assets/5.png" alt=""></div>
              <p class="discrip-info">地址：勾庄佳苑06幢二单元2号电梯</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";
import manholeBar from "@/components/ECharts/manholeBar";
import Calendar from "@/components/ECharts/calendar";
import Bar from "@/components/ECharts/Bar";
import Pie from "@/components/ECharts/Pie";
export default {
  name: "commerViews",
  components: {
    Calendar,
    manholeBar,
    vueSeamlessScroll,
    Bar,
    Pie,
  },
  data() {
    return {
      pieData: [
        { value: 34, name: "摄像头" },
        { value: 56, name: "果壳箱" },
        { value: 11, name: "智慧烟感" },
        { value: 23, name: "智慧井盖" },
      ],
      list: [
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
        {
          plateNo: "232",
          entranceName: "34343",
          crossTimeStr: "q3242",
          vehicleOutValue: "232323",
        },
      ],
      data: {
        time: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        list: [23, 23, 14, 23, 67],
      },
      peopleData: {
        line: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        in: [23, 23, 14, 23, 67],
        out: [11, 34, 21, 23, 56],
      },
      nowDate: "",
      nowTime: "",
      nowWeek: "",
    };
  },
  mounted() {
    this.nowTimes();
  },
  methods: {
    timeFormate(timeStamp) {
      let wk = timeStamp.getDay();
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let week = weeks[wk];
      this.nowTime = hh + ":" + mm + ":" + ss;
      this.nowDate = month + "-" + date;
      this.nowWeek = week;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
  },
  computed: {
    optionSingleHeight() {
      return {
        step: 0.3,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #000836;
}
.header {
  background: url("../../src/assets/head.png") no-repeat;
  // width: 100%;
  height: 74px;
  // text-align: center;
  line-height: 74px;
  padding: 0 20px 0 40%;
  .name {
    background: linear-gradient(180deg, #4fd2fe, #2f98fe);
    -webkit-background-clip: text;
    color: transparent;
    /*定义文本颜色为透明*/
    font-weight: bolder;
    /*文本加粗*/
    font-size: 30px;
  }
  .head-date {
    float: right;
    color: #fff;
    .head-time {
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
      p {
        height: 25px;
        font-size: 15px;
        text-align: center;
        line-height: 25px;
        background: linear-gradient(180deg, #4fd2fe, #2f98fe);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
      }
    }
    .time {
      display: inline-block;
      background: linear-gradient(180deg, #4fd2fe, #2f98fe);
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bolder;
      vertical-align: top;
      font-size: 23px;
      height: 50px;
      line-height: 50px;
    }
  }
}
.body {
  padding: 25px 0 0 0;
  display: flex;
  justify-content: space-around;
  .left {
    width: 31%;
    .shuck {
      height: 305px;
      .shuk-num {
        height: 245px;
        display: inline-block;
        margin: 16px 5px 16px 16px;
        width: 15%;
        .num-item {
          margin-bottom: 24px;
          i {
            font-size: 20px;
            vertical-align: middle;
          }
          div {
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
            .classily {
              color: #fff;
            }
          }
        }
      }
      .shuk-static {
        vertical-align: top;
        display: inline-block;
        height: 245px;
        width: 77%;
        // background: #fff;
      }
    }
  }
  .center {
    width: 32%;
    // height: 30px;
    .equipment {
      width: 100%;
      height: 180px;
      background: linear-gradient(
        90deg,
        rgba(86, 228, 255, 0),
        rgba(86, 228, 255, 0.15) 49%,
        rgba(86, 228, 255, 0)
      );
      .equipment-title {
        color: #fff;
        text-align: center;
        font-size: 16px;
        height: 56px;
        line-height: 56px;
      }
      .pie-static {
        height: 120px;
      }
      .pie-info {
        vertical-align: top;
        height: 120px;
        display: flex;
        justify-content: space-around;
        .info-item {
          margin-top: 30px;
          width: 49%;
          justify-content: space-around;
          display: inline-flex;
          .block {
            // display: inline-block;
            width: 12px;
            height: 12px;
            margin-top: 3px;
            order: 1px solid #ffffff;
            border-radius: 3px;
          }
          .text {
            color: #fff;
            font-size: 12px;
            margin-left: 5px;
          }
        }
      }
    }
    .alarm {
      width: 100%;
      // background: #fff;
      height: 100px;
      margin-top: 19px;
      display: flex;
      justify-content: space-between;
      .alarm-title {
        padding-top: 10px;
        width: 8%;
        height: 90px;
        background: rgba(255, 94, 94, 0.3);
        border: 1px solid #ff5e5e;
        text-align: center;
        line-height: 40px;
        color: #ff5e5e;
        font-size: 20px;
      }
      .alarm-info {
        width: 86%;
        height: 100px;
        opacity: 1;
        background: rgba(254, 199, 33, 0.3);
        border: 1px solid #fec721;
        p {
          margin: 11px 0 0 24px;
          color: #fff;
        }
      }
    }
    .map {
      width: 100%;
      height: 361px;
      // background: #fff;
    }
  }
  .right {
    width: 31%;
    .camera {
      height: 296px;
      .camera-num {
        height: 245px;
        display: inline-block;
        margin: 16px 5px 16px 30px;
        width: 13%;
        .num-item {
          margin-bottom: 22px;
          i {
            font-size: 20px;
            vertical-align: middle;
          }
          div {
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
            .classily {
              color: #fff;
            }
          }
        }
      }
      .camera-statics{
        vertical-align: top;
        height: 245px;
        width: 94%;
        // background: #fff;
        display: inline-flex;
        padding: 16px 20px;
        justify-content: space-around;
        .camera-info {
          width: 45%;
          .discrip {
            font-size: 12px;
            color: #56e4ff;
            span{
              float: right;
              color: #fff;
            }
          }
          .camera-img{
            padding: 7px;
            width: 94%;
            border: 1px solid #56e4ff;
            height: 130px;
            margin-top: 10px;
            margin-bottom: 15px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .discrip-info{
            font-size: 12px;
            color: #fff;
            margin-top: 8px;
          }
        }
      }
      .camera-static {
        vertical-align: top;
        height: 245px;
        width: 73%;
        // background: #fff;
        display: inline-flex;
        justify-content: space-between;
        padding: 16px 20px 0;
        .camera-info {
          width: 47%;
          .discrip {
            font-size: 12px;
            color: #56e4ff;
            span{
              float: right;
              color: #fff;
            }
          }
          .camera-img{
            padding: 7px;
            width: 90%;
            border: 1px solid #56e4ff;
            height: 120px;
            margin-top: 10px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .discrip-info{
            font-size: 12px;
            color: #fff;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
.baimg:before {
  content: "";
  display: table;
}
.baimg {
  background: url("../../src/assets/frame.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 25px;
  color: #56e4ff;
  .title {
    background: rgba(86, 228, 255, 0.1);
    height: 40px;
    padding: 0 16px;
    line-height: 40px;
    margin: 3px 4px 0 4px;
    border: 1px;
    i {
      float: right;
    }
  }
}
.pedestrian-peoples {
  display: flex;
  justify-content: space-around;
  background: none !important;
  div {
    width: 24%;
    text-align: center;
    color: #fff;
  }
}
.seamless-warp {
  height: 190px;
  overflow: hidden;
}
.pedestrian-people {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  color: #fff;
}
.people {
  .people-static {
    width: 50%;
    height: 210px;
    margin-top: 20px;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
