<template>
  <div class="contant">
    <div class="parking">
      <div class="parking-img"><img src="@/assets/people.png" alt="" /></div>
      <div class="user-info">
        <p class="car-id">{{ userInfo.userName }}</p>
        <p class="parking-info">
          <span v-for="(item, index) in userInfo.liveTypeIdStr" :key="index">{{
            item
          }}</span
          ><span>{{ userInfo.faceAuthStatusStr }}</span>
        </p>
        <div class="theuser">
          <div>住户编码：{{ userInfo.userCode }}</div>
          <div>证件类型：{{ userInfo.certificateTypeIdStr }}</div>
          <div>证件号码：{{ userInfo.certificateTypeId }}</div>
          <div>性别：{{ userInfo.userSexStr }}</div>
          <div>手机号：{{ userInfo.mobile }}</div>
          <div>联系人电话：{{ userInfo.contactMethod }}</div>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="基本信息">
          <!-- owner -->
          <div class="operations">
            <div>
              <p>门卡类型：{{ userInfo.accessTypeIds }}</p>
              <p>出生年月：{{ userInfo.birthday }}</p>
              <p>户籍省县：{{ userInfo.areaCode }}</p>
              <p>从事职业：{{ userInfo.careerIdStr }}</p>
            </div>
            <div>
              <p>是否境外人员：{{ userInfo.isOverseasStr }}</p>
              <p>民族：{{ userInfo.nationIdStr }}</p>
              <p>户籍地址：{{ userInfo.areaAddr }}</p>
              <p>职位：{{ userInfo.jobTitle }}</p>
            </div>
            <div>
              <p>门卡号：{{ userInfo.cardCode }}</p>
              <p>政治面貌：{{ userInfo.politicsStatusStr }}</p>
              <p>文化程度：{{ userInfo.eduLevelIdStr }}</p>
              <p>工作单位：{{ userInfo.unitName }}</p>
            </div>
            <div>
              <p>国籍：{{ userInfo.countryIdStr }}</p>
              <p>婚姻状态：{{ userInfo.maritalStatusStr }}</p>
              <p></p>
              <p>单位地址：{{ userInfo.unitAddr }}</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="居住信息">
          <!-- member -->
          <div class="operation">
            <CommonTable
              :loading="resideLoading"
              :defColumns="resideColumn"
              :dataList="resideTableData"
              :options="tableOptions"
              :operations="tableOperations"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="证件信息">
          <div v-if="userInfo.certificateImageCodes" class="operation">
            <el-image
              class="img"
              v-for="(item, index) in userInfo.certificateImageCodes"
              :key="index"
              :src="item"
              :preview-src-list="userInfo.certificateImageCodes"
            >
            </el-image>
          </div>
          <div style="text-align:center;padding:10px;" v-else>
            <img
              class="image"
              style="margin-top: 20px"
              src="@/assets/nodate.png"
              alt=""
            />
            <div class="nodata">暂无数据</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="车辆信息">
          <!-- tenant -->
          <div class="operation">
            <CommonTable
              :total="carTotal"
              :loading="carLoading"
              :defColumns="carColumn"
              :dataList="carTableData"
              :options="tableOptions"
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
      src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [],
      //表格列
      resideColumn: [
        { prop: "blockNo", label: "楼栋名称 " },
        { prop: "unitNo", label: "单元" },
        { prop: "floorNo", label: "楼层" },
        { prop: "roomNo", label: "房间号" },
        { prop: "userCode", label: "物业编码 " },
        { prop: "structure", label: "房屋户型" },
        { prop: "buildingArea", label: "建筑面积（㎡）" },
        { prop: "liveStatusStr", label: "居住状态 " },
        { prop: "createTime", label: "录入时间" },
      ],
      carColumn: [
        { prop: "plateNo", label: "车牌号 " },
        { prop: "carColorStr", label: "车身颜色" },
        { prop: "carModelStr", label: "车辆类型" },
        { prop: "brandModel", label: "品牌型号" },
        { prop: "carOwner", label: "车主姓名" },
        { prop: "ownerMobile", label: "车主联系方式" },
        { prop: "identityNo", label: "车主证件编码" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "createTime", label: "登记时间" },
        { prop: "createBy", label: "办理人员" },
      ],
      // 用户信息
      userInfo: {},
      // 上一级code
      peopleCode: undefined,
      // 表格参数
      carTableData: [],
      resideTableData: [],
      // 总条数
      carTotal: 0,
      resideTotal: 0,
      //加载状态
      carLoading: false,
      resideLoading: false,
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("peopleDetailCode", this.$route.params.code);
      this.peopleCode = this.$route.params.code;
    } else {
      this.peopleCode = localStorage.getItem("peopleDetailCode");
    }
    this.getUser();
    this.resideGetList();
    this.ownerGetList();
  },

  methods: {
    //获取车辆信息列表
    ownerGetList() {
      this.carLoading = true;
      this.$request
        .parkingFindInfo(this.peopleCode)
        .then((res) => {
          if (res.data.status == 200) {
            this.carTableData = res.data.data;
            this.carLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.carLoading = false;
          }
        })
    },
    //获取居住信息列表
    resideGetList() {
      this.resideLoading = true;
      this.$request
        .buildingFindInfo(this.peopleCode)
        .then((res) => {
          if (res.data.status == 200) {
            this.resideTableData = res.data.data;
            this.resideLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.resideLoading = false;
          }
        })
    },
    //获取用户详情
    getUser() {
      this.$request
        .detailsFindInfo(this.peopleCode)
        .then((res) => {
          res.data.data.liveTypeIdStr = res.data.data.liveTypeIdStr.split(",");
          if (res.data.data.certificateImageCodes) {
            res.data.data.certificateImageCodes =
              res.data.data.certificateImageCodes.split(",");
          }

          this.userInfo = res.data.data;
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
      .theuser {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        div {
          margin-top: 10px;
          width: 33%;
          font-size: 14px;
        }
      }
      .car-id {
        font-size: 18px;
        font-weight: bold;
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
.operations {
  background: #fff;
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  div {
    width: 24%;
    p {
      margin-top: 15px;
    }
  }
}
.button {
  height: 50px;
  line-height: 50px;
}
.img {
  width: 150px;
  height: 100px;
  border-radius: 6px;
  margin-right: 20px;
}
.image{
  width: 90px;
  height: 90px;
  margin-bottom: 10px;
}
</style>