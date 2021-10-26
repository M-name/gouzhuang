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
        multiSelect: true, //多选框
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
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "证件编号" },
        { prop: "mobile", label: "电话号码" },
        {
          prop: "processStatus",
          label: "处理状态",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "buildingCode", label: "房屋编码" },
         { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话",
          },
        { prop: "mobile", label: "电话" },
        { prop: "processStatusStr", label: "处理状态" },
         { prop: "createTime", label: "创建时间" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      form: {},
      // 字典列表
      dicLists:{},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        processStatus: undefined,
      },
    };
  },
  created() {
       this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
      this.commonSearchList.forEach((item) => {
       if (item.type == "select" && item.prop == "processStatus") {
          this.dicLists.processStatusEnum.map((res) => {
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
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
         page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        processStatus: undefined,
      };
      this.handleQuery();
    },
    // 查看按钮
    handleCheck(row) {
      this.$router.push({
        path: "/tenantDetail",
        name: "tenantDetail",
        params: {
          isOrNo: row.is,
          id:row.id
        },
      });
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request
        .userRenterList(this.params)
        .then((res) => {
          if (res.data.status === 200) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.records;
            this.params.page = res.data.data.page;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(res.data.msg);
          }
        })
    },

    // 解除绑定
    handleDelete(row) {
      let that = this;
      const id = this.ids[0];
      this.$confirm("是否确认解除绑定?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.buildingUnbind(row.id).then((res) => {
            if (res.data.status === 200) {
              that.getList();
              that.msgSuccess("解除成功");
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
