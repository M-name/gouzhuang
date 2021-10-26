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
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
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
          handler: (row) => this.handleCheck(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "msgParentCode",
          label: "消息类型",
          type: "select",
          options: [],
        },
        {
          prop: "msgTypeCode",
          label: "消息子类型",
          type: "select",
          options: [],
        },
        { prop: "templateCode", label: "模板编码" },
        {
          prop: "msgTitle",
          label: "消息标题",
        },
        {
          prop: "times",
          label: "发送时间段",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "msgParentCodeStr", label: "消息大类" },
        { prop: "msgTypeCodeStr", label: "消息子类" },
        { prop: "batchCode", label: "消息编码" },
        { prop: "msgTitle", label: "消息标题" },
        { prop: "sendChannelIdStr", label: "发送渠道" },
        { prop: "sendTime", label: "发送时间" },
        { prop: "sendBy", label: "发送员工" },
        { prop: "remark", label: "备注" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
      },
    };
  },
  watch: {
    "params.msgParentCode": {
      handler(newName, oldName) {
        if (newName) {
          this.params.msgTypeCode = undefined;
          this.$request
            .msgTemplateTypeList({ type: 1, msgTypeCode: newName })
            .then((res) => {
              this.commonSearchList.forEach((item) => {
                if (item.type == "select" && item.prop == "msgTypeCode") {
                  item.options = [];
                  res.data.data.map((res) => {
                    item.options.push({
                      label: res.msgTypeName,
                      value: res.msgTypeCode,
                    });
                  });
                }
              });
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$request.msgTemplateTypeList({ type: 0 }).then((res) => {
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "msgParentCode") {
          res.data.data.map((res) => {
            item.options.push({
              label: res.msgTypeName,
              value: res.msgTypeCode,
            });
          });
        }
      });
    });
    this.getList();
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsCode);
      this.single = selection.length != 1;
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
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
      };
      this.handleQuery();
    },
    // 查看按钮
    handleCheck(row) {
      this.$router.push({
        path: "/messageManageDetail",
        name: "messageManageDetail",
        params: {
          code: row.batchCode,
        },
      });
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.msgSendBatchList(this.params).then((res) => {
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
