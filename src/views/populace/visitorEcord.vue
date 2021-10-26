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
        @selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      // 非单个禁用
      single: true,
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
        { prop: "visitorName", label: " 访客姓名" },
        { prop: "visitorMobile", label: " 访客手机号" },
        {
          prop: "buildingCode",
          label: "到访房屋",
        },
        { prop: "userName", label: " 住户姓名" },
        { prop: "mobile", label: " 住户手机号" },
        {
          prop: "visitStatus",
          label: "到访状态",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "到访时间段",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "visitorName", label: "访客姓名 " },
        { prop: "visitorMobile", label: "访客手机号" },
        { prop: "userName", label: "邀请住户" },
        { prop: "mobile", label: " 住户手机号" },
        { prop: "purposeType", label: "来访目的" },
        { prop: "buildingCode", label: "到访房屋 " },
        { prop: "reserveTime", label: "实际到访时间" },
        { prop: "expireTime", label: "来访有效期" },
        {
          prop: "visitStatusValue",
          label: "到访状态",
        },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      loading: false,
      dicLists: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        visitorName: undefined,
        visitorMobile: undefined,
        userName: undefined,
        mobile: undefined,
        visitStatus: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    // 获取访客放行所需字典
    this.$request.userGetEnum().then((res) => {
      let role = [];
      for (var i = 0; i < res.data.data.visitStatusEnum.length; i++) {
        let arr = {};
        arr.value = res.data.data.visitStatusEnum[i].type;
        arr.label = res.data.data.visitStatusEnum[i].value;
        role.push(arr);
      }
      this.dicLists = role;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "visitStatus") {
          item.options = this.dicLists;
        }
      });
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
        // this.params.times = undefined;
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
        visitorName: undefined,
        visitorMobile: undefined,
        userName: undefined,
        mobile: undefined,
        visitStatus: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.visitFindPageLog(this.params).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
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
          that.$request.deptDelDict(row.id).then((res) => {
            if (res.data.status === 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
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
