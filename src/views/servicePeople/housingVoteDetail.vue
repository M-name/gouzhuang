<template>
  <div class="content">
    <div class="steps">
      <el-steps :active="active" finish-status="finish" align-center>
        <el-step title="基础信息" description="投票标题，时间，描述"></el-step>
        <el-step title="选手管理" description="管理投票选手"></el-step>
        <el-step title="自定义配置" description="规则"></el-step>
      </el-steps>
    </div>
    <div class="step-item" v-if="active == 0">
      <span style="font-size: 16px">投票基本信息</span>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="投票活动标题" prop="voteTitle">
          <el-input v-model="form.voteTitle" placeholder="请输入活动标题" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投票开始时间:" prop="voteBeginTime">
              <el-date-picker
                clearable
                style="width: 200px"
                v-model="form.voteBeginTime"
                type="datetime"
                :picker-options="startDatePickers"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="起始时间"
              ></el-date-picker
            ></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投票结束时间:" prop="voteEndTime">
              <el-date-picker
                clearable
                style="width: 200px"
                v-model="form.voteEndTime"
                type="datetime"
                :picker-options="endDatePickers"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="截止时间"
              ></el-date-picker
            ></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="投票封面" prop="voteImageUrl">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :http-request="coverUploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :file-list="coverImgFilesList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="栏目内容" prop="columnContent">
          <wang-editor ref="wangeditor" :content="message" />
        </el-form-item>
      </el-form>
    </div>
    <div class="step-item" v-if="active == 1">
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
                >新增选手</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="groupList"
                >管理分组</el-button
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
        />
      </div>
    </div>
    <div class="step-item" v-if="active == 2">
      <span style="font-size: 16px">投票规则</span>
      <el-divider></el-divider>
      <el-form :model="rulesForm" label-width="160px">
        <el-form-item label="周期设置:">
          <el-radio-group v-model="rulesForm.votePeriod">
            <el-radio :label="1">投完不能再投</el-radio>
            <el-radio :label="0">每天都可以投</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每个微信可投票数:">
          <el-input-number
            v-model="rulesForm.voteLimit"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="可为同一选手投的票数:">
          <el-input-number
            v-model="rulesForm.voteCount"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label=" 活动规则:">
          <el-input v-model="rulesForm.content" placeholder="请输入活动规则" />
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-list">
      <el-button
        v-if="active == 0"
        style="margin-top: 12px"
        @click="back($store.getters.rightNav)"
        >返回</el-button
      >
      <el-button v-if="active != 0" style="margin-top: 12px" @click="befor"
        >上一步</el-button
      >
      <el-button v-if="active != 2" style="margin-top: 12px" @click="next"
        >下一步</el-button
      >
      <el-button
        v-if="active == 2"
        style="margin-top: 12px"
        @click="save($store.getters.rightNav)"
        >保存</el-button
      >
      <el-button
        v-if="active == 2"
        style="margin-top: 12px"
        @click="issue($store.getters.rightNav)"
        >发布</el-button
      >
    </div>
    <el-dialog
      :title="title"
      :before-close="playerCancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        ref="playerForm"
        :model="playerForm"
        :rules="playerRules"
        label-width="120px"
      >
        <el-form-item label="选手名称:" prop="candidateName">
          <el-input
            v-model="playerForm.candidateName"
            placeholder="请输入选手名称"
          />
        </el-form-item>
        <el-form-item label="选手副标题:" prop="candidateSubName">
          <el-input
            v-model="playerForm.candidateSubName"
            placeholder="请输入选手副标题"
          />
        </el-form-item>
        <el-form-item label="分组:" prop="groupCode">
          <el-select v-model="playerForm.groupCode" placeholder="请选择分组">
            <el-option
              v-for="item in groupEnum"
              :key="item.type"
              :label="item.groupName"
              :value="item.groupCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选手编号:" prop="candidateOrder">
          <el-input-number
            v-model="playerForm.candidateOrder"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="选手头像:" prop="candidateImageCode">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :file-list="imgFilesList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="选手详情:" prop="candidateOrder">
          <wang-editor
            v-if="open"
            ref="playerWangeditor"
            :content="playerMessage"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="playerSubmitForm">确 定</el-button>
        <el-button @click="playerCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="分组管理"
      :visible.sync="groupOpen"
      width="700px"
      append-to-body
    >
      <div class="operation">
        <div class="button">
          <el-row :gutter="10" class="operations-row">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="addGroup"
                >添加分组</el-button
              >
            </el-col>
          </el-row>
        </div>
        <CommonTable
          :defColumns="groupColumns"
          :dataList="groupTableData"
          :options="tableOptions"
          :operations="groupTableOperations"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="groupCancel">确 定</el-button>
        <el-button @click="groupCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :before-close="groupItemCancel"
      :visible.sync="groupItemOpen"
      width="700px"
      append-to-body
    >
      <el-form
        ref="groupItemForm"
        :model="groupItemForm"
        :rules="groupItemRules"
        label-width="120px"
      >
        <el-form-item label="分组名称:" prop="groupName">
          <el-input
            v-model="groupItemForm.groupName"
            placeholder="请输入分组名称"
          />
        </el-form-item>
        <el-form-item label="分组排序:" prop="groupOrder">
          <el-input-number
            v-model="groupItemForm.groupOrder"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="groupItemSubmitForm">确 定</el-button>
        <el-button @click="groupItemCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import wangEditor from "../../views/editor/wangeditorView";
