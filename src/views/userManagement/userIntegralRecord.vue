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
      //加载状态
      loading: false,
      billList: [],
      // 新闻状态字典
      publishStatusMap: [],
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "obtainType", label: "获取方式", type: "select", options: [] },
        {
          prop: "pointValidStatus",
          label: "是否有效",
          type: "select",
          options: [],
        },
        { prop: "times", label: "获取时间段", type: "datePicker" },
      ],
      //表格列
      column: [
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "initialPoint", label: "期初积分" },
        { prop: "point", label: "本次获取积分" },
        { prop: "finalPoint", label: "总积分" },
        { prop: "obtainTime", label: "获取时间" },
        { prop: "obtainTypeStr", label: "获取方式" },
        { prop: "pointValidStatusStr", label: "是否有效" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        userName: undefined,
        mobile: undefined,
        pointValidStatus: undefined,
        obtainType: undefined,
      },
       //所需字典列表
      dicList: [],
    };
  },
  created() {
       this.$request.userPointEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "obtainType") {
          this.dicList.pointObtainTypeEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "pointValidStatus") {
          this.dicList.pointValidStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.getList();
  },
  methods: {
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
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        userName: undefined,
        mobile: undefined,
        pointValidStatus: undefined,
        obtainType: undefined,
      };
      this.handleQuery();
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.pointRecord(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.$message.error(res.data.msg);
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
</style>
