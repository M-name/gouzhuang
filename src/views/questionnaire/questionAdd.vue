<template>
  <div class="contant">
    <div class="accomplish">
      <div
        v-for="(item, index) in questionData"
        :key="index"
        class="accomplish-list"
      >
        <div v-if="update.id == item.id && update.show">
          <div class="addquestion">
            <div style="display: inline-block; width: 10%">
              <el-input
                v-model="updateInfo.questionOrder"
                placeholder="题目序号"
              ></el-input>
            </div>
            <div
              style="
                display: inline-block;
                width: 74%;
                margin-bottom: 10px;
                margin-top: 10px;
              "
            >
              <el-input
                placeholder="请输入内容"
                v-model="updateInfo.questionName"
                class="input-with-select"
              >
              </el-input>
            </div>
            <div style="display: inline-block; width: 15%">
              <el-select v-model="updateInfo.answerType" placeholder="请选择">
                <el-option
                  v-for="item in dictList.answerTypeEnum"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type"
                >
                </el-option>
              </el-select>
            </div>
            <el-button
              v-show="!updateIsAnswer"
              @click="chooseGroup('update')"
              size="small"
              type="text"
              icon="el-icon-plus"
              >选择选项组</el-button
            >
            <div v-show="!updateIsAnswer" class="choose">
              <el-radio
                v-for="(item, index) in updateInfo.optionList"
                label="1"
                :key="index"
                >{{ item.optionName }}</el-radio
              >
              <el-button
                @click="chooseGroup('update')"
                style="float: right"
                size="small"
                type="text"
                >重新选择</el-button
              >
            </div>
            <div class="bottom-btn">
              <el-button size="small" @click="updateCancel">取 消</el-button>
              <el-button size="small" @click="updateSave" type="primary"
                >保 存</el-button
              >
            </div>
          </div>
        </div>
        <div v-else>
          <p>
            <span>{{ item.questionOrder }},</span
            ><span>{{ item.questionName }}({{ item.answerTypeStr }})</span>
          </p>
          <div class="button">
            <el-button @click="questionUpdate(item)" type="text">修改</el-button
            ><el-button
              style="color: #f56c6c"
              @click="deleteQuestion(item)"
              type="text"
              >删除</el-button
            >
          </div>
          <div class="choose">
            <el-radio
              v-for="(row, indexs) in item.optionList"
              :key="indexs"
              label="1"
              >{{ row.optionName }}</el-radio
            >
          </div>
        </div>
      </div>
      <div class="addquestion">
        <p>新增问卷题目</p>
        <div style="display: inline-block; width: 10%">
          <el-input
            v-model="questionInfo.questionOrder"
            placeholder="题目序号"
          ></el-input>
        </div>
        <div
          style="
            display: inline-block;
            width: 74%;
            margin-bottom: 10px;
            margin-top: 10px;
          "
        >
          <el-input
            placeholder="题目"
            v-model="questionInfo.questionName"
            class="input-with-select"
          >
          </el-input>
        </div>
        <div style="display: inline-block; width: 15%">
          <el-select v-model="questionInfo.answerType" placeholder="题目类型">
            <el-option
              v-for="item in dictList.answerTypeEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </div>
        <el-button
          v-show="!isAnswer"
          @click="chooseGroup('add')"
          size="small"
          type="text"
          icon="el-icon-plus"
          >选择选项组</el-button
        >
        <div v-show="!isAnswer" class="choose">
          <el-radio v-for="(item, index) in groupList" label="1" :key="index">{{
            item
          }}</el-radio>
          <el-button
            v-if="groupList"
            @click="chooseGroup('add')"
            style="float: right"
            size="small"
            type="text"
            >重新选择</el-button
          >
        </div>
        <div class="bottom-btn">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" @click="save" type="primary">保 存</el-button>
        </div>
      </div>
    </div>
    <div class="flooter">
      <el-button @click="goBack('next',$store.getters.rightNav)">上一步</el-button>
      <el-button @click="goBack('submit',$store.getters.rightNav)" type="primary">提交</el-button>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="addGroup"
              >自定义选项组</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-table
        :header-cell-style="{ background: '#F4F4F4' }"
        :data="tableData"
      >
        <el-table-column
          v-for="(item, index) in column"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : ''"
          :key="index"
        ></el-table-column>
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleChoose(scope.row)"
              >选择</el-button
            >
            <el-button
              style="color: #f56c6c"
              size="mini"
              type="text"
              @click="deleteGroup(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :title="addGroupTitle"
      :visible.sync="addGroupOpen"
      width="700px"
      append-to-body
    >
      <div class="add-box">
        <p>注意：选项组添加顺序即为显示顺序</p>
        <div class="group-title">
          选项组名称：<el-input
            size="small"
            class="demo-input-label"
            placeholder="请输入内容"
            v-model="addGroupInfo.groupName"
          >
          </el-input>
        </div>
        <div class="group-item">
          <el-input
            v-for="(item, index) in addGroupInfo.optionList"
            :key="index"
            size="small"
            class="demo-input-item"
            placeholder="请输入选项"
            v-model="item.optionName"
          >
          </el-input>
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="addItem"
            >自定义选项</el-button
          >
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelGroup">取 消</el-button>
        <el-button size="small" type="primary" @click="submitGroup"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 是否为简答题判断
      isAnswer: false,
      updateIsAnswer: false,
      questionInfo: {
        questionOrder: undefined,
        questionName: undefined,
        answerType: undefined,
        groupCode: undefined,
        surveyCode: 1005541097775104,
      },
      groupType: "",
      updateInfo: {},
      // 修改问题
      update: {
        id: undefined,
        show: false,
      },
      // 是否显示弹出层
      open: false,
      addGroupOpen: false,
      // 弹出层标题
      // 新增选项组参数
      addGroupInfo: {
        groupName: undefined,
        optionList: [
          {
            displayOrder: 0,
            optionName: undefined,
          },
        ],
      },
      title: "",
      addGroupTitle: "",
      //选项组表格数据
      tableData: [],
      questionData: [],
      //字典列表
      dictList: [],
      // 新建题目时选择的选项组
      groupList: undefined,
      // 表格列
      column: [
        { prop: "groupName", label: "选项组名称", width: "140" },
        { prop: "optionCodes", label: "选项" },
      ],
    };
  },
  watch: {
    "questionInfo.answerType": {
      handler(newName, oldName) {
        if (newName == 2) {
          this.isAnswer = true;
          this.groupList = undefined;
          this.questionInfo.groupCode = undefined;
        } else {
          this.isAnswer = false;
        }
      },
      deep: true,
      immediate: true,
    },
    "updateInfo.answerType": {
      handler(newName, oldName) {
        if (newName == 2) {
          this.updateIsAnswer = true;
          this.updateInfo.optionList = [];
          this.updateInfo.groupCode = undefined;
        } else {
          this.updateIsAnswer = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // 获取上级传递参数
    if (this.$route.params.code) {
      localStorage.setItem("surveyCode", this.$route.params.code);
      this.questionInfo.surveyCode = this.$route.params.code;
    } else {
      this.questionInfo.surveyCode = localStorage.getItem("surveyCode");
    }
  },
  mounted() {
    // 获取字典值
    this.$request.surveyFindEnum().then((res) => {
      this.dictList = res.data.data;
    });
    // 获取问题列表和选项组列表
    this.getList();
    this.getQuestionList();
  },
  methods: {
    // 提交选项组
    submitGroup() {
      this.$request.surveyGroupCreate(this.addGroupInfo).then((res) => {
        if (res.data.status == 200) {
          this.addGroupOpen = false;
          this.getList();
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 新增选项组取消操作
    cancelGroup() {
      this.addGroupOpen = false;
    },
    // 上一步或提交
    goBack(str,tabItem) {
      if(str == 'submit') {
        this.$message.success("提交成功");
      }
      this.$router.go(-1);
      this.$store.dispatch("removeTab", {
        tabItem,
        fullPath: this.$route.fullPath,
        router: this.$router,
      });
    },
    // 新增选项
    addItem() {
      this.addGroupInfo.optionList.push({
        displayOrder: this.addGroupInfo.optionList.length,
        optionName: undefined,
      });
    },
    // 添加选项组按钮
    addGroup() {
      this.addGroupOpen = true;
      this.addGroupTitle = "自定义选项组";
      this.addGroupInfo = {
        groupName: undefined,
        optionList: [
          {
            displayOrder: 0,
            optionName: undefined,
          },
        ],
      };
    },
    //获取表格列表
    getList() {
      this.$request.surveyGroupList().then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取题目列表
    getQuestionList() {
      this.$request
        .surveyQuestionList(this.questionInfo.surveyCode)
        .then((res) => {
          if (res.data.status == 200) {
            this.questionData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 选择选项组
    chooseGroup(type) {
      this.open = true;
      this.title = "选择选项组";
      this.groupType = type;
    },
    // 选项组列选择
    handleChoose(row) {
      if (this.groupType == "add") {
        this.questionInfo.groupCode = row.groupCode;
        this.groupList = row.optionCodes.split(",");
      } else {
        this.updateInfo.groupCode = row.groupCode;
        let arr = [];
        row.optionCodes.split(",").map((item) => {
          arr.push({
            optionName: item,
          });
        });
        this.updateInfo.optionList = arr;
      }
      this.open = false;
    },
    // 选项组删除
    deleteGroup(row) {
      let that = this;
      const id = row.groupCode;
      this.$confirm("是否确认删除该选项组?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.surveyDelGroup(id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
    },
    // 取消按钮
    cancel() {
      this.questionInfo = Object.assign(this.questionInfo, {
        questionOrder: undefined,
        questionName: undefined,
        answerType: undefined,
        groupCode: undefined,
      });
      this.groupList = undefined;
    },
    updateCancel() {
      this.update = {
        id: undefined,
        show: false,
      };
    },
    // 修改问题
    questionUpdate(row) {
      if (this.update.show) {
        this.$message.error("请先保存上一个修改的问题");
      } else {
        this.update = {
          id: row.id,
          show: true,
        };
        this.updateInfo = row;
      }
    },
    // 问题删除
    deleteQuestion(row) {
      let that = this;
      const id = row.id;
      this.$confirm("是否确认删除该题目?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.surveyDelQuestion(id).then(() => {
            that.getQuestionList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
    },
    // 保存按钮
    save() {
      this.$request.surveyQuestionCreate(this.questionInfo).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("保存成功");
          this.cancel();
          this.getQuestionList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    updateSave() {
      this.$request.surveyQuestionUpdate(this.updateInfo).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("保存成功");
          this.updateCancel();
          this.getQuestionList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  padding: 20px 100px;
  background: #fff;
  .accomplish {
    .accomplish-list {
      margin-top: 15px;
      p {
        display: inline-block;
        vertical-align: middle;
      }
      span {
        margin-right: 5px;
      }
      .button {
        // display: inline-block;
        float: right;
        vertical-align: middle;
        .el-button {
          padding: 0;
        }
      }
      .choose {
        margin-top: 10px;
        padding-left: 20px;
      }
    }
  }
  .flooter {
    text-align: center;
    margin-top: 20px;
    button {
      width: 120px;
    }
  }
}
.addquestion {
  background: #f0f2f5;
  padding: 10px;
  margin-top: 70px;
  p {
    color: #409eff;
  }
}
.bottom-btn {
  text-align: right;
  margin-top: 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
.add-box {
  p {
    color: #409eff;
  }
  .demo-input-label {
    display: inline-block;
    width: 530px;
  }
  .group-title {
    margin-top: 10px;
  }
  .group-item {
    margin-top: 10px;
    .demo-input-item {
      display: inline-block;
      width: 100px;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>