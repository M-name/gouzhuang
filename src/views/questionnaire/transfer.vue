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
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="900px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题:" prop="surveyTitle">
          <el-input v-model="form.surveyTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="问卷状态:" prop="surveyStatus">
          <el-select v-model="form.surveyStatus" placeholder="请选择">
            <el-option
              v-for="item in dictList.surveyStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="surveyBeginTime">
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="form.surveyBeginTime"
            :picker-options="startDatePicker"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="起始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="surveyEndTime">
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="form.surveyEndTime"
            type="date"
            :picker-options="endDatePicker"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="截止时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="封面图:" prop="surveyImageCode">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :file-list="fileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介:" prop="surveyContent">
          <wang-editor ref="wangeditors" :content="this.form.surveyContent" />
        </el-form-item>
        <el-form-item label="问卷范围:" prop="surveyScope">
          <el-checkbox-group v-model="form.surveyScope">
            <el-checkbox
              v-for="(item, index) in dictList.liveTypeEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import wangEditor from "../../views/editor/wangeditorView";
export default {
  name: "userControl",
  components: {
    wangEditor,
  },
  data() {
    return {
      form: {
        surveyTitle: undefined,
        surveyStatus: 0,
        surveyBeginTime: undefined,
        surveyEndTime: undefined,
        surveyImageCode: undefined,
        surveyContent: "",
        surveyScope: [],
      },
      // 表单校验
      rules: {
        surveyTitle: [this.$rules.requiredSelect("标题不能为空", "change")],
        surveyStatus: [this.$rules.requiredSelect("问卷状态未选择", "change")],
        surveyBeginTime: [
          this.$rules.requiredSelect("起始时间未选择", "change"),
        ],
        surveyEndTime: [this.$rules.requiredSelect("截止时间未选择", "change")],
        surveyScope: [this.$rules.requiredSelect("问卷范围不能为空", "blur")],
      },
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      // 是否显示弹出层
      open: false,
      //控住结束时间晚于开始时间
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      // 弹出层标题
      title: "",
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
      // 重用或者修改
      updataOrReusing: "",
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "发布",
         icon: "iconfont icon-publish",
          handler: (row) => this.handleStatus(1, row),
          isShow: (row) => {
            return row.surveyStatus == 0;
          },
        },
        {
          label: "下线",
          icon: "iconfont icon-offline",
          handler: (row) => this.handleStatus(2, row),
          isShow: (row) => {
            return row.surveyStatus == 1;
          },
        },
        {
          label: "作废",
          icon: "iconfont icon-cancel",
          handler: (row) => this.handleStatus(3, row),
          isShow: (row) => {
            return row.surveyStatus == 1;
          },
        },
        {
          label: "重用",
          icon: "iconfont icon-restart",
          handler: (row) => this.handleUpdate("reusing", row),
          isShow: (row) => {
            return row.surveyStatus != 0;
          },
        },
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate("update", row),
          isShow: (row) => {
            return row.surveyStatus == 0;
          },
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
          isShow: (row) => {
            return row.surveyStatus == 0;
          },
        },
        {
          label: "查看",
          icon: "el-icon-tickets",
          handler: (row) => this.handleCheack(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "surveyTitle", label: "问卷标题" },
        {
          prop: "surveyStatus",
          label: "问卷状态",
          type: "select",
          options: [],
        },
      ],
      //表格列
      column: [
        { prop: "surveyTitle", label: "问卷标题" },
        { prop: "surveyStatusStr", label: "问卷状态" },
        { prop: "surveyScopeStr", label: "问卷对象" },
        { prop: "surveyBeginTime", label: "问卷起始" },
        { prop: "surveyEndTime", label: "问卷截止" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      ids: [],
      dictList: [],
      fileImg: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        surveyTitle: undefined,
        surveyStatus: undefined,
      },
    };
  },
  created() {
    this.$request.surveyFindEnum().then((res) => {
      let lists = res.data.data;
      this.dictList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "surveyStatus") {
          lists.surveyStatusEnum.map((res) => {
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
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.fileImg.push(obj);
        if (this.form.surveyImageCode != undefined) {
          this.form.surveyImageCode =
            this.form.surveyImageCode + "," + res.data.data.split(",")[0];
        } else {
          this.form.surveyImageCode = res.data.data.split(",")[0];
        }
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //确定开始时间和结束时间
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.surveyEndTime) {
            //如果结束时间不为空，则小于结束时间
            return new Date(self.form.surveyEndTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.surveyBeginTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.form.surveyBeginTime).getTime() > time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    // 提交
    submitForm() {
      if (this.$refs.wangeditors.editorContent == "") {
        this.$message.error("简介不能为空");
        return;
      } else {
        this.form.surveyContent = this.$refs.wangeditors.editorContent;
      }
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.surveyScope = this.form.surveyScope.toString();
          if (this.form.createTime) {
            if (that.updataOrReusing == "update") {
              this.$request.surveyUpdate(this.form).then((res) => {
                if (res.data.status == 200) {
                  this.$router.push({
                    path: "/questionAdd",
                    name: "questionAdd",
                    params: {
                      code: res.data.data,
                    },
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else if (that.updataOrReusing == "reusing") {
              this.$request.surveyReusing(this.form).then((res) => {
                if (res.data.status == 200) {
                  this.$router.push({
                    path: "/questionAdd",
                    name: "questionAdd",
                    params: {
                      code: res.data.data,
                    },
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          } else {
            this.$request.surveyCreatet(this.form).then((res) => {
              if (res.data.status == 200) {
                this.$router.push({
                  path: "/questionAdd",
                  name: "questionAdd",
                  params: {
                    code: res.data.data,
                  },
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsCode);
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
        surveyTitle: undefined,
        surveyStatus: undefined,
      };
      this.handleQuery();
    },
    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加问卷";
    },
    // 修改按钮
    handleUpdate(str, row) {
      this.reset();
      const id = row.id;
      this.$request.surveyFind(id).then((res) => {
        res.data.data.surveyScope = res.data.data.surveyScope
          .split(",")
          .map(Number);
        this.form = res.data.data;
        this.open = true;
        this.updataOrReusing = str;
        if (str == "update") {
          this.title = "修改问卷";
        } else {
          this.title = "重用问卷";
        }
      });
    },
    // 删除按钮
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该问卷?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.surveyDel(row.id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
    },
    // 发布或下线或作废调查问卷
    handleStatus(index, row) {
      let that = this;
      let str = "";
      if (index == 1) {
        str = "发布";
      } else if (index == 2) {
        str = "下线";
      } else if (index == 3) {
        str = "作废";
      }
      this.$confirm("是否确认" + str + "该问卷?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          const arr = { id: row.id, status: index };
          that.$request.surveyUpdateStatus(arr).then(() => {
            that.getList();
            that.msgSuccess(str + "成功");
          });
        })

        .catch(function () {});
    },
    // 查看按钮
    handleCheack(row) {
      this.$router.push({
        path: "/questionDetail",
        name: "questionDetail",
        params: {
          code: row.surveyCode,
          id:row.id
        },
      });
    },
    //获取表格列表
    getList() {
      this.loading = true;
      this.$request.surveyList(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 表单重置
    reset() {
      this.form = {
        surveyTitle: undefined,
        surveyStatus: 0,
        surveyBeginTime: undefined,
        surveyEndTime: undefined,
        surveyImageCode: undefined,
        surveyContent: "",
        surveyScope: [],
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
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
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
/deep/.el-dialog__body{
  padding: 30px 30px  30px 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
</style>
