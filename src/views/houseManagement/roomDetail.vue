<template>
  <div class="contant">
    <div class="parking">
      <div class="parking-img"><img src="@/assets/home.png" alt="" /></div>
      <div class="user-info">
        <p
          class="car-id leixing"
          :class="
            userInfo.buildingMonitorStatus == 0
              ? 'fangxin'
              : userInfo.buildingMonitorStatus == 1
              ? 'guanzhu'
              : userInfo.buildingMonitorStatus == 2
              ? 'yanguan'
              : ''
          "
        >
          <span>{{ userInfo.buildingCode }}</span>
          <i></i>
          <span v-if="userInfo.buildingMonitorStatusStr" class="roomtype">{{
            userInfo.buildingMonitorStatusStr
          }}</span>
          <span v-if="userInfo.buildingCheckStatusStr" class="ischeck">{{
            userInfo.buildingCheckStatusStr
          }}</span>
        </p>
        <p class="parking-info">
          <span v-if="userInfo.buildingPropStr">{{
            userInfo.buildingPropStr
          }}</span
          ><span v-if="userInfo.buildingArea"
            >{{ userInfo.buildingArea }}㎡</span
          ><span
            >{{ userInfo.roomNum ? userInfo.roomNum + "室" : ""
            }}{{ userInfo.hallNum ? userInfo.hallNum + "厅" : ""
            }}{{ userInfo.kitchenNum ? userInfo.kitchenNum + "厨" : ""
            }}{{
              userInfo.washroomNum ? userInfo.washroomNum + "卫" : ""
            }}</span
          >
        </p>
        <p class="neirong">
          常住人口：{{
            userInfo.permanentPersonNum ? userInfo.permanentPersonNum : 0
          }}&nbsp;流动人口：{{
            userInfo.transientPersonNum ? userInfo.transientPersonNum : 0
          }}
          / 出租房间数：{{ userInfo.rentRoomNum ? userInfo.rentRoomNum : 0 }}
        </p>
        <p v-if="userInfo.checkTime" class="neirong">
          上次排查：{{ userInfo.checkTime }}/{{userInfo.checkBy.split(',')[0]}}
        </p>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="业主信息">
          <!-- owner -->
          <div v-if="ownerTableData" class="people-info">
            <p>
              用户姓名：{{
                ownerTableData.userName ? ownerTableData.userName : "无"
              }}
            </p>
            <p>
              证件类型：{{
                ownerTableData.certificateTypeIdStr
                  ? ownerTableData.certificateTypeIdStr
                  : "无"
              }}
            </p>
            <p>
              证件号码：{{
                ownerTableData.certificateCode
                  ? ownerTableData.certificateCode
                  : "无"
              }}
            </p>
            <p>
              门卡编号：{{
                ownerTableData.cardCode ? ownerTableData.cardCode : "无"
              }}
            </p>
            <p>
              性别：{{ ownerTableData.userSex ? ownerTableData.userSex : "无" }}
            </p>
            <p>
              联系人手机：{{
                ownerTableData.mobile ? ownerTableData.mobile : "无"
              }}
            </p>
            <p>
              住户状态：{{
                ownerTableData.liveStatusStr
                  ? ownerTableData.liveStatusStr
                  : "无"
              }}
            </p>
            <p>
              住户类型：{{
                ownerTableData.liveTypeIdStr
                  ? ownerTableData.liveTypeIdStr
                  : "无"
              }}
            </p>
          </div>
          <div v-else style="padding:20px">暂无</div>
        </el-tab-pane>
        <el-tab-pane label="成员信息">
          <!-- member -->
          <div class="operation">
            <CommonTable
              :total="memberTotal"
              :loading="memberLoading"
              :defColumns="column"
              @pagination="memberGetList"
              :dataList="memberTableData"
              :options="tableOptions"
              :page.sync="memberParams.page"
              :limit.sync="memberParams.pageSize"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="租客记录">
          <!-- tenant -->
          <div class="operation">
            <CommonTable
              :total="tenantTotal"
              :loading="tenantLoading"
              :defColumns="column"
              @pagination="tenantGetList"
              :dataList="tenantTableData"
              :options="tableOptions"
              :page.sync="tenantParams.page"
              :limit.sync="tenantParams.pageSize"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="height: 20px"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="物业缴费">
          <!-- payFees -->
          <div class="operation">
            <CommonTable
              :total="payFeesTotal"
              :loading="payFeesLoading"
              :defColumns="payFeesColumn"
              @pagination="payFeesGetList"
              :dataList="payFeesTableData"
              :options="tableOptions"
              :page.sync="payFeesParams.page"
              :limit.sync="payFeesParams.pageSize"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="排查记录">
          <!-- check -->
          <div class="operation">
            <CommonTable
              :total="checkTotal"
              :loading="checkLoading"
              :defColumns="checkColumn"
              @pagination="checkGetList"
              :dataList="checkTableData"
              :options="tableOptions"
              :page.sync="checkParams.page"
              :limit.sync="checkParams.pageSize"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [],
      //表格列
      column: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "cardCode", label: "门卡编号" },
        { prop: "userSex", label: "性别 " },
        { prop: "mobile", label: "联系人手机" },
        { prop: "liveStatusStr", label: "住户状态" },
        { prop: "liveTypeIdStr", label: "住户类型 " },
      ],
      payFeesColumn: [
        { prop: "orderYear", label: "账单年度" },
        {
          prop: "serviceEndTime",
          label: "账单周期",
          render: (h, scope) => {
            return h("div", [
              scope.row.serviceStartTime + "~" + scope.row.serviceEndTime,
            ]);
          },
        },
        { prop: "buildingCode", label: "房屋编码 " },
        { prop: "buildingArea", label: "房屋面积（㎡）" },
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号 " },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "feeName", label: "费用名称" },
        { prop: "orderAmount", label: "应支付（元）" },
        { prop: "paymentStatus", label: "账单状态 " },
        { prop: "createTime", label: "生成日期" },
      ],
      checkColumn: [
        { prop: "buildingCode", label: "楼幢编码" },
        { prop: "buildingMonitorStatusStr", label: "监管状态" },
        { prop: "buildingPropStr", label: "房屋性质" },
        { prop: "permanentPersonNum", label: "常住人口数量" },
        { prop: "rentRoomNum", label: "出租房间数" },
        { prop: "checkTime", label: "排查时间", width: "160" },
        { prop: "checkBy", label: "排查员工" },
        ,
      ],
      // 用户信息
      userInfo: {},
      // 上一级ID
      carId: undefined,
      // 表格参数
      ownerTableData: [],
      memberTableData: [],
      tenantTableData: [],
      payFeesTableData: [],
      checkTableData: [],
      // 总条数
      ownerTotal: 0,
      memberTotal: 0,
      tenantTotal: 0,
      payFeesTotal: 0,
      checkTotal: 0,
      //加载状态
      ownerLoading: false,
      memberLoading: false,
      tenantLoading: false,
      payFeesLoading: false,
      checkLoading: false,
      //房号编码
      buildingCode: undefined,
      // 请求参数
      ownerParams: {
        page: 1,
        pageSize: 20,
        type: 0,
      },
      memberParams: {
        page: 1,
        pageSize: 20,
        type: 1,
      },
      tenantParams: {
        page: 1,
        pageSize: 20,
        type: 2,
      },
      payFeesParams: {
        page: 1,
        pageSize: 20,
      },
      checkParams: {
        page: 1,
        pageSize: 20,
      },
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("roomDetailCode", this.$route.params.code);
      localStorage.setItem("roomDetailId", this.$route.params.id);
      this.buildingCode = this.$route.params.code;
      this.carId = this.$route.params.id;
    } else {
      this.buildingCode = localStorage.getItem("roomDetailCode");
      this.carId = localStorage.getItem("roomDetailId");
    }
    this.getUser();
    this.ownerGetList();
    this.memberGetList();
    this.tenantGetList();
    this.payFeesGetList();
    this.checkGetList();
  },
  created() {
  },
  methods: {
    //获取业主信息列表
    ownerGetList() {
         let that = this;
      this.ownerLoading = true;
      this.ownerParams.buildingCode = this.buildingCode;
      this.$request
        .buildingPeopleList(this.ownerParams)
        .then((res) => {
          if (res.data.status == 200) {
            this.ownerTableData = res.data.data.rows[0];
            this.ownerTotal = res.data.data.records;
            this.ownerParams.page = res.data.data.page;
            that.ownerLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.ownerLoading = false;
          }
        })
    },
    //获取成员信息列表
    memberGetList() {
          let that = this;
      this.memberLoading = true;
      this.memberParams.buildingCode = this.buildingCode;
      this.$request
        .buildingPeopleList(this.memberParams)
        .then((res) => {
          if (res.data.status == 200) {
            this.memberTableData = res.data.data.rows;
            this.memberTotal = res.data.data.records;
            this.memberParams.page = res.data.data.page;
            that.memberLoading = false;
          } else {
            that.$message.error(res.data.msg);
            that.memberLoading = false;
          }
        })
    },
    //获取租客记录列表
    tenantGetList() {
      this.tenantLoading = true;
      this.tenantParams.buildingCode = this.buildingCode;
      this.$request
        .buildingPeopleList(this.tenantParams)
        .then((res) => {
          if (res.data.status == 200) {
            this.tenantTableData = res.data.data.rows;
            this.tenantTotal = res.data.data.records;
            this.tenantParams.page = res.data.data.page;
            this.tenantLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.tenantLoading = false;
          }
        })
    },
    //获取物业缴费列表
    payFeesGetList() {
      this.payFeesLoading = true;
      this.payFeesParams.buildingCode = this.buildingCode;
      this.$request
        .orderList(this.payFeesParams)
        .then((res) => {
          if (res.data.status == 200) {
            this.payFeesTableData = res.data.data.rows;
            this.payFeesTotal = res.data.data.records;
            this.payFeesParams.page = res.data.data.page;
            this.payFeesLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.payFeesLoading = false;
          }
        })
    },
    //获取排查记录列表
    checkGetList() {
      this.checkLoading = true;
      this.checkParams.buildingCode = this.buildingCode;
      this.$request
        .buildCheckLog(this.checkParams)
        .then((res) => {
          if (res.data.status == 200) {
            this.checkTableData = res.data.data.rows;
            this.checkTotal = res.data.data.records;
            this.checkParams.page = res.data.data.page;
            this.checkLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.checkLoading = false;
          }
        })
    },
    //获取用户详情
    getUser() {
      this.$request
        .buildFindFiles(this.carId)
        .then((res) => {
          if (res.data.status == 200) {
           this.userInfo = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          
        })
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
      width: 70%;
      .car-id {
        font-size: 18px;
        font-weight: bold;
        .ischeck {
          padding: 5px 15px;
          color: #fff;
          display: inline-block;
          font-size: 12px;
          border-radius: 20px;
          background: #409eff;
          margin-left: 10px;
        }
      }
      .leixing {
        i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: 15px;
          vertical-align: middle;
        }
        .roomtype {
          margin-left: 8px;
          font-size: 13px;
        }
      }
      .fangxin {
        i {
          background: #5cc372;
        }
        .roomtype {
          color: #5cc372;
        }
      }
      .yanguan {
        i {
          background: #fe6768;
        }
        .roomtype {
          color: #fe6768;
        }
      }
      .guanzhu {
        i {
          background: #fead3f;
        }
        .roomtype {
          color: #fead3f;
        }
      }
      .parking-info {
        margin-top: 10px;
        span {
          padding: 5px 15px;
          border-radius: 20px;
          display: inline-block;
          background: #409eff;
          color: #fff;
          font-size: 12px;
          margin-right: 20px;
        }
      }
      .neirong {
        margin-top: 10px;
      }
    }
  }
  .tabs {
    background: #fff;
    border-radius: 6px;
  }
}
.operation {
  background: #fff;
  padding: 0 20px 20px 20px;
}
.people-info {
  background: #fff;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  p {
    margin-top: 10px;
    width: 24%;
  }
}
.button {
  height: 50px;
  line-height: 50px;
}
</style>