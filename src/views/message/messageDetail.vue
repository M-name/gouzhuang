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
              @click="sendMessage(0)"
              >发送普通消息</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="sendMessage(1)"
              >发送模板消息</el-button
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
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="消息类型" prop="msgTypeCode">
          <el-cascader
            :placeholder="msgTypeName"
            v-model="form.msgTypeCode"
            :props="codes"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="templateDate.templateTitle && sendMsg"
          label="模板标题"
        >
          <el-input
            disabled
            v-model="templateDate.templateTitle"
            placeholder="请输入模板标题"
          />
        </el-form-item>
        <el-form-item label="消息标题" prop="msgTitle">
          <el-input v-model="form.msgTitle" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item
          v-if="!sendMsg"
          label="内容格式："
          prop="plainContentType"
          label-width="130px"
        >
          <el-radio-group v-model="form.plainContentType">
            <el-radio
              v-for="(item, index) in dicList.templateContentFormatEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="!sendMsg"
          label="内容详情："
          prop="content"
          label-width="130px"
        >
          <el-input
            v-if="form.plainContentType == 0"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="请输入内容"
            v-model="form.content"
          >
          </el-input>
          <wang-editor
            :disabled="disableEditor"
            v-else
            ref="wangeditor"
            :content="message"
          />
        </el-form-item>
        <p v-if="checkedKeys.length > 0" class="muban-title">
          <span class="qudao">发送渠道</span><span class="nav">模板内容</span>
        </p>
        <div v-if="checkedKeys.length > 0" class="tree">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            ref="tree"
            :current-node-key="0"
            @check="treeCheck"
            :default-checked-keys="checkedKeys"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div
          v-if="checkedKeys.length > 0"
          v-show="chooseId == 0"
          style="width: 81%; display: inline-block"
        >
          <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
            <el-switch
              :disabled="disableEditor"
              v-model="templateList.inMessage.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item
            label="模板内容类型："
            prop="buildingProp"
            label-width="130px"
          >
            <el-radio-group v-model="templateList.inMessage.contentType">
              <el-radio
                :disabled="disableEditor"
                v-for="(item, index) in dicList.templateContentTypeEnum"
                :label="item.type"
                :key="index"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="模板内容格式："
            prop="buildingProp"
            label-width="130px"
          >
            <el-radio-group
              v-model="templateList.inMessage.templateContentType"
            >
              <el-radio
                :disabled="disableEditor"
                v-for="(item, index) in dicList.templateContentFormatEnum"
                :label="item.type"
                :key="index"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-input
            :disabled="disableEditor"
            v-if="templateList.inMessage.templateContentType == 0"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="请输入内容"
            v-model="templateList.inMessage.content"
          >
          </el-input>
          <wang-editor
            v-else
            ref="inWangeditor"
            :disabled="disableEditor"
            :content="contentMessage.message"
          />
        </div>
        <div
          v-if="checkedKeys.length > 0"
          v-show="chooseId == 1"
          style="width: 81%; display: inline-block"
        >
          <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
            <el-switch
              :disabled="disableEditor"
              v-model="templateList.shortMessage.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item
            label="模板内容类型："
            prop="buildingProp"
            label-width="130px"
          >
            <el-radio-group v-model="templateList.shortMessage.contentType">
              <el-radio
                :disabled="disableEditor"
                v-for="(item, index) in dicList.templateContentTypeEnum"
                :label="item.type"
                :key="index"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-input
            :disabled="disableEditor"
            v-if="templateList.shortMessage.templateContentType == 0"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="请输入内容"
            v-model="templateList.shortMessage.content"
          >
          </el-input>
        </div>
        <div
          v-if="checkedKeys.length > 0"
          v-show="chooseId == 2"
          style="width: 81%; display: inline-block"
        >
          <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
            <el-switch
              :disabled="disableEditor"
              v-model="templateList.mailMessage.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item
            label="模板内容类型："
            prop="buildingProp"
            label-width="130px"
          >
            <el-radio-group v-model="templateList.mailMessage.contentType">
              <el-radio
                :disabled="disableEditor"
                v-for="(item, index) in dicList.templateContentTypeEnum"
                :label="item.type"
                :key="index"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="模板内容格式："
            prop="buildingProp"
            label-width="130px"
          >
            <el-radio-group
              v-model="templateList.mailMessage.templateContentType"
            >
              <el-radio
                :disabled="disableEditor"
                v-for="(item, index) in dicList.templateContentFormatEnum"
                :label="item.type"
                :key="index"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-input
            :disabled="disableEditor"
            v-if="templateList.mailMessage.templateContentType == 0"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="请输入内容"
            v-model="templateList.mailMessage.content"
          >
          </el-input>
          <wang-editor
            v-else
            :disabled="disableEditor"
            ref="mailWangeditor"
            :content="contentMessage.mail"
          />
        </div>
        <el-form-item label="发送对象" prop="sendTo">
          <el-checkbox-group @change="checkedChange" v-model="form.sendTo">
            <el-checkbox
              v-for="(item, index) in dicList.liveTypeEnum"
              :label="item.type"
              :disabled="isall"
              :key="index"
              >{{ item.value }}</el-checkbox
            >
            <el-checkbox :label="4" :disabled="isOne">选择住户</el-checkbox>
          </el-checkbox-group>
          <div v-if="isall">
            <el-input
              class="elinput"
              disabled
              :placeholder="nameList.toString()"
            />
            <el-button class="btn-buka" type="primary" @click="choosePeople"
              >选择</el-button
            >
          </div>
        </el-form-item>
        <el-form-item v-if="!sendMsg" label="发送渠道" prop="sendChannelIds">
          <el-checkbox-group v-model="form.sendChannelIds">
            <el-checkbox
              v-for="(item, index) in dicList.templateChannelEnum"
              :label="item.type"
              :disabled="item.type == 1"
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
    <el-dialog title="住户选择" width="900px" :visible.sync="chooseShow">
      <div style="margin-top: -20px">
        <CommonSearch
          @resetQuery="chooseResetQuery"
          @handleQuery="chooseHandleQuery"
          :queryParams.sync="chooseParams"
          :searchList="chooseSearchList"
        />
      </div>
      <CommonTable
        :total="chooseTotal"
        :loading="chooseLoading"
        :tooltipShow="true"
        :defColumns="chooseColumn"
        @pagination="chooseGetList"
        :dataList="chooseTableData"
        :options="chooseTableOptions"
        :page.sync="chooseParams.page"
        :limit.sync="chooseParams.pageSize"
        @selection-change="handleSelectionChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseSubmitForm">确 定</el-button>
        <el-button @click="chooseCancel">取 消</el-button>
      </div>
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
    let that = this;
    return {
      contentMessage: {
        message: "",
        short: "",
        mail: "",
      },
      //选中的节点
      checkedKeys: [],
      // 选择的渠道id
      chooseId: 0,
      // 发送渠道
      treeData: [],
      // 暂时存放模板数据
      templateList: {
        inMessage: {
          templateChannelId: 0,
          enabled: 1,
          contentType: 0,
          templateContentType: 0,
          content: undefined,
        },
        shortMessage: {
          templateChannelId: 1,
          enabled: 1,
          contentType: 0,
          templateContentType: 0,
          content: undefined,
        },
        mailMessage: {
          templateChannelId: 2,
          enabled: 1,
          contentType: 0,
          templateContentType: 0,
          content: undefined,
        },
      },
      // 富文本禁用
      disableEditor: false,
      rules: {
        msgTypeCode: [
          { required: true, message: "消息类型未选择", trigger: "change" },
        ],
        msgTitle: [
          { required: true, message: "消息标题不能为空", trigger: "change" },
        ],
        content: [
          { required: true, message: "内容详情不能为空", trigger: "change" },
        ],
        sendTo: [
          { required: true, message: "发送对象未选择", trigger: "blur" },
        ],
        sendChannelIds: [
          { required: true, message: "发送渠道未选择", trigger: "blur" },
        ],
      },
      // 模板内容
      templateDate: {},
      message: "",
      msgTypeName: "请选择",
      // 住户禁用判断
      isall: false,
      isOne: false,
      // 消息信息级联配置
      codes: {
        value: "msgTypeCode",
        label: "msgTypeName",
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node; // 获取当前node对象中的level属性
          that.$request
            .msgTemplateTypeList({
              type: level,
              msgTypeCode: node.value,
            })
            .then((res) => {
              if (res.data.status == 200) {
                const nodes = res.data.data;
                if (level >= 1) {
                  nodes.forEach((item) => {
                    item.leaf = level >= 1; //判断是否为末尾节点，这个地方是0,1二级
                  });
                }
                resolve(nodes);
              } else {
                that.$message.error(res.msg);
              }
            });
        },
      },
      //加载状态
      loading: false,
      chooseLoading: false,
      // 非单个禁用
      single: true,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      chooseTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
        border: true, // 边框
      },
      //表格操作列内容
      tableOperations: [
        // {
        //   label: "查看",
        //   icon: "el-icon-edit",
        //   handler: (row) => this.handleCheck(row),
        // },
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
        {
          prop: "msgTitle",
          label: "消息标题",
        },
        { prop: "sendStatus", label: "发送状态", type: "select", options: [] },
        { prop: "sendChannel", label: "发送渠道", type: "select", options: [] },
        { prop: "isRead", label: "读取状态", type: "select", options: [] },

        {
          prop: "times",
          label: "发送时间段",
          type: "datePicker",
        },
      ],
      // 公用搜索组件内容
      chooseSearchList: [
        { prop: "buildingCode", label: "房间编码" },
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateCode", label: "身份证号" },
        { prop: "mobile", label: "电话号码" },
        { prop: "hao", label: "门禁号" },
        {
          prop: "liveType",
          label: "证件类型",
          type: "select",
          options: [],
        },
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
      // 用户查询或请求参数
      chooseParams: {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      },
      //表格列
      column: [
        { prop: "msgParentCodeStr", label: "消息大类" },
        { prop: "msgTypeCodeStr", label: "消息子类" },
        { prop: "msgTitle", label: "消息标题" },
        { prop: "isUseTemplateStr", label: "是否使用模板" },
        { prop: "templateCode", label: "模板编码" },
        { prop: "isBatchSendStr", label: "是否批量发送" },
        { prop: "batchCode", label: "发送批次号" },
        { prop: "currBatchCode", label: "发送编码" },
        { prop: "sendAccount", label: "接收账号" },
        { prop: "isReadStr", label: "是否已读" },
        { prop: "sendChannelStr", label: "发送渠道" },
        { prop: "sendStatusStr", label: "发送状态" },
        { prop: "sendCount", label: "发送次数" },
        { prop: "sendTime", label: "发送时间" },
        { prop: "readTime", label: "读取时间" },
        { prop: "sendBy", label: "发送员工" },
      ],
      chooseColumn: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
      // 表格参数
      tableData: [],
      chooseTableData: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      codeList: [],
      nameList: [],
      selection: [],
      dicList: [],
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
        sendStatus: undefined,
        sendChannel: undefined,
        isRead: undefined,
      },
      // 表单参数
      form: {},
      // 是否显示弹出层
      open: false,
      chooseShow: false,
      // 弹出层标题
      title: "",
      // 是否为模板消息
      sendMsg: false,
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
    "form.msgTypeCode": {
      handler(newName, oldName) {
        let that = this;
        if (newName && newName.length == 2 && this.sendMsg) {
          this.$request.msgSendFind(newName[1]).then((res) => {
            this.templateDate = res.data.data;
            this.form.templateCode = res.data.data.templateCode;
            let arr = [];
            let list = [];
            console.log(res.data.data.list);
            res.data.data.list.forEach((item) => {
              arr.push(item.templateChannelId);

              if (item.templateChannelId == 0) {
                if (item.templateContentType == 1) {
                  this.contentMessage.message = item.content;
                  this.templateList.inMessage = item;
                  this.templateList.inMessage.content = "";
                } else {
                  this.templateList.inMessage = item;
                }
              }
              if (item.templateChannelId == 1) {
                this.templateList.shortMessage = item;
              }
              if (item.templateChannelId == 2) {
                if (item.templateContentType == 1) {
                  this.contentMessage.mail = item.content;
                  this.templateList.mailMessage = item;
                  this.templateList.mailMessage.content = "";
                } else {
                  this.templateList.mailMessage = item;
                }
              }
            });
            this.form.sendChannelIds = arr;
            this.treeData.forEach((res) => {
              for (var i = 0; i < arr.length; i++) {
                if (res.id == arr[i]) {
                  list.push(res);
                }
              }
            });
            this.treeData = list;
            this.checkedKeys = arr;
            this.$nextTick(() => {
              that.$refs.tree.setCheckedKeys(arr);
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$request.detailFindEnum().then((res) => {
      let lists = res.data.data;
      this.chooseSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "liveStatus") {
          lists.liveStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "liveTypeId") {
          lists.reasonEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "liveType") {
          lists.certificateEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
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
    this.$request.msgTemplateFindEnum().then((res) => {
      this.dicList = res.data.data;
      this.dicList.templateChannelEnum.map((res) => {
        this.treeData.push({
          id: res.type,
          label: res.value,
        });
      });
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "sendStatus") {
          this.dicList.msgSendStatus.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "sendChannel") {
          this.dicList.templateChannelEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "isRead") {
          this.dicList.msgIsReadEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.getList();
    this.chooseGetList();
  },
  methods: {
    // 选中的模板
    treeCheck(list, item) {
      console.log(item.checkedKeys);
      this.checkedKeys = item.checkedKeys;
      this.form.sendChannelIds = item.checkedKeys;
      console.log(this.form.sendChannelIds,'check')
    },
    handleNodeClick(data) {
      this.chooseId = data.id;
    },
    // 发送对象为选择住户时
    choosePeople() {
      this.chooseShow = true;
    },
    // 发送对象选择发生改变
    checkedChange(val) {
      console.log(val);
      if (val.length == 0) {
        this.isall = false;
        this.isOne = false;
      } else {
        val.forEach((item) => {
          if (item == 4) {
            this.isall = true;
            this.isOne = false;
          } else {
            this.isall = false;
            this.isOne = true;
          }
        });
      }
    },
    //发送普通/模板消息
    sendMessage(num) {
      this.reset();
      if (num == 0) {
        this.sendMsg = false;
        this.open = true;
        this.title = "创建普通消息";
        this.disableEditor = false;
      } else {
        this.sendMsg = true;
        this.open = true;
        this.title = "创建模板消息";
        this.disableEditor = true;
      }
    },
    // 选择住户确定按钮
    chooseSubmitForm() {
      this.form.list = this.selection.map((item) => item.userCode);
      this.nameList = this.selection.map((item) => item.userName);
      this.chooseShow = false;
    },
    // 新增的提交
    submitForm() {
      let that = this;
      if (this.form.plainContentType == 1) {
        if (this.$refs.wangeditor.editorContent == "") {
          this.$message.error("内容不能为空");
          return;
        } else {
          this.form.content = this.$refs.wangeditor.editorContent;
        }
      }
      this.form.sendTo.forEach((item) => {
        if (item == 0 || item == 1 || item == 2) {
          this.form.list = undefined;
        } else {
          if (this.form.list.length <= 0) {
            this.$message.error("请选择至少一个住户");
          }
        }
      });
      console.log(that.form.sendChannelIds,'length')
      if (this.form.sendChannelIds.length <= 0 && !this.sendMsg) {
        this.$message.error("请选择至少一个发送渠道");
      }
      
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.msgTypeCode = this.form.msgTypeCode[1];
          this.form.sendTo = this.form.sendTo.toString();
          if (this.sendMsg) {
            for (var i = 0; i < this.form.sendChannelIds.length; i++) {
              if (that.form.sendChannelIds[i] == 0) {
                that.form.templateList.push(that.templateList.inMessage);
              } else if (that.form.sendChannelIds[i] == 1) {
                that.form.templateList.push(that.templateList.shortMessage);
              } else if (that.form.sendChannelIds[i] == 2) {
                that.form.templateList.push(that.templateList.mailMessage);
              }
            }
            console.log(that.form.templateList);
            that.form.templateList.map((res) => {
              res.sendChannelIds = res.templateChannelId;
              res.templateChannelId = undefined;
            });
            this.form.sendChannelIds = undefined;
            this.$request.msgSendTemplate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("提交成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
                this.open = false;
              }
            });
          } else {
            this.form.sendChannelIds = this.form.sendChannelIds.toString();
            this.$request.msgSendPlain(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("提交成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    chooseCancel() {
      this.chooseShow = false;
    },
    // 表单重置
    reset() {
      this.form = {
        msgTypeCode: "",
        msgTitle: "",
        plainContentType: 0,
        contentType: 0,
        content: "",
        list: [],
        templateList: [],
        sendTo: [],
        sendChannelIds: [],
      };
      this.isall = false;
      this.isOne = false;
      this.nameList = [];
      this.checkedKeys = [];
      this.templateDate = {};
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
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
        sendStatus: undefined,
        sendChannel: undefined,
        isRead: undefined,
      };
      this.handleQuery();
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
      this.$request.msgSendDetailList(this.params).then((res) => {
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
    //住户搜索
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
    },
    /** 重置按钮操作 */
    chooseResetQuery() {
      this.chooseParams = {
        page: 1,
        pageSize: 10,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
        newsTitle: undefined,
        publishStatus: undefined,
      };
      this.chooseHandleQuery();
    },
    //获取住户列表
    chooseGetList() {
      this.chooseLoading = true;
      this.$request.detailAll(this.chooseParams).then((res) => {
        if (res.data.status === 200) {
          this.chooseTableData = res.data.data.rows;
          this.chooseTotal = res.data.data.records;
          this.chooseParams.page = res.data.data.page;
          this.chooseLoading = false;
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
.elinput {
  width: 80%;
}
.btn-buka {
  width: 15%;
  margin-left: 4%;
}
.muban-title {
  color: #000;
  margin: 20px 0 10px 0;
  font-size: 15px;
  .qudao {
    display: inline-block;
    background: #f0f2f6;
    width: 126px;
    height: 30px;
    text-align: center;
    padding-right: 10px;
    line-height: 30px;
    border-radius: 3px;
  }
  .nav {
    display: inline-block;
    background: #f0f2f6;
    width: 610px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-left: 10px;
    border-radius: 3px;
  }
}
.tree {
  width: 18%;
  display: inline-block;
  vertical-align: top;
}
/deep/.el-tree-node.is-current > .el-tree-node__content {
  background-color: #39a0fc !important;
  color: #fff;
}
/deep/.el-dialog__body{
  padding: 30px 40px  30px 10px;
}
/deep/.el-form-item__content .el-cascader{
  width: 100%;
}
</style>