export default {
  components: {
    wangEditor,
  },
  data() {
    return {
      imgFilesList: [],
      coverImgFilesList: [],
      groupEnum: [],
      fileImg: [],
      header: {
        "Content-Type": "multipart/form-data",
      },
      // 是否显示弹出层
      open: false,
      groupOpen: false,
      groupItemOpen: false,
      // 弹出层标题
      title: "",
      //加载状态
      params: {
        page: 1,
        pageSize: 20,
        candidateName: undefined,
      },
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
      ],
      //表格操作列内容
      groupTableOperations: [
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.groupUpdate(row),
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.groupDelete(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [{ prop: "candidateName", label: " 选手姓名" }],
      //表格列
      column: [
        { prop: "candidateImageUrl", label: "封面", type: "image" },
        { prop: "candidateOrder", label: "编号" },
        { prop: "candidateName", label: "姓名" },
        { prop: "groupName", label: "分组" },
        { prop: "candidateSubName", label: "选手标题" },
        {
          prop: "count",
          label: "选手数据 ",
          width: "220",
          render: (h, scope) => {
            return h("div", [
              h(
                "div",
                {
                  style: { color: "#666", display: "block" },
                },
                "票数:" + scope.row.count
              ),
              h(
                "div",
                {
                  style: { color: "#666", display: "block" },
                },
                "状态:" + scope.row.candidateStatusStr
              ),
              h(
                "div",
                {
                  style: { color: "#666", display: "block" },
                },
                "创建时间:" + scope.row.createTime
              ),
            ]);
          },
        },
      ],
      groupColumns: [
        { prop: "groupName", label: "标题" },
        { prop: "groupOrder", label: "排序" },
      ],
      // 表格参数
      tableData: [],
      groupTableData: [],
      // 总条数
      total: 0,
      loading: false,
      startDatePickers: this.beginDates(),
      endDatePickers: this.processDates(),
      // 富文本默认内容
      message: "",
      playerMessage: "",
      active: 0,
      // 表单参数
      form: {
        voteTitle: undefined,
        voteBeginTime: undefined,
        voteEndTime: undefined,
        voteContent: undefined,
      },
      playerForm: {
        candidateName: undefined,
        candidateOrder: undefined,
        candidateSubName: undefined,
        candidateImageCode: undefined,
        groupCode: undefined,
        candidateImageCode: undefined,
      },
      groupItemForm: {
        groupName: undefined,
        groupOrder: 0,
      },
      rulesForm: {
        voteLimit: 10,
        voteCount: 5,
        votePeriod: 0,
        content: "选出你心中最优秀的TA吧",
      },
      // 投票编码
      voteCode: 1026775450386432,
      type: "",
      // 表单校验
      rules: {
        voteTitle: [
          { required: true, message: "栏目名称不能为空", trigger: "change" },
        ],
        voteBeginTime: [
          { required: true, message: "开始时间未选择", trigger: "change" },
        ],
        voteEndTime: [
          { required: true, message: "结束时间未选择", trigger: "change" },
        ],
      },
      playerRules: {
        candidateName: [
          { required: true, message: "选手名称不能为空", trigger: "change" },
        ],
        candidateImageCode: [
          { required: true, message: "头像不能为空", trigger: "change" },
        ],
      },
      groupItemRules: {
        groupName: [
          { required: true, message: "选手名称不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.type) {
      if (this.$route.params.type == "update") {
        localStorage.setItem("voteCode", this.$route.params.voteCode);
        localStorage.setItem("voteType", this.$route.params.type);
        this.voteCode = this.$route.params.voteCode;
        this.type = this.$route.params.type;
        this.getVoteDetail(this.$route.params.voteCode);
      }
    } else if (localStorage.getItem("voteType") == "update") {
      this.voteCode = localStorage.getItem("voteCode");
      this.type = localStorage.getItem("voteType");
      this.getVoteDetail(localStorage.getItem("voteCode"));
    }
    this.$request.voteGetEnum();
  },
  methods: {
    // 获取投票基础详情
    getVoteDetail(code) {
      this.coverImgFilesList = [];
      this.$request.voteFind(code).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.message = res.data.data.voteContent;
          if (res.data.data.voteImageUrl) {
            this.coverImgFilesList.push({
              name: "cover.jpg",
              url: res.data.data.voteImageUrl,
            });
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 发布
    issue(tabItem) {
      if (this.rulesForm.content.length <= 0) {
        this.$message.error("活动规则不能为空");
        return;
      }
      this.rulesForm.voteCode = this.voteCode;
      this.$request.voteRuleCreate(this.rulesForm).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("发布成功");
          this.$request.voteUpdateStatus({
            voteCode: this.voteCode,
            voteStatus: 1,
          });
          const that = this;
          that.$router.go(-1);
          that.$store.dispatch("removeTab", {
            tabItem,
            fullPath: this.$route.fullPath,
            router: this.$router,
          });
        }
      });
    },
    // 保存
    save(tabItem) {
      if (this.rulesForm.content.length <= 0) {
        this.$message.error("活动规则不能为空");
        return;
      }
      this.rulesForm.voteCode = this.voteCode;
      this.$request.voteRuleCreate(this.rulesForm).then((res) => {
        if (res.data.status == 200) {
          this.$message.success("保存成功");
          const that = this;
          that.$router.go(-1);
          that.$store.dispatch("removeTab", {
            tabItem,
            fullPath: this.$route.fullPath,
            router: this.$router,
          });
        }
      });
    },
    // 删除选手
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该选手?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.voteCandidateDel(row.id).then((res) => {
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
    // 修改选手按钮
    handleUpdate(row) {
      this.imgFilesList = [];
      this.$request.voteGroupList({ voteCode: this.voteCode }).then((res) => {
        this.groupEnum = res.data.data;
      });
      this.reset();
      const id = row.id;
      this.$request.voteFindCandidate(id).then((res) => {
        if (res.data.status == 200) {
          this.playerForm = res.data.data;
          this.playerMessage = res.data.data.candidateContent;
          this.imgFilesList.push({
            name: "head.jpg",
            url: res.data.data.candidateImageUrl,
          });
          this.open = true;
          this.title = "修改选手";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改分组按钮
    groupUpdate(row) {
      this.groupItemReset();
      this.$request.voteFindGroup(row.id).then((res) => {
        if (res.data.status == 200) {
          this.groupItemForm = res.data.data;
          this.groupItemOpen = true;
          this.title = "修改分组";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 添加分组按钮
    addGroup() {
      this.groupItemReset();
      this.groupItemOpen = true;
      this.title = "添加分组";
    },
    // 删除分组
    groupDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该分组?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.voteGroupDel(row.id).then((res) => {
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
    // 新增的提交
    playerSubmitForm() {
      if (this.$refs.playerWangeditor.editorContent == "") {
        this.$message.error("内容不能为空");
        return;
      } else {
        this.playerForm.candidateContent =
          this.$refs.playerWangeditor.editorContent;
      }
      this.$refs["playerForm"].validate((valid) => {
        if (valid) {
          if (this.playerForm.createTime) {
            this.$request.voteCandidateUpdate(this.playerForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$refs.playerForm.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$request.voteCandidateCreate(this.playerForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.$refs.playerForm.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    // 分组提交
    groupItemSubmitForm() {
      this.$refs["groupItemForm"].validate((valid) => {
        if (valid) {
          if (this.groupItemForm.createTime) {
            this.$request.voteGroupUpdate(this.groupItemForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.groupItemOpen = false;
                this.getGroupList();
                this.$refs.groupItemForm.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.groupItemForm.voteCode = this.voteCode;
            this.$request.voteGroupCreate(this.groupItemForm).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                this.groupItemOpen = false;
                this.getGroupList();
                this.$refs.groupItemForm.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        this.fileImg.push(obj);
        this.playerForm.candidateImageCode = res.data.data.split(",")[0];
      });
    },
    // 上传封面
    coverUploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        const url = res.data.data.split(",")[1];
        const obj = { url };
        //    this.fileImg.push(obj);
        this.form.voteImageCode = res.data.data.split(",")[0];
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 新增选手
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加选手";

      // 查询分组
      this.$request.voteGroupList({ voteCode: this.voteCode }).then((res) => {
        this.groupEnum = res.data.data;
      });
      // 查询编码
      this.$request
        .voteCandidateOrder({ voteCode: this.voteCode })
        .then((res) => {
          if (res.data.status == 200) {
            this.playerForm.candidateOrder = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 分组管理
    groupList() {
      this.getGroupList();
      this.groupOpen = true;
    },
    // 分组取消
    groupCancel() {
      this.groupOpen = false;
    },
    // 取消按钮
    playerCancel() {
      this.open = false;
      this.reset();
      this.$refs.playerForm.resetFields();
    },
    groupItemCancel() {
      this.groupItemOpen = false;
      this.groupItemReset();
      this.$refs.groupItemForm.resetFields();
    },
    // 表单重置
    reset() {
      this.playerForm = {
        candidateName: undefined,
        candidateOrder: undefined,
        candidateSubName: undefined,
        candidateImageCode: undefined,
        groupCode: undefined,
        candidateImageCode: undefined,
        voteCode: this.voteCode,
      };
      this.imgFilesList = [];
      this.playerMessage = "";
    },
    groupItemReset() {
      this.groupItemForm = {
        groupName: undefined,
        groupOrder: 0,
      };
    },
    //返回
    back(tabItem) {
      const that = this;
      that.$router.go(-1);
      that.$store.dispatch("removeTab", {
        tabItem,
        fullPath: this.$route.fullPath,
        router: this.$router,
      });
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
        candidateName: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.params.voteCode = this.voteCode;
      this.$request.voteCandidateList(this.params).then((res) => {
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
    // 获取分组列表
    getGroupList() {
      this.$request.voteGroupList({ voteCode: this.voteCode }).then((res) => {
        if (res.data.status == 200) {
          this.groupTableData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //确定开始时间和结束时间
    beginDates() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.voteEndTime) {
            //如果结束时间不为空，则小于结束时间
            return new Date(self.form.voteEndTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDates() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.voteBeginTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.form.voteBeginTime).getTime() > time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    // 上一步
    befor() {
      if (this.active <= 0) {
        this.active = 2;
      } else {
        this.active--;
      }
      console.log(this.active);
    },
    // 下一步
    next() {
      if (this.active == 0) {
        if (this.$refs.wangeditor.editorContent == "") {
          this.$message.error("内容不能为空");
          return;
        } else {
          this.form.voteContent = this.$refs.wangeditor.editorContent;
          this.message = this.$refs.wangeditor.editorContent;
        }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.createTime) {
              this.$request.voteUpdate(this.form).then((res) => {
                if (res.data.status === 200) {
                  if (this.active > 2) {
                    this.active = 0;
                  } else {
                    this.active++;
                  }
                  this.getList();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else {
              this.$request.voteCreate(this.form).then((res) => {
                if (res.data.status === 200) {
                  this.voteCode = res.data.data.voteCode;
                  if (this.active > 2) {
                    this.active = 0;
                  } else {
                    this.active++;
                  }
                  this.getList();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          }
        });
      } else if (this.active == 1 && this.type == "update") {
        console.log(this.type);
        this.$request.voteFindRule(this.voteCode).then((res) => {
          if (res.data.status == 200) {
            this.rulesForm = res.data.data;
            if (this.active > 2) {
              this.active = 0;
            } else {
              this.active++;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        if (this.active > 2) {
          this.active = 0;
        } else {
          this.active++;
        }
      }

      console.log(this.active);
    },
  },
};
</script>
<style lang="scss" scoped>
.steps {
  background: #fff;
  padding: 20px 0;
}
.btn-list {
  background: #fff;
  text-align: center;
  padding: 20px 0;
}
.step-item {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
}
/deep/.el-date-editor {
  width: 100% !important;
}
.operation {
  background: #fff;
  padding: 0 20px 0 20px;
}
.button {
  height: 50px;
  line-height: 50px;
  float: right;
}
.common-search {
  padding: 0 0 0 15px;
}
.btn-list {
  padding: 0 0 15px 0;
}
/deep/.pagination-container {
  padding: 10px 16px !important;
}
</style>
<style lang="scss">
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.w-e-toolbar {
  z-index: 2 !important;
}
</style>