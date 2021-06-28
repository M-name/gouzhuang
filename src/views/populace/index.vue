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
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="addList"
              >新增</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="single"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col> -->
        </el-row>
      </div>
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
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleCheck(row),
        },
        {
          label: "解除绑定",
          style: { color: "#F56C6C" },
          icon: "iconfont icon-unbind",
          handler: (row) => this.handleDelete(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "证件编号" },
        { prop: "mobile", label: "电话号码" },
        {
          prop: "liveStatus",
          label: "居住状态",
          type: "select",
          options: [],
        },
        {
          prop: "liveTypeId",
          label: "住户类型",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "liveTypeIdStr", label: "住户类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      form: {},
      // 字典列表
      dicLists: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        liveStatus: undefined,
        liveTypeId: undefined,
      },
    };
  },
  created() {
    this.$request.detailFindEnum().then((res) => {
      this.dicLists = res.data.data;
      let lists = res.data.data;
      let live = [];
      let rea = [];
      let cert = [];
      for (var i = 0; i < lists.liveStatusEnum.length; i++) {
        let arr = {};
        arr.value = lists.liveStatusEnum[i].type;
        arr.label = lists.liveStatusEnum[i].value;
        live.push(arr);
      }
      for (var i = 0; i < lists.liveTypeEnum.length; i++) {
        let arr = {};
        arr.value = lists.liveTypeEnum[i].type;
        arr.label = lists.liveTypeEnum[i].value;
        rea.push(arr);
      }
      for (var i = 0; i < lists.certificateEnum.length; i++) {
        let arr = {};
        arr.value = lists.certificateEnum[i].type;
        arr.label = lists.certificateEnum[i].value;
        cert.push(arr);
      }
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "liveStatus") {
          item.options = live;
        }
        if (item.type == "select" && item.prop == "liveTypeId") {
          item.options = rea;
        }
        if (item.type == "select" && item.prop == "certificateTypeId") {
          item.options = cert;
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
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        userName: undefined,
        certificateCode: undefined,
        mobile: undefined,
        liveStatus: undefined,
        liveTypeId: undefined,
      };
      this.handleQuery();
    },
    // 新增
    addList() {
      this.$router.push({
        path: "/addPeople",
        name: "addPeople",
      });
    },
    // 修改按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/editPeople",
        name: "editPeople",
        params: {
          code: row.userCode,
          id: row.id,
        },
      });
    },
    // 查看按钮
    handleCheck(row) {
      this.$router.push({
        path: "/peopleDetail",
        name: "peopleDetail",
        params: {
          code: row.userCode,
        },
      });
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.detailAll(this.params).then((res) => {
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
