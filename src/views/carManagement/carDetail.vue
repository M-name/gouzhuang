<template>
  <div class="contant">
    <div class="parking">
      <div class="parking-img"><img src="@/assets/home.png" alt="" /></div>
      <div class="user-info">
        <p class="car-id">{{ userDetail.plateNo }}</p>
        <p class="parking-info">
          <span>{{ userDetail.zoneName }}</span
          ><span>{{
            userDetail.carOwnerTypeId == 52 ? "业主车辆" : "外来车辆"
          }}</span
          ><span>{{ userDetail.parkingCode }}</span>
        </p>
        <div class="theuser">
          <div>车身颜色：{{ userDetail.carColorStr }}</div>
          <div>车辆类型：{{ userDetail.carModelStr }}</div>
          <div>品牌型号：{{ userDetail.brandModel }}</div>
        </div>
      </div>
    </div>
    <div style="height: 20px; background: #fff"></div>
    <div class="tabs">
      <el-tabs type="card">
        <el-tab-pane label="车主信息">
          <div class="operation">
            <div class="theuser">
              <div>车主姓名：{{ userDetail.carOwner }}</div>
              <div>联系方式：{{ userDetail.ownerMobile }}</div>
              <div>证件类型：{{ userDetail.certificateTypeIdStr }}</div>
              <div>证件编码：{{ userDetail.identityNo }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="进出记录">
          <div class="operation">
            <CommonTable
              :total="transferTotal"
              :loading="transferLoading"
              :defColumns="transferColumn"
              @pagination="transferGetList"
              :dataList="transferTableData"
              :options="tableOptions"
              :page.sync="transferParams.page"
              :limit.sync="transferParams.pageSize"
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
      tableOperations: [
      //   {
      //     label: "修改",
      //     icon: "el-icon-edit",
      //     // handler: (row) => this.handleUpdate(row),
      //   },
      //   {
      //     label: "删除",
      //     style: { color: "#F56C6C" },
      //     icon: "el-icon-delete",
      //     // handler: (row) => this.handleDelete(row),
      //   },
      // ],
      // transferTableOperations: [
      //   {
      //     label: "查看",
      //     icon: "el-icon-edit",
      //     // handler: (row) => this.handleUpdate(row),
      //   },
      ],
      //表格列
      column: [
        { prop: "userName", label: "租用人姓名 " },
        { prop: "tenantTypeIdStr", label: "租用人类型" },
        { prop: "mobile", label: "租用人手机号" },
        { prop: "certificateTypeIdStr", label: "租用人证件类型" },
        { prop: "certificateNo", label: "租用人证件号码 " },
        { prop: "rentEndTime", label: "租用周期" },
        { prop: "rentBeginTime", label: "登记时间" },
      ],
      transferColumn: [
        { prop: "currUserName", label: "过户人姓名 " },
        { prop: "currTypeIdStr", label: "过户人类型" },
        { prop: "currMobile", label: "过户人手机号" },
        { prop: "currCertificateTypeIdStr", label: "过户人证件类型" },
        { prop: "currCertificateNo", label: "过户人证件号码 " },
        { prop: "transferTime", label: "过户时间" },
      ],
      // 用户信息
      userInfo: {},
      userDetail: {},
      // 上一级ID
      carId: undefined,
      // 表格参数
      tableData: [],
      transferTableData: [],
      // 总条数
      total: 0,
      transferTotal: 0,
      loading: false,
      transferLoading: false,
      params: {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
      },
      transferParams: {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
      },
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("carDetailCode", this.$route.params.code);
      this.carId = this.$route.params.code;
    } else {
      this.carId = localStorage.getItem("carDetailCode");
    }
    this.$request
      .parkingFindCar(localStorage.getItem("carDetailCode"))
      .then((res) => {
        this.userDetail = res.data.data;
      });
  },
  created() {
  },
  methods: {
    //获取出租列表
    getList() {
      this.loading = true;
      this.$request
        .parkingRentList(this.params)
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
    //获取过户列表
    transferGetList() {
      this.transferLoading = true;
      this.$request
        .parkingTransferList(this.transferParams)
        .then((res) => {
          this.transferTableData = res.data.data.rows;
          this.transferTotal = res.data.data.records;
          this.transferParams.page = res.data.data.page;
          this.transferLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取用户详情
    getUser() {
      this.$request
        .parkingFind(this.carId)
        .then((res) => {
          this.userInfo = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 删除
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deptDelDict(row.id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
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
        font-size: 20px;
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
      .theuser {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        div {
          font-size: 16px;
        }
      }
    }
  }
  .tabs {
    background: #fff;
    padding-left: 10px;
  }
}
.operation {
  background: #fff;
  padding: 0 20px 20px 20px ;
  .theuser {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    div {
      font-size: 16px;
    }
  }
}
.button {
  height: 50px;
  line-height: 50px;
}
</style>