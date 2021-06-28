<template>
  <div class="content">
    <div class="wrap">
      <el-button disabled class="el-buttons">
        <img src="@/assets/zongxuanshoushu.png" alt="" />
        <div>
          <p>{{ statusList.candidate }}个</p>
          <p>总选手数</p>
        </div>
      </el-button>
      <el-button disabled class="el-buttons">
        <img src="@/assets/zongpiaoshu.png" alt="" />
        <div>
          <p>{{ statusList.votes }}票</p>
          <p>总票数</p>
        </div>
      </el-button>
      <el-button disabled class="el-buttons">
        <img src="@/assets/zongfangwen.png" alt="" />
        <div>
          <p>{{ statusList.visit }}条</p>
          <p>总访问</p>
        </div>
      </el-button>
      <el-button disabled class="el-buttons">
        <img src="@/assets/jinripiaoshu.png" alt="" />
        <div>
          <p>{{ statusList.today }}票</p>
          <p>今日票数</p>
        </div>
      </el-button>
    </div>
    <div class="operation">
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              >导出Excel</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
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
        :loading="loading"
        :defColumns="column"
        @pagination="getList"
        :dataList="tableData"
        :options="tableOptions"
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
        //    {
        //      label: "查看",
        //      icon: "el-icon-edit",
        //      handler: (row) => this.handleEdit(row),
        //    },
        //    {
        //      label: "修改",
        //      icon: "el-icon-edit",
        //      handler: (row) => this.handleUpdate(row),
        //    },
        //    {
        //      label: "删除",
        //      style: { color: "#F56C6C" },
        //      icon: "el-icon-delete",
        //      handler: (row) => this.handleDelete(row),
        //    },
      ],
      //表格列
      column: [
        { prop: "index", label: "排名 " },
        { prop: "candidateName", label: "选手" },
        { prop: "count", label: "票数" },
        { prop: "visitCount", label: "访问量" },
      ],
      // 表格参数
      tableData: [],
      // 统计参数
      statusList: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    if (this.$route.params.voteCode) {
      localStorage.setItem("rankingCode", this.$route.params.voteCode);
      this.getList(this.$route.params.voteCode);
      this.getStatusList(this.$route.params.voteCode);
    } else {
      this.getList(localStorage.getItem("rankingCode"));
      this.getStatusList(localStorage.getItem("rankingCode"));
    }
  },
  methods: {
    // /** 搜索按钮操作 */
    // handleQuery() {
    //   this.params.page = 1;
    //   if (this.params.times) {
    //     this.params.startTime = this.params.times[0];
    //     this.params.endTime = this.params.times[1];
    //     this.params.times = undefined;
    //   } else {
    //     this.params.startTime = undefined;
    //     this.params.endTime = undefined;
    //   }
    //   this.getList();
    // },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.params = {
    //     page: 1,
    //     pageSize: 20,
    //     buildingCode: undefined,
    //     times: undefined,
    //     endTime: undefined,
    //     startTime: undefined,
    //   };
    //   this.handleQuery();
    // },
    //获取列表
    getList(code) {
      this.loading = true;
      this.$request.voteCandidateRanking({ voteCode: code }).then((res) => {
        if (res.data.status == 200) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].index = i + 1;
          }
          this.tableData = res.data.data;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取列表
    getStatusList(code) {
      this.$request.voteResultStatistics({ voteCode: code }).then((res) => {
        if (res.data.status == 200) {
          this.statusList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
  cursor: default !important;
  img {
    display: inline-block;
    width: 70px;
    height: 70px;
  }
  div {
    display: inline-block;
    vertical-align: top;
    margin-left: 15px;
    p {
      margin-top: 15px;
      font-size: 16px;
      color: #000;
    }
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
</style>