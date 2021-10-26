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
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="姓名:">
              <span>{{ form.userName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="手机号:">
              <span>{{ form.mobile }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="证件类型:">
              <span>{{ form.certificateTypeStr }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="证件号码:">
              <span>{{ form.certificateNo }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="住户性别:">
              <span>{{ form.sexStr }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="出生日期:">
              <span>{{ form.birthday }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="姓名:">
              <span>{{ form.userName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="楼栋门牌号:">
              <span>{{ form.userAddr }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="单位（学校）名称:">
              <span>{{ form.enterpriseName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="身体状况:">
              <span>{{ form.physicalStatusStr }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="不适症状:">
              <span>{{ form.uncomfortableStatus }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="摸排信息:">
              <span>{{ form.healthCodeStr }}</span>
            </el-form-item></el-col
          >
        </el-row>
          <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="杭州健康码:">
              <span>{{ form.uncomfortableStatus }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="摸排信息:">
              <span>{{ form.personTypeStr }}</span>
            </el-form-item></el-col
          >
        </el-row>
          <el-row :gutter="20">
          <el-col :span="12"
            ><el-form-item label="人员类型:">
              <span>{{ form.uncomfortableStatus }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12"
            ><el-form-item label="居住类型:">
              <span>{{ form.liveTyppeStr }}</span>
            </el-form-item></el-col
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 表单参数
      form: {},
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
          label: "查看详情",
          icon: "el-icon-tickets",
          handler: (row) => this.handleEdit(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: " 住户姓名" },
        { prop: "mobile", label: " 住户手机号" },
      ],
      //表格列
      column: [
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "住户手机号" },
        { prop: "certificateTypeStr", label: "证件类型" },
        { prop: "certificateNo", label: "证件号码" },
        { prop: "sexStr", label: "住户性别" },
        { prop: "birthday", label: "出生日期" },
        { prop: "userAddr", label: "楼栋门牌号" },
        { prop: "enterpriseName", label: "单位（学校）名称" },
        { prop: "physicalStatusStr", label: "身体状况" },
        { prop: "uncomfortableStatus", label: "不适症状" },
        { prop: "inspectStatusStr", label: "摸排信息" },
        { prop: "healthCodeStr", label: "杭州健康码" },
        { prop: "personTypeStr", label: "人员类型" },
        { prop: "liveTyppeStr", label: "居住类型" },
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
      this.$request.healthList(this.params).then((res) => {
        if (res.data.status == 200) {
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
    // 查看
    handleEdit(row) {
      this.form = row;
      this.open = true;
      this.title = "查看详情";
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
