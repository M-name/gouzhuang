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
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
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
       multiple: true,
      // 新闻状态字典
      publishStatusMap: [],
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
           isShow: (row) => {
            return row.publishStatus != 2;
          },
        },
        {
          label: "下线",
           icon: "iconfont icon-offline",
          handler: (row) => this.offline(row),
           isShow: (row) => {
            return row.publishStatus == 2;
          },
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "newsTitle", label: "小区告示标题" },
        {
          prop: "publishStatus",
          label: "发布状态",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "newsTitle", label: "小区告示标题" },
        {
          prop: "publishStatus",
          label: "发布状态",
          widht: "180",
          formatter: (row, column, index) => {
            return this.selectDictLabel(
              this.publishStatusMap,
              row.publishStatus
            );
          },
        },
        { prop: "createBy", label: "创建人", widht: "180" },
        { prop: "publishTime", label: "发布时间" },
        { prop: "createTime", label: "创建时间" },
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
        newsType: 1,
        newsTitle: undefined,
        publishStatus: undefined,
      },
    };
  },
  created() {
    this.$request.findAlleuemsNews().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < Object.keys(lists.publishStatusMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.publishStatusMap)[i];
        arr.label =
          lists.publishStatusMap[Object.keys(lists.publishStatusMap)[i]];
        role.push(arr);
      }
      this.publishStatusMap = role;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "publishStatus") {
          item.options = role;
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
      this.ids = selection.map((item) => item.newsCode);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
        newsType: 1,
        newsTitle: undefined,
        publishStatus: undefined,
      };
      this.handleQuery();
    },
    // 新增
    addList() {
      this.$router.push({
        path: "/detailgar",
        name: "addNew",
        params: {
          code: "1",
        },
      });
    },
    // 修改按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/editDetail",
        name: "editNew",
        params: {
          id: row.id,
        },
      });
    },

    //获取表格列表
    getList() {
      this.loading = true;
      this.$request
        .findByPageNews(this.params)
        .then((res) => {
          if (res.data.status == 200) {
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

    // 删除
    handleDelete(row) {
      let that = this;
      let list = [];
      if (row) {
        list.push(row.id);
      }
      const id = list.length > 0 ? list : this.ids;
      this.$confirm("是否确认删除该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deleteNews(id).then(() => {
            if (res.data.status == 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    // 下线
    offline(rows) {
      let that = this;
      const id = rows.id;
      that.$request.findByIdNews(id).then((res) => {
        that.form = res.data.data;
        that.form.userCode = JSON.parse(
          localStorage.getItem("userInfo")
        ).userCode;
      });
      this.$confirm("是否确认下线该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.offLineUpdate(that.form).then(() => {
            that.getList();
            that.msgSuccess("下线成功");
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
