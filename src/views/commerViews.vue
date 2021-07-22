<template>
  <div class="content">
    <div class="header">
      <span class="name">勾庄佳苑安防大数据分析平台</span>
      <div class="head-date">
        <div
          style="display: inline-block; margin-right: 10px"
          @click="fullScreen"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="全屏"
            placement="bottom"
            ><i class="fa fa-arrows-alt fa-lg" style="color: #2f98fe"></i
          ></el-tooltip>
        </div>
        <div class="head-time">
          <p>{{ nowDate }}</p>
          <p>{{ nowWeek }}</p>
        </div>
        <p class="time">{{ nowTime }}</p>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <!-- 智能垃圾分类箱 -->
        <div class="shuck baimg">
          <div class="title">
            <span>智能垃圾分类箱</span>
            <i class="iconfont icon-more" @click="showDialog('shuck')"></i>
          </div>
          <div class="shuk-num">
            <div class="num-item">
              <i class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">布控</p>
                <p style="color: #56e4ff">{{ newDayList.cover }}</p>
              </div>
            </div>
            <div class="num-item">
              <i class="iconfont icon-guokexiang-yellow"></i>
              <div>
                <p class="classily">正常</p>
                <p style="color: #56e4ff">{{ newDayList.normal }}</p>
              </div>
            </div>
            <div class="num-item">
              <i
                style="color: #ecf529"
                class="iconfont icon-guokexiang-yellow"
              ></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">{{ newDayList.repair }}</p>
              </div>
            </div>
            <div class="num-item">
              <i
                style="color: #ff0e00"
                class="iconfont icon-guokexiang-yellow"
              ></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">{{ newDayList.countAlarm }}</p>
              </div>
            </div>
          </div>
          <div class="shuk-static">
            <!-- <Calendar :data="shukData" ids="shukStatic" /> -->
            <div class="static-mounth">
              <span>{{ nowYear }}</span>
            </div>
            <div class="static-day">
              <p class="static-week">
                <span>周日</span><span>周一</span><span>周二</span
                ><span>周三</span><span>周四</span><span>周五</span
                ><span>周六</span>
              </p>
              <div class="day-box">
                <div
                  class="day-items"
                  v-for="item of blocknum"
                  :key="item"
                ></div>
                <div
                  class="day-item"
                  v-for="(item, index) in dayList"
                  :key="index + '^-^'"
                >
                  <span
                    :style="{
                      background:
                        item.type == '1'
                          ? '#56E4FF'
                          : item.type == '2'
                          ? '#ECF529'
                          : item.type == '3'
                          ? '#FF0E00'
                          : '',
                    }"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 智慧井盖 -->
        <div class="shuck baimg">
          <div class="title">
            <span>智慧井盖</span>
            <i @click="showDialog('wellLid')" class="iconfont icon-more"></i>
          </div>
          <div class="shuk-num">
            <div class="num-item">
              <i class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">布控</p>
                <p style="color: #56e4ff">{{ newCoverList.cover }}</p>
              </div>
            </div>
            <div class="num-item">
              <i class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">正常</p>
                <p style="color: #56e4ff">{{ newCoverList.normal }}</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ecf529" class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">{{ newCoverList.repair }}</p>
              </div>
            </div>
            <div class="num-item">
              <i style="color: #ff0e00" class="iconfont icon-jinggai-red"></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">{{ newCoverList.countAlarm }}</p>
              </div>
            </div>
          </div>
          <div class="shuk-statics">
            <manholeBar :data="data" title="警情趋势" ids="manhole" />
          </div>
        </div>
        <!-- 设备统计 -->
        <div class="people baimg">
          <div class="title">
            <span>设备统计</span>
            <!-- <i class="iconfont icon-more"></i> -->
          </div>
          <div style="margin: 20px 20px 20px 50px; padding-bottom: 20px">
            <Thebar
              v-if="objectDataStatic"
              :height="200"
              :axis="['设备', '数量', '数量']"
              :data="objectData"
              ids="carBar"
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
            <div
              v-for="(item, index) in pieData"
              :key="index"
              class="info-item"
            >
              <span :style="{ background: item.color }" class="block"></span>
              <span class="text">{{ item.name }}</span>
              <span class="text">{{ item.value }}</span>
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
        <Map class="map" lng="120.077561" lat="30.34998" @drag="dragMap"></Map>
        <!-- </div> -->
        <!-- 车辆/人员进出 -->
        <div class="people baimg">
          <div class="titles">
            <i class="iconfont icon-more" @click="showDialog('car')"></i>
            <el-tabs v-model="activeName">
              <!-- 车辆进出 -->
              <el-tab-pane label="车辆进出" name="first">
                <div
                  style="
                    width: 45%;
                    padding: 5px 15px 0 0;
                    display: inline-block;
                  "
                >
                  <div
                    class="pedestrian-peoples"
                    style="background: #fff6e9; padding: 3px 1px"
                  >
                    <div style="width: 20%; text-align: center">序号</div>
                    <div style="width: 18%; text-align: center">进/出</div>
                    <div style="width: 34%; text-align: center">车牌号</div>
                    <div style="width: 24%; text-align: center">时间</div>
                  </div>
                  <vue-seamless-scroll
                    :class-option="optionSingleHeight"
                    :data="carList"
                    class="seamless-warp"
                  >
                    <ul class="item">
                      <li v-for="(item, index) in carList" :key="index">
                        <div class="pedestrian-people">
                          <div style="width: 20%; text-align: center">
                            {{ item.carIndex }}
                          </div>
                          <div
                            :style="{
                              width: '18%',
                              'text-align': 'center',
                              color:
                                item.vehicleOut == 0 ? '#56E4FF' : '#56FF56',
                            }"
                          >
                            {{ item.vehicleOut == 0 ? "出" : "入" }}
                          </div>
                          <div style="width: 34%; text-align: center">
                            {{ item.plateNo }}
                          </div>
                          <div style="width: 24%; text-align: center">
                            {{ item.crossTime }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </vue-seamless-scroll>
                </div>
                <div class="people-static">
                  <bar
                    v-if="activeName == 'first'"
                    :data="carData"
                    :isCommer="true"
                    titleColor="#fff"
                    :height="200"
                    title=""
                    ids="car"
                  />
                </div>
              </el-tab-pane>
              <!-- 人员进出 -->
              <el-tab-pane label="人员进出" name="second"> </el-tab-pane>
              <div v-if="activeName == 'second'">
                <div
                  style="
                    width: 45%;
                    padding: 5px 15px 0 0;
                    display: inline-block;
                  "
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
                    :data="peopleList"
                    class="seamless-warp"
                  >
                    <ul class="item">
                      <li v-for="(item, index) in peopleList" :key="index">
                        <div class="pedestrian-people">
                          <div style="width: 22%; text-align: center">
                            {{ item.personName }}
                          </div>
                          <div style="width: 22%; text-align: center">
                            {{ item.doorName }}
                          </div>
                          <div style="width: 30%; text-align: center">
                            {{ item.receiveTime }}
                          </div>
                          <div
                            :style="{
                              width: '18%',
                              'text-align': 'center',
                              color:
                                item.inAndOutType == 0 ? '#56E4FF' : '#56FF56',
                            }"
                          >
                            {{ item.inAndOutType == 0 ? "出" : "入" }}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </vue-seamless-scroll>
                </div>
                <div class="people-static">
                  <bar
                    v-if="activeName == 'second'"
                    :data="peopleData"
                    :isCommer="true"
                    titleColor="#fff"
                    :height="200"
                    title=""
                    ids="peoples"
                  />
                </div>
              </div>
            </el-tabs>
          </div>
        </div>
      </div>

      <div class="right">
        <!-- 周界监控 -->
        <div class="camera baimg">
          <div class="title">
            <span>周界监控</span>
            <i class="iconfont icon-more" @click="showDialog('ambitus')"></i>
          </div>
          <div class="camera-static">
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/side1.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑北门口告警</p>
              <p class="discrip-info">描述：人员聚集</p>
            </div>
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/side2.png" alt="" />
              </div>
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
              <i
                style="color: #ecf529"
                class="iconfont icon-shexiangtou-blue"
              ></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i
                style="color: #ff0e00"
                class="iconfont icon-shexiangtou-blue"
              ></i>
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
            <i class="iconfont icon-more" @click="showDialog('hightoss')"></i>
          </div>
          <div class="camera-static">
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/high1.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑北门口告警</p>
              <p class="discrip-info">描述：人员聚集</p>
            </div>
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/high2.png" alt="" />
              </div>
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
              <i
                style="color: #ecf529"
                class="iconfont icon-shexiangtou-blue"
              ></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i
                style="color: #ff0e00"
                class="iconfont icon-shexiangtou-blue"
              ></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">43</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="camera baimg">
          <div class="title">
            <span>高空抛物</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="camera-statics">
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>{{ nowDate }} {{camreaTime}}</span></p>
              <div class="camera-img">
                <img src="../../src/assets/2.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑12幢二单元</p>
            </div>
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>{{ nowDate }} {{camreaTime}}</span></p>
              <div class="camera-img">
                <img src="../../src/assets/3.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑12幢二单元</p>
            </div>
          </div>
        </div> -->
        <!-- 电梯电瓶车 -->
        <div class="camera baimg">
          <div class="title">
            <span>电梯电瓶车</span>
            <i
              class="iconfont icon-more"
              @click="showDialog('electromobile')"
            ></i>
          </div>
          <div class="camera-static">
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/elevator1.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑北门口告警</p>
              <p class="discrip-info">描述：人员聚集</p>
            </div>
            <div class="camera-info">
              <p class="discrip">
                摄像头001 <span>{{ nowDate }} {{ camreaTime }}</span>
              </p>
              <div class="camera-img">
                <img src="../../src/assets/elevator2.png" alt="" />
              </div>
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
              <i
                style="color: #ecf529"
                class="iconfont icon-shexiangtou-blue"
              ></i>
              <div>
                <p class="classily">待检修</p>
                <p style="color: #ecf529">43</p>
              </div>
            </div>
            <div class="num-item">
              <i
                style="color: #ff0e00"
                class="iconfont icon-shexiangtou-blue"
              ></i>
              <div>
                <p class="classily">告警</p>
                <p style="color: #ff0e00">43</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="camera baimg">
          <div class="title">
            <span>电梯电瓶车</span>
            <i class="iconfont icon-more"></i>
          </div>
          <div class="camera-statics">
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>{{ nowDate }} {{camreaTime}}</span></p>
              <div class="camera-img">
                <img src="../../src/assets/4.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑06幢二单元2号电梯</p>
            </div>
            <div class="camera-info">
              <p class="discrip">摄像头001 <span>{{ nowDate }} {{camreaTime}}</span></p>
              <div class="camera-img">
                <img src="../../src/assets/5.png" alt="" />
              </div>
              <p class="discrip-info">地址：勾庄佳苑06幢二单元2号电梯</p>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div
      :style="{ height: isfullScreen ? '110%' : '100vh' }"
      class="dialog"
      v-if="dialogShow"
    >
      <div class="dialog-content">
        <p class="dialog-title">{{ dialogTitle }}</p>
        <!-- 垃圾箱和井盖弹窗内容 -->
        <div
          v-if="dialogStyle == 'shuck' || dialogStyle == 'wellLid'"
          class="dialog-body"
        >
          <div v-if="dialogStyle == 'shuck'" class="body-top">
            <div class="top-static">
              今日累计清运次数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              今日累计减少清运次数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              今日开箱次数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              当前满溢率<span></span><span>1</span><span>3</span>%
            </div>
          </div>
          <div v-else class="body-top">
            <div class="top-static">
              设备在线数<span></span><span>2</span><span>1</span>个
            </div>
            <div class="top-static">
              设备告警次数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              设备消警次数<span></span><span></span><span>0</span>次
            </div>
          </div>
          <div class="body-bottom">
            <div class="body-left">
              <DiMap @getLnglat="getPosi" height="550"></DiMap>
              <div class="equipment-list">
                <div
                  class="pedestrian-peoples"
                  style="background: #fff6e9; padding: 3px 1px"
                >
                  <div
                    style="
                      width: 20%;
                      text-align: left;
                      color: #56e4ff;
                      margin-bottom: 5px;
                    "
                  >
                    设备编号
                  </div>
                  <div
                    style="
                      width: 44%;
                      text-align: left;
                      color: #56e4ff;
                      margin-bottom: 5px;
                    "
                  >
                    地址
                  </div>
                  <div
                    style="
                      width: 18%;
                      text-align: left;
                      color: #56e4ff;
                      margin-bottom: 5px;
                    "
                  >
                    状态
                  </div>
                  <div
                    style="
                      width: 14%;
                      text-align: left;
                      color: #56e4ff;
                      margin-bottom: 5px;
                    "
                  >
                    负责人
                  </div>
                </div>
                <ul class="item">
                  <li
                    v-for="(item, index) in dialogStyle == 'shuck'
                      ? equipmentList
                      : mentList"
                    :key="index"
                  >
                    <div class="pedestrian-people">
                      <el-tooltip
                        class="items"
                        effect="dark"
                        :content="item.deviceCode"
                        placement="top-start"
                      >
                        <div class="peopel-code">
                          {{ item.deviceCode }}
                        </div>
                      </el-tooltip>
                      <div style="width: 44%">
                        {{ item.installAddr }}
                      </div>
                      <div
                        :style="{
                          width: '18%',
                          color:
                            item.deviceUseStatus == 1
                              ? '#56E4FF'
                              : item.deviceUseStatus == 2
                              ? '#909399'
                              : item.deviceUseStatus == 3
                              ? '#E6A23C'
                              : item.deviceUseStatus == 4
                              ? '#F56C6C'
                              : '#56E4FF',
                        }"
                      >
                        {{
                          item.deviceUseStatus == 1
                            ? "正常"
                            : item.deviceUseStatus == 2
                            ? "离线"
                            : item.deviceUseStatus == 3
                            ? "故障"
                            : item.deviceUseStatus == 3
                            ? "报废"
                            : "其他"
                        }}
                      </div>
                      <div style="width: 14%">
                        {{ item.contactPerson ? item.contactPerson : "无" }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="body-right">
              <div class="body-static">
                <p class="static-title">
                  {{
                    dialogStyle == "shuck" ? "垃圾箱警告详情" : "井盖警告详情"
                  }}
                </p>
                <div v-if="dialogStyle == 'shuck'" class="static-list">
                  <p>
                    【1号垃圾桶】满溢，请求清运
                    <span class="static-stype">未处理</span>
                    2021/01/1810：24：00
                  </p>
                  <p>
                    【1号垃圾桶】满溢，请求清运
                    <span class="static-stype">未处理</span>
                    2021/01/1810：24：00
                  </p>
                  <p>
                    【1号垃圾桶】满溢，请求清运
                    <span class="static-stype">未处理</span>
                    2021/01/1810：24：00
                  </p>
                  <p>
                    【1号垃圾桶】满溢，请求清运
                    <span class="static-stype">未处理</span>
                    2021/01/1810：24：00
                  </p>
                </div>
                <div v-else class="static-list">
                  <p>
                    ZHJG09 | 勾庄佳苑15幢2单元
                    <span style="color: #ecf529">倾斜角66°</span>
                    <span class="static-stype">角度警告</span>
                    10：24：00
                  </p>
                  <p>
                    ZHJG04 | 勾庄佳苑09幢1单元
                    <span style="color: #ecf529">电量30%</span
                    ><span class="static-stype">电量警告</span>
                    10：24：00
                  </p>
                  <p>
                    ZHJG09 | 勾庄佳苑15幢2单元
                    <span style="color: #ecf529">倾斜角66°</span>
                    <span class="static-stype">角度警告</span>
                    10：24：00
                  </p>
                  <p>
                    ZHJG04 | 勾庄佳苑09幢1单元
                    <span style="color: #ecf529">电量30%</span
                    ><span class="static-stype">电量警告</span>
                    10：24：00
                  </p>
                </div>
              </div>
              <!-- <div class="body-alarm"></div> -->
            </div>
          </div>
        </div>
        <!-- 高空抛物和电梯电瓶车 -->
        <div
          v-if="
            dialogStyle == 'hightoss' ||
            dialogStyle == 'electromobile' ||
            dialogStyle == 'ambitus'
          "
          class="dialog-body"
        >
          <div class="body-top">
            <div class="top-static">
              累计上报数<span></span><span></span><span>0</span>个
            </div>
            <div class="top-static">
              累计立案数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              累计处理数<span></span><span></span><span>0</span>次
            </div>
            <div class="top-static">
              累计结案数<span></span><span></span><span>0</span>次
            </div>
          </div>
          <div class="body-bottom">
            <div style="width: 55%" class="body-lefthightoss">
              <p class="thightoss-title">
                {{
                  dialogStyle == "hightoss"
                    ? "高空抛物案卷处理"
                    : dialogStyle == "ambitus"
                    ? "监控案卷处理"
                    : "电梯电瓶车案卷处理"
                }}
              </p>
              <div class="camera-statics">
                <div
                  v-for="(item, index) in dialogStyle == 'hightoss'
                    ? cameraHeightList
                    : dialogStyle == 'ambitus'
                    ? cameraSideList
                    : cameraElevatorList"
                  :key="index"
                  class="camera-info"
                >
                  <p class="discrip">
                    {{ item.camera }}<span>{{ nowDate }} {{ camreaTime }}</span>
                  </p>
                  <div class="camera-img">
                    <img
                      :src="item.src"
                      alt=""
                    />
                  </div>
                  <p class="discrip-info">地址：{{ item.discrip }}</p>
                </div>
              </div>
            </div>
            <div style="width: 43%" class="body-lefthightoss">
              <p class="thightoss-title">案卷处理概况</p>
              <div class="thightoss-static">
                <LineDialog
                  :data="lineData"
                  :isCommer="true"
                  titleColor="#fff"
                  :height="460"
                  title=""
                  ids="hightoss"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 车辆进出 -->
        <div v-if="dialogStyle == 'car'" class="dialog-body">
          <div v-if="dialogStyle == 'car'" class="body-top">
            <div class="top-static">
              车辆进入数量<span></span><span></span><span>0</span>
            </div>
            <div class="top-static">
              车辆外出数量<span></span><span></span><span>0</span>
            </div>
            <div class="top-static">
              可疑车辆<span></span><span></span><span>0</span>
            </div>
          </div>
          <div class="body-bottom">
            <div style="width: 55%;overflow:auto" class="body-lefthightoss">
              <p class="thightoss-title">车辆出行记录</p>
              <div class="equipment-lists">
                <div class="pedestrian-otherpeoples" style="padding: 3px 1px">
                  <div style="width: 15%">车牌号</div>
                  <div style="width: 15%">位置</div>
                  <div style="width: 10%">放行结果</div>
                  <div style="width: 10%">出入</div>
                  <div style="width: 10%">车辆类型</div>
                  <div style="width: 10%">时间</div>
                </div>
                <ul  class="item">
                  <li v-for="(item, index) in carList" :key="index">
                    <div class="pedestrian-people">
                      <div style="width: 15%">
                        {{ item.plateNo }}
                      </div>
                      <div style="width: 15%">
                        {{ item.entranceName }}
                      </div>
                      <div
                        :style="{
                          width: '10%',
                          color:
                            item.releaseResult == 0
                              ? '#F56C6C'
                              : item.releaseResult == 1
                              ? '#67C23A'
                              : '#909399',
                        }"
                      >
                        {{
                          item.releaseResult == 0
                            ? "未放行"
                            : item.releaseResult == 1
                            ? "正常放行"
                            : "离线放行"
                        }}
                      </div>
                      <div style="width: 10%">
                        {{ item.vehicleOut == 0 ? "进" : "出" }}
                      </div>
                      <div style="width: 10%">
                        {{ item.vehicleType == 0?'其他车':item.vehicleType == 1?'小型车':item.vehicleType == 2?'大型车':'摩托车' }}
                      </div>
                      <div style="width: 10%">
                        {{ item.crossTime }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="body-right">
              <div class="body-alarm" style="margin-bottom: 32px">
                <p class="alarm-title">车辆进入趋势</p>
                <div class="car-static">
                  <LineDialog
                    :data="carLineData"
                    :isCommer="true"
                    titleColor="#fff"
                    :height="200"
                    title=""
                    ids="carIn"
                  />
                </div>
              </div>
              <div class="body-alarm">
                <p class="alarm-title">车辆外出趋势</p>
                <div class="car-static">
                  <LineDialog
                    :data="carLineData"
                    :colorList="['#ECF529']"
                    :isCommer="true"
                    titleColor="#fff"
                    :height="200"
                    title=""
                    ids="carOut"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="close"><span @click="closeDialog">关闭窗口</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import Thebar from "@/components/ECharts/Thebar";
import vueSeamlessScroll from "vue-seamless-scroll";
import manholeBar from "@/components/ECharts/manholeBar";
import Calendar from "@/components/ECharts/calendar";
import Bar from "@/components/ECharts/Bar";
import LineDialog from "@/components/ECharts/lineDialog";
import Pie from "@/components/ECharts/Pie";
import Map from "@/components/Map/comMap";
import DiMap from "@/components/Map/index";
export default {
  name: "commerViews",
  components: {
    Calendar,
    manholeBar,
    vueSeamlessScroll,
    Bar,
    Pie,
    Map,
    DiMap,
    Thebar,
    LineDialog,
  },
  data() {
    return {
      cameraHeightList: [
        {
          src: require("../../src/assets/high1.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/high2.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/high3.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/high4.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/high5.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/high6.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
      ],
      cameraElevatorList: [
        {
          src: require("../../src/assets/elevator1.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/elevator2.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/elevator3.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/elevator4.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/elevator5.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/elevator6.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
      ],
      cameraSideList: [
        {
          src: require("../../src/assets/side1.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/side2.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/side3.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/side4.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/side5.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
        {
          src: require("../../src/assets/side6.png"),
          camera: "摄像头001",
          discrip: "勾庄佳苑06幢二单元2号电梯",
        },
      ],
      objectDataStatic: false,
      dialogTitle: "",
      dialogStyle: "",
      // 车辆弹窗数据（表格）
      carStaticList: [
        {
          carNumber: "LJT101",
          isUserCar: true,
          isNormal: false,
          inOrOut: "in",
          carLocation: "杭州",
          time: "18:45",
        },
        {
          carNumber: "LJT101",
          isUserCar: false,
          isNormal: true,
          inOrOut: "in",
          carLocation: "杭州",
          time: "18:45",
        },
        {
          carNumber: "LJT101",
          isUserCar: false,
          isNormal: true,
          inOrOut: "in",
          carLocation: "杭州",
          time: "18:45",
        },
        {
          carNumber: "LJT101",
          isUserCar: true,
          isNormal: false,
          inOrOut: "in",
          carLocation: "杭州",
          time: "18:45",
        },
      ],
      // 智能垃圾箱数据
      equipmentList: [
        {
          carIndex: "LJT101",
          inOrOut: true,
          address: "勾庄佳苑13幢1单元",
          people: "杨淑芬",
        },
        {
          carIndex: "LJT101",
          inOrOut: true,
          address: "勾庄佳苑13幢1单元",
          people: "杨淑芬",
        },
        {
          carIndex: "LJT101",
          inOrOut: false,
          address: "勾庄佳苑13幢1单元",
          people: "杨淑芬",
        },
      ],
      // 智能井盖数据
      mentList: [
        {
          carIndex: "LJT101",
          inOrOut: true,
          address: "勾庄3幢1单元",
          people: "杨",
        },
        {
          carIndex: "LJT101",
          inOrOut: false,
          address: "勾庄佳苑13幢1单元",
          people: "杨淑芬",
        },
        {
          carIndex: "LJT101",
          inOrOut: false,
          address: "勾庄佳苑13幢1单元",
          people: "杨淑芬",
        },
      ],
      // 弹窗显示
      dialogShow: false,
      // 设备状态统计数据
      objectData: {
        item: ["2323", "223", "767", "2323", "223", "767"],
        list: ["2323", "223", "767", "2323", "223", "767"],
      },
      newDayList: [],
      // 新的日历数据
      dayList: [
        { type: "1" },
        { type: "1" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "1" },
        { type: "1" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "1" },
        { type: "1" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
        { type: "2" },
        { type: "1" },
        { type: "2" },
        { type: "3" },
      ],
      // 旧的日历数据（可删除）
      shukData: [
        ["2021-07-01", 1],
        ["2021-07-02", 1],
        ["2021-07-03", 2],
        ["2021-07-04", 1],
        ["2021-07-05", 1],
        ["2021-07-06", 1],
        ["2021-07-07", 3],
        ["2021-07-08", 2],
        ["2021-07-09", 1],
        ["2021-07-10", 3],
      ],
      // 日历前的填充数量（保证日期对应星期）
      blocknum: 0,
      // 车辆统计图的显示
      carShow: false,
      // 人员统计图的显示
      peopleShow: false,
      //人员或车辆tab切换
      activeName: "first",
      // 地图数据
      dragData: {},
      // 设备建设圆环图数据
      pieData: [
        { value: 66, name: "监控补盲", color: "#2ec7c9" },
        { value: 32, name: "架空层监控", color: "#b6a2de" },
        { value: 8, name: "智能双舱一体机", color: "#5ab1ef" },
        { value: 53, name: "人脸识别摄像头", color: "#ffb980" },
        { value: 66, name: "电梯监控", color: "#d87a80" },
        { value: 32, name: "周界监控", color: "#8d98b3" },
        { value: 25, name: "智慧井盖", color: "#e5cf0d" },
        { value: 2, name: "智慧果壳箱", color: "#588dd5" },
        { value: 2436, name: "智慧烟感", color: "#f5994e" },
      ],
      // 车辆进出数据（滚动显示）
      carList: [
        {
          carIndex: "01",
          inOrOut: true,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: false,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: true,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: true,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: false,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: true,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: true,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: false,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
        {
          carIndex: "01",
          inOrOut: false,
          plateNo: "浙A FBH05",
          crossTime: "17:12:42",
        },
      ],
      // 人员进出数据（滚动显示）
      peopleList: [
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
        {
          personName: "asdad",
          doorName: "34343",
          receiveTime: "q3242",
          inAndOutType: 0,
        },
      ],
      newCoverList: [],
      // 智慧井盖数据
      data: {
        time: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        list: [23, 23, 14, 23, 67],
      },
      // 人员进出数据（统计图）
      peopleData: {
        line: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        in: [23, 23, 14, 23, 67],
        out: [11, 34, 21, 23, 56],
      },
      // 车辆进出数据（统计图）
      carData: {
        line: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        in: [34, 11, 23, 16, 27],
        out: [23, 16, 27, 34, 56],
      },
      // 车辆进入趋势数据
      carLineData: {
        line: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        list: [{ name: "", num: [34, 23, 23, 22, 35] }],
      },
      //高空抛物或电梯电瓶车数据（统计图）
      lineData: {
        line: ["2:00", "3:00", "4:00", "5:00", "6:00"],
        list: [
          { name: "上报数", num: [34, 23, 23, 22, 35] },
          { name: "立案数", num: [23, 16, 27, 34, 56] },
          { name: "处置数", num: [34, 11, 23, 16, 27] },
        ],
      },
      // 顶部日期显示
      nowDate: "",
      nowTime: "",
      nowWeek: "",
      nowYear: "",
      camreaTime: "",
      // 是否为全屏模式
      isfullScreen: true,
    };
  },
  watch: {
    // 监听车辆或人员的切换
    activeName: {
      handler(newValue, oldValue) {
        if (newValue == "first") {
          this.carShow = true;
          this.peopleShow = false;
        } else {
          this.carShow = false;
          this.peopleShow = true;
        }
      },
      //,deep: true
    },
  },
  mounted() {
    // 调用获取日期方法，显示顶部日期
    this.nowTimes();
    this.getTrash();
    this.getCover();
    this.getpieDevice();
    this.getcountDevice();
    this.getcountCar();
    this.getcountPerson();
    this.getTrashDetail();
    this.getCoverDetail();
  },
  methods: {
    // 垃圾桶首页统计
    getTrash() {
      this.$request.countWS().then((res) => {
        if (res.data.status == 200) {
          this.newDayList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 垃圾桶详情
    getTrashDetail() {
      this.$request.shakeDetail().then((res) => {
        if (res.data.status == 200) {
          this.equipmentList = res.data.data.deviceList;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 井盖详情
    getCoverDetail() {
      this.$request.coverDetail().then((res) => {
        if (res.data.status == 200) {
          this.mentList = res.data.data.deviceList;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 井盖首页统计
    getCover() {
      this.$request.countCover().then((res) => {
        if (res.data.status == 200) {
          this.newCoverList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 设备建设
    getcountDevice() {
      this.$request.countDevice().then((res) => {
        if (res.data.status == 200) {
          // this.pieData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 设备运行状态
    getpieDevice() {
      this.objectDataStatic = false;
      this.$request.pieDevice().then((res) => {
        if (res.data.status == 200) {
          this.objectData = {
            item: res.data.data.deviceUseList,
            list: res.data.data.deviceUses,
          };
          this.objectDataStatic = true;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 车辆
    getcountCar() {
      this.objectDataStatic = false;
      this.$request.countCar().then((res) => {
        if (res.data.status == 200) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].carIndex = i;
            res.data.data.list[i].crossTime = res.data.data.list[
              i
            ].crossTime.slice(11, 18);
          }
          this.carList = res.data.data.list;
          console.log(this.carList);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 人员
    getcountPerson() {
      this.objectDataStatic = false;
      this.$request.countPerson().then((res) => {
        if (res.data.status == 200) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].carIndex = i;
            res.data.data.list[i].crossTime = res.data.data.list[
              i
            ].receiveTime.slice(11, 18);
          }
          this.peopleList = res.data.data.list;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getPosi(lng, lat, address) {
      console.log(lng);
      console.log(lat);
      console.log(address);
    },
    // 全屏模式
    fullScreen() {
      if (this.isfullScreen) {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        this.isfullScreen = false;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isfullScreen = true;
      }
    },
    // 地图获取的信息
    dragMap(data) {
      this.dragData = {
        lng: data.position.lng,
        lat: data.position.lat,
        address: data.address,
        nearestJunction: data.nearestJunction,
        nearestRoad: data.nearestRoad,
        nearestPOI: data.nearestPOI,
      };
    },
    // 时间显示
    timeFormate(timeStamp) {
      let wk = new Date().getDay();
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
      let date =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mm =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      var mouths = [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
      this.blocknum = new Date(year + "," + month + "," + "01").getDay();
      let week = weeks[wk];
      this.nowTime = hh + ":" + mm + ":" + ss;
      this.camreaTime = hh + ":" + mm;
      this.nowDate = month + "-" + date;
      this.nowYear = mouths[parseInt(month, 10) - 1] + "月";
      this.nowWeek = week;
    },
    // 顶部时间 （实时刷新）
    nowTimes() {
      this.timeFormate();
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    // 清除定时器
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
    // 展示弹窗
    showDialog(str) {
      if (str == "shuck") {
        this.dialogTitle = "智能垃圾箱数据分析";
      } else if (str == "wellLid") {
        this.dialogTitle = "智能井盖数据分析";
      } else if (str == "hightoss") {
        this.dialogTitle = "高空抛物数据分析";
      } else if (str == "electromobile") {
        this.dialogTitle = "电梯电瓶车数据分析";
      } else if (str == "car") {
        this.dialogTitle = "车辆进出数据分析";
      } else if (str == "ambitus") {
        this.dialogTitle = "周界监控数据分析";
      }
      this.dialogShow = true;
      this.dialogStyle = str;
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogShow = false;
    },
  },
  computed: {
    // 文字滚动组件滚动速度
    optionSingleHeight() {
      return {
        step: 0.3,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__header {
  width: 90%;
}
.dialog {
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  .dialog-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    opacity: 1;
    margin: auto;
    width: 80%;
    height: 828px;
    background: url("https://2016-0708-1305237326.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210706122534.png")
      no-repeat;
    background-size: 100% 100%;
    .dialog-title {
      text-align: center;
      color: #fff;
      font-size: 20px;
      line-height: 42px;
      height: 42px;
    }
    .dialog-body {
      padding: 40px 53px;
      // background: #fff;
      height: 300px;
      .body-top {
        height: 42px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        color: #56e4ff;
        .top-static {
          font-size: 16px;
          height: 42px;
          line-height: 42px;
          span {
            display: inline-block;
            text-align: center;
            width: 32px;
            height: 40px;
            line-height: 40px;
            margin: 0 10px;
            border: 1px solid #56e4ff;
            vertical-align: middle;
            border-radius: 2px;
          }
        }
      }
      .body-bottom {
        display: flex;
        justify-content: space-between;
        .body-left {
          width: 55%;
          height: 550px;
          display: inline-block;
          overflow: hidden;
          border: 1px solid #56e4ff;
          border-radius: 8px;
          .equipment-list {
            width: 400px;
            height: 245px;
            border-radius: 8px;
            position: absolute;
            top: 165px;
            z-index: 999;
            background: #14417d;
            padding: 10px;
            overflow: auto;
            .pedestrian-people {
              height: 30px;
              line-height: 40px;
              border-top: 1px solid #56e4ff;
              text-align: left;
              .peopel-code {
                width: 20%;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: keep-all;
                cursor: pointer;
              }
              // .peopel-code:hover {
              //   text-overflow: clip;
              //   white-space: nowrap;
              //   overflow: visible;
              // }
            }
          }
        }

        .body-right {
          width: 43%;
          height: 550px;
          display: inline-block;
          .body-static {
            height: 550px;
            background: url("../../src/assets/block-bg.png") no-repeat;
            background-size: 100% 100%;
            .static-title {
              text-align: center;
              font-size: 16px;
              color: #56e4ff;
              line-height: 50px;
              height: 40px;
            }
            .static-list {
              padding: 40px;
              text-align: center;
              p {
                color: #fff;
                font-size: 14px;
                height: 40px;
                line-height: 40px;
                background: #14417d;
                border-radius: 20px;
                margin-bottom: 16px;
                span {
                  margin: 0 10px;
                }
                .static-stype {
                  display: inline-block;
                  vertical-align: middle;

                  border-radius: 3px;
                  width: 60px;
                  height: 26px;
                  line-height: 26px;
                  color: #56e4ff;
                  border: 1px solid #56e4ff;
                }
              }
            }
          }
          .body-alarm {
            height: 259px;
            background: url("../../src/assets/block-bgtwo.png") no-repeat;
            background-size: 100% 100%;
            .alarm-title {
              text-align: center;
              font-size: 16px;
              color: #56e4ff;
              line-height: 50px;
              height: 40px;
            }
            .car-static {
              padding: 10px 20px;
            }
          }
        }
        .body-lefthightoss {
          height: 550px;
          display: inline-block;
          background: url("../../src/assets/block-bg.png") no-repeat;
          background-size: 100% 100%;
          .thightoss-title {
            font-size: 16px;
            text-align: center;
            color: #56e4ff;
            line-height: 50px;
            height: 50px;
          }
          .equipment-lists {
            padding: 16px;
            .pedestrian-people {
              height: 40px;
              line-height: 40px;
              text-align: center;
              margin-bottom: 0;
            }
            .item {
              li:nth-child(even) {
                background: #14417d;
                //   height: 40px;
                // line-height: 40px;
              }
            }
          }
          .thightoss-static {
            padding: 10px 20px;
          }
          .camera-statics {
            vertical-align: top;
            height: 245px;
            width: 100%;
            display: inline-flex;
            flex-wrap: wrap;
            margin-top: 15px;
            justify-content: space-around;
            .camera-info {
              margin-top: 15px;
              width: 30%;
              // margin-left: 40px;
              // float: left;
              .discrip {
                font-size: 12px;
                color: #56e4ff;
                span {
                  float: right;
                  color: #fff;
                }
              }
              .camera-img {
                padding: 7px;
                width: 94%;
                border: 1px solid #56e4ff;
                height: 130px;
                margin-top: 10px;
                margin-bottom: 15px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .discrip-info {
                font-size: 12px;
                color: #fff;
                margin-top: 8px;
              }
            }
          }
        }
      }
    }
    .close {
      position: absolute;
      top: 770px;
      text-align: center;
      color: #fff;
      left: 46.5%;
      font-size: 26px;
      line-height: 42px;
      height: 42px;
      span {
        cursor: pointer;
      }
    }
  }
}
* {
  /*清除页面中标签自带的外间距和内填充*/
  margin: 0;
  padding: 0;
}
.fa-lg {
  vertical-align: 45%;
}
/deep/.el-tabs__item {
  color: #fff;
}
/deep/.el-tabs__nav-wrap::after {
  background: none;
}
.content {
  background: #000836;
}
.header {
  background: url("https://2016-0708-1305237326.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210706125830.png")
    no-repeat;
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
      .shuk-statics {
        vertical-align: top;
        display: inline-block;
        height: 245px;
        width: 77%;
      }
      .shuk-static {
        vertical-align: top;
        display: inline-flex;
        justify-content: space-around;
        height: 245px;
        width: 77%;
        // background: #fff;
        .static-mounth {
          width: 8%;
          height: 185px;
          // line-height: 185px;
          background: #113364;
          text-align: center;
          margin-top: 60px;
          span {
            writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
            writing-mode: tb-lr;
            font-size: 20px;
            display: inline-block;
            height: 100%;
            color: #fff;
          }
        }
        .static-day {
          width: 82%;
          height: 245px;
          // background: #fff;
          .static-week {
            display: flex;
            justify-content: space-around;
            margin: 20px 0 20px 0;
          }
          .day-box {
            width: 100%;
            .day-item {
              width: 13.5%;
              height: 28px;
              line-height: 27px;
              display: inline-block;
              border: 1px solid #1e5380;
              background: #113364;
              float: left;
              text-align: center;
              span {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                box-shadow: 0px 0px 5px #fff;
                // background: #fff;
              }
            }
            .day-items {
              width: 13.5%;
              height: 28px;
              line-height: 27px;
              display: inline-block;
              float: left;
              border: 1px solid #00063d;
            }
          }
        }
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
          margin-top: 15px;
          width: 33%;
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
            // margin-left: 3px;
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
        width: 89%;
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
      margin: 25px 0 25px 0;
      height: 310px;
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
        margin: 10px 5px 16px 0;
        width: 14%;
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
      .camera-statics {
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
            span {
              float: right;
              color: #fff;
            }
          }
          .camera-img {
            padding: 7px;
            width: 94%;
            border: 1px solid #56e4ff;
            height: 130px;
            margin-top: 10px;
            margin-bottom: 15px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .discrip-info {
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
            span {
              float: right;
              color: #fff;
            }
          }
          .camera-img {
            padding: 7px;
            width: 90%;
            border: 1px solid #56e4ff;
            height: 120px;
            margin-top: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .discrip-info {
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
  .titles {
    background: rgba(86, 228, 255, 0.1);
    height: 40px;
    // padding: 0 16px;
    line-height: 20px;
    margin: 3px 4px 0 4px;
    border: 1px;
    i {
      float: right;
      line-height: 40px;
      margin-right: 13px;
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
.pedestrian-otherpeoples {
  display: flex;
  justify-content: space-around;
  background: #113364;
  div {
    text-align: center;
    color: #56e4ff;
    height: 40px;
    line-height: 40px;
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
// /deep/.el-tooltip__popper.is-dark{
//   z-index: 999999 !important;
// }
</style>
