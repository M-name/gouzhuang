<template>
  <div class="content">
    <div class="wrap">
      <el-button class="el-buttons" type="warning">
        <p>{{ satticsList.notStarted }}</p>
        <p>未开始投票</p>
      </el-button>
      <el-button class="el-buttons" type="success">
        <p>{{ satticsList.conduct }}</p>
        <p>进行中投票</p>
      </el-button>
      <el-button class="el-buttons" type="danger">
        <p>{{ satticsList.end }}</p>
        <p>已结束投票</p>
      </el-button>
      <el-button class="el-buttons" type="primary">
        <p>{{ satticsList.userCount }}</p>
        <p>投票选手总计</p>
      </el-button>
    </div>

    <div class="operation">
      <div style="padding-right: 20px; background: #fff">
        <CommonSearch
          @resetQuery="resetQuery"
          @handleQuery="handleQuery"
          :queryParams.sync="params"
          :searchList="commonSearchList"
        />
      </div>
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="addList"
              >创建投票</el-button
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
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "编辑",
          icon: "iconfont icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "结果排名",
          icon: "iconfont icon-rank",
          handler: (row) => this.ranking(row),
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
          isShow: (row) => {
            return this.isDelete(row);
          },
        },
        {
          label: "发布",
          icon: "iconfont icon-publish",
          handler: (row) => this.handleIssue(row),
          isShow: (row) => {
            return row.voteStatus == 0;
          },
        },
        {
          label: "下线",
          icon: "iconfont icon-offline",
          handler: (row) => this.handleOffline(row),
          isShow: (row) => {
            return row.voteStatus == 1 || row.voteStatus == 0;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "voteTitle",
          label: "标题",
        },
      ],
      // 是否显示弹出层
      open: false,
      detailOpen: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "voteTitle", label: "标题" },
        { prop: "candidateTotalNum", label: "选手数量" },
        { prop: "voteTotalNum", label: "投票数" },
        { prop: "visitTotalNum", label: "访问数" },
        { prop: "voteStatusStr", label: "状态" },
        {
          prop: "voteBeginTime",
          label: "活动时间",
          render: (h, scope) => {
            return h("div", [
              h(
                "div",
                {
                  style: { color: "#666", display: "block" },
                },
                scope.row.voteBeginTime
              ),
              h(
                "div",
                {
                  style: { color: "#666", display: "block" },
                },
                scope.row.voteEndTime
              ),
            ]);
          },
        },
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
        voteTitle: undefined,
      },
      satticsList: {},
    };
  },
  created() {
    this.getList();
    this.getStatis();
  },
  methods: {
    // 删除按钮是否显示的判断
    isDelete(row) {
      if (row.voteStatus == 0 || row.voteStatus == 2) {
        return true;
      } else if (row.voteStatus == 1) {
        var currentTime = new Date();
        let customTime = row.voteBeginTime.replace("-", "/"); //替换字符，变成标准格式
        customTime = new Date(Date.parse(customTime));
        if (currentTime < customTime) {
          return true;
        } else {
          false;
        }
      }
    },
    // 获取统计信息
    getStatis() {
      this.$request.voteStatistics().then((res) => {
        if (res.data.status == 200) {
          this.satticsList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        voteTitle: undefined,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/housingVoteDetail",
        name: "housingVoteDetail",
        params: {
          type: "update",
          voteCode: row.voteCode,
        },
      });
    },
    // 查看排名
    ranking(row) {
      this.$router.push({
        path: "/voteRanking",
        name: "voteRanking",
        params: {
          voteCode: row.voteCode,
        },
      });
    },
    // 新增
    addList() {
      this.$router.push({
        path: "/housingVoteDetail",
        name: "housingVoteDetail",
        params: {
          type: "add",
        },
      });
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request.voteList(this.params).then((res) => {
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

    // 删除
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该投票?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.voteDel(row.id).then((res) => {
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
    // 发布
    handleIssue(row) {
      let that = this;
      this.$confirm("是否确认发布该投票?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request
            .voteUpdateStatus({
              voteCode: row.voteCode,
              voteStatus: 1,
            })
            .then((res) => {
              if (res.data.status == 200) {
                that.getList();
                that.msgSuccess("发布成功");
              } else {
                that.$message.error(res.data.msg);
              }
            });
        })

        .catch(function () {});
    },
    // 下线
    handleOffline(row) {
      let that = this;
      this.$confirm("是否确认下线该投票?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request
            .voteUpdateStatus({
              voteCode: row.voteCode,
              voteStatus: 2,
            })
            .then((res) => {
              if (res.data.status == 200) {
                that.getList();
                that.msgSuccess("下线成功");
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
.wrap {
  display: flex;
  justify-content: space-between;
}
.el-buttons {
  width: 23%;
  height: 120px;
  text-align: left;
  p {
    margin-top: 10px;
    font-size: 16px;
  }
}
.operation {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
.common-search {
  padding-left: 0;
}
</style>