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
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleUpdate(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房屋编码 " },
        { prop: "userName", label: " 住户姓名" },
        {
          prop: "mobile",
          label: "住户手机",
        },
        {
          prop: "repaireCode",
          label: "工单编号",
        },
        {
          prop: "times",
          label: "受理时间",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "createTime", label: "提交时间 " },
        { prop: "repaireCode", label: "工单编号", widht: "180" },
        { prop: "repairType", label: "报修类型", widht: "180" },
        { prop: "buildingCodeStr", label: "报修房屋" },
        {
          prop: "userName",
          label: "住户信息",
          render: (h, scope) => {
            return h("div", [scope.row.userName + "/ " + scope.row.mobile]);
          },
        },
        {
          prop: "repaireStatus",
          label: "处理状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(this.roleStatus, row.repaireStatus);
          },
        },
        { prop: "publishTypeValue", label: "派发策略" }, //
        { prop: "managerName", label: "维修员工" },
        { prop: "finishTime", label: "完成时间" },
        { prop: "appraiseStatusValue", label: "评价状态" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      roleStatus: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        managerName: JSON.parse(localStorage.getItem("userInfo")).userName,
        mobile: undefined,
        repaireCode: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    this.$request.findRepairAlleuems().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < lists.repaireProgressEnum.length; i++) {
        let arr = {};
        arr.value = lists.repaireProgressEnum[i].type;
        arr.label = lists.repaireProgressEnum[i].value;
        role.push(arr);
      }
      this.roleStatus = role;
    });
    this.getList();
  },
  methods: {
    // 回显数据字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).map((key) => {
        if (datas[key].value == "" + value) {
          actions.push(datas[key].label);
          return false;
        }
      });
      return actions.join("");
    },
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
        managerName: JSON.parse(localStorage.getItem("userInfo")).userName,
        mobile: undefined,
        repaireCode: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    //获取我的工单列表
    getList() {
      this.loading = true;
      this.$request.selectByCodePage(this.params).then((res) => {
        if (res.data.status === 200) {
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
    // 查看按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/detailInfo",
        name: "detailInfo",
        params: {
          type: 2,
          code: row.repaireCode,
        },
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
