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
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: "人员名称" },
        { prop: "certNo", label: " 证件号码" },
        { prop: "cardNo", label: " 卡号" },
        { prop: "times", label: " 进出时间段",type: "datePicker", },
      ],
      //表格列
      column: [
        { prop: "eventName", label: "事件名称" },
        { prop: "eventTime", label: "事件产生时间" },
        { prop: "cardNo", label: "卡号" },
        { prop: "personName", label: "人员名称" },
        { prop: "orgName", label: "人员所属组织名称" },
        { prop: "doorName", label: "门禁点名称" },
        { prop: "doorRegionIndexCode", label: "门禁点所在区域编码" },
        { prop: "picUri", label: "抓拍图片", type: "image" },
        { prop: "inAndOutTypeValue", label: "进出类型" },
        { prop: "readerDevName", label: "读卡器名称" },
        { prop: "devName", label: "控制器名称" },
        { prop: "identityCardUri", label: "身份证图片", type: "image" },
        { prop: "certNo", label: "证件号码" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      loading: false,
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        certNo: undefined,
        cardNo: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
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
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        userName: undefined,
        certNo: undefined,
        cardNo: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.findPersonEntranceLog(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
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
