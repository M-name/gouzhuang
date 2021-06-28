<template>
  <div class="container">
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
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "userControl",
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
        // {
        //   label: "查看详情",
        //   icon: "el-icon-edit",
        //   handler: (row) => this.handleEdit(row),
        // },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: " 住户姓名" },
        { prop: "mobile", label: " 住户手机号" },
      ],
      //表格列
      column: [
        { prop: "parkName", label: "停车库名称" },
        { prop: "entranceName", label: "出入口名称" },
        { prop: "roadwayName", label: "	车道名称" },
        { prop: "vehicleOutValue", label: "进出场" },
        { prop: "releaseModeValue", label: "放行模式" },
        { prop: "releaseResultValue", label: "放行结果" },
        { prop: "releaseWayValue", label: "放行方式" },
        { prop: "releaseReasonValue", label: "放行原因" },
        { prop: "plateNo", label: "车牌号码" },
        { prop: "cardNo", label: "卡片号码" },
        { prop: "vehicleColorValue", label: "车辆颜色" },
        { prop: "vehicleTypeValue", label: "车辆类型" },
        { prop: "plateColorValue", label: "车牌颜色" },
        { prop: "plateTypeValue", label: "车牌类型" },
        { prop: "carCategoryName", label: "车辆分类名称" },
        { prop: "vehiclePicUri", label: "车辆图片", type: "image" },
        { prop: "plateNoPicUri", label: "车牌图片", type: "image" },
        { prop: "facePicUri", label: "人脸图片", type: "image" },
        { prop: "createTime", label: "创建时间" },
        { prop: "crossTime", label: "通过时间" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      loading: false,
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.findVehicleEntranceLog(this.params).then((res) => {
        if (res.data.status == 200) {
          this.loading = false;
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
        } else {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.operation {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
</style>
