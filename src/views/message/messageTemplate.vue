<template>
  <div>
    <div style="padding-right: 20px; background: #fff">
      <CommonSearch
        @resetQuery="resetQuery"
        @handleQuery="handleQuery"
        :queryParams.sync="params"
        :searchList="commonSearchList"
      />
    </div>
    <div class="contant">
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              size="small"
              type="primary"
              @click="addList"
              icon="el-icon-circle-plus-outline"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="{ background: '#F4F4F4' }"
          :data="tableData"
        >
          <el-table-column
            v-for="(item, index) in column"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
            <template slot-scope="scope">
              <el-switch
                v-if="item.type === 'switch'"
                v-model="scope.row.enabled"
                :active-value="1"
                :inactive-value="0"
                @change="changeSwitch(scope.row)"
              />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdata(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                class="delet"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 添加或修改字典值 -->
      <el-dialog
        :before-close="cancel"
        :visible.sync="open"
        width="700px"
        append-to-body
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
          label-position="right"
        >
          <i class="el-icon-s-custom"></i>
          <span>模板基本信息</span>
          <el-divider></el-divider>
          <el-form-item label="子消息类型" prop="msgTypeCode">
            <el-cascader
              :placeholder="msgTypeName"
              v-model="form.msgTypeCode"
              :props="codes"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="模板标题" prop="templateTitle">
            <el-input
              v-model="form.templateTitle"
              placeholder="请输入模板标题"
            />
          </el-form-item>
          <i class="el-icon-s-custom"></i>
          <span>模板详情</span>
          <el-divider></el-divider>
          <p class="muban-title">
            <span class="qudao">发送渠道</span><span class="nav">模板内容</span>
          </p>
          <div class="tree">
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
          <div v-show="chooseId == 0" style="width: 81%; display: inline-block">
            <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
              <el-switch
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
                  v-for="(item, index) in dicList.templateContentFormatEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-input
              v-if="templateList.inMessage.templateContentType == 0"
              type="textarea"
              :autosize="{ minRows: 10 }"
              placeholder="请输入内容"
              v-model="templateList.inMessage.content"
            >
            </el-input>
            <wang-editor
              v-else
              ref="wangeditor"
              :content="contentMessage.message"
            />
          </div>
          <div v-show="chooseId == 1" style="width: 81%; display: inline-block">
            <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
              <el-switch
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
                  v-for="(item, index) in dicList.templateContentTypeEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-input
              v-if="templateList.shortMessage.templateContentType == 0"
              type="textarea"
              :autosize="{ minRows: 10 }"
              placeholder="请输入内容"
              v-model="templateList.shortMessage.content"
            >
            </el-input>
            <!-- <wang-editor v-else ref="shortWangeditor" /> -->
          </div>
          <div v-show="chooseId == 2" style="width: 81%; display: inline-block">
            <el-form-item label="是否启用：" prop="isUsing" label-width="130px">
              <el-switch
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
                  v-for="(item, index) in dicList.templateContentFormatEnum"
                  :label="item.type"
                  :key="index"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-input
              v-if="templateList.mailMessage.templateContentType == 0"
              type="textarea"
              :autosize="{ minRows: 10 }"
              placeholder="请输入内容"
              v-model="templateList.mailMessage.content"
            >
            </el-input>
            <wang-editor
              v-else
              ref="mailWangeditor"
              :content="contentMessage.mail"
            />
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">提 交</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import wangEditor from "../../views/editor/wangeditorView";
export default {
  name: "filterTable",
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
      msgTypeName: "",
      // 发送渠道
      treeData: [],
      // 选择的渠道id
      chooseId: 0,
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
      // 是否显示弹出层
      open: false,
      //表格列
      column: [
        { prop: "msgParentCodeStr", label: "消息大类", widht: "180" },
        { prop: "msgTypeCodeStr", label: "消息子类" },
        { prop: "templateCode", label: "模板编码" },
        { prop: "templateTitle", label: "模板标题" },
        { prop: "enabled", label: "是否启用", type: "switch" },
        { prop: "createTime", label: "创建时间" },
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
        { prop: "templateCode", label: "模板编码" },
        { prop: "templateTitle", label: "模板标题" },
      ],
      // 所需字典列表
      dicList: [],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        templateTitle: [
          { required: true, message: "模板标题不能为空", trigger: "change" },
        ],
        msgTypeCode: [
          { required: true, message: "子消息类型未选择", trigger: "change" },
        ],
      },
      //选中的节点
      checkedKeys: [],
      // 查询或请求参数
      params: {
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
        templateTitle: undefined,
        page: 1,
        pageSize: 20,
      },
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
  },
  mounted() {
    this.$request.msgTemplateFindEnum().then((res) => {
      this.dicList = res.data.data;
      this.dicList.templateChannelEnum.map((res) => {
        this.treeData.push({
          id: res.type,
          label: res.value,
        });
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
    this.getList();
  },
  methods: {
    handleNodeClick(data) {
      this.chooseId = data.id;
    },
    // 表格单个禁用
    changeSwitch(row) {
      this.$request
        .msgTemplateIsEnabled({ id: row.id, enabled: row.enabled })
        .then((res) => {
          // if (res.data.status === 200) {
          //   this.msgSuccess("修改成功");
          //   this.open = false;
          //   this.getList();
          //   this.$refs.form.resetFields();
          // }
        });
    },
    // 修改按钮
    handleUpdata(index, row) {
      this.reset();
      const id = row.id;
      let that = this;
      this.$request.msgTemplateFind(id).then((res) => {
        this.form = res.data.data;
        this.dicList.msgTypeDictEnum.forEach((res) => {
          if ((res.msgTypeCode = this.form.msgTypeCode)) {
            that.msgTypeName = res.msgTypeName;
          }
        });
        let arr = [];
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
        this.open = true;
        this.checkedKeys = arr;
        this.$nextTick(() => {
          that.$refs.tree.setCheckedKeys(arr);
        });
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 新增的提交
    submitForm() {
      let list = [];
      try {
        this.checkedKeys.forEach((item, index, array) => {
          if (item == 0) {
            if (this.templateList.inMessage.templateContentType == 1) {
              if (this.$refs.wangeditor.editorContent == "") {
                throw new Error("站内信模板内容不能为空");
              } else {
                this.templateList.inMessage.content =
                  this.$refs.wangeditor.editorContent;
              }
            } else {
              if (
                this.templateList.inMessage.content == undefined ||
                this.templateList.inMessage.content == ""
              ) {
                throw new Error("站内信模板内容不能为空");
              }
            }
            list.push(this.templateList.inMessage);
          } else if (item == 1) {
            if (
              this.templateList.shortMessage.content == undefined ||
              this.templateList.shortMessage.content == ""
            ) {
              throw new Error("短信模板内容不能为空");
            }
            // }
            list.push(this.templateList.shortMessage);
          } else if (item == 2) {
            if (this.templateList.mailMessage.templateContentType == 1) {
              if (this.$refs.mailWangeditor.editorContent == "") {
                throw new Error("邮件模板内容不能为空");
              } else {
                this.templateList.mailMessage.content =
                  this.$refs.mailWangeditor.editorContent;
              }
            } else {
              if (
                this.templateList.mailMessage.content == undefined ||
                this.templateList.mailMessage.content == ""
              ) {
                throw new Error("邮件模板内容不能为空");
              }
            }
            list.push(this.templateList.mailMessage);
          }
        });
      } catch (e) {
        this.$message.error(e.message);
        return;
      }

      this.form.list = list;
      let that = this;
      console.log(this.form.list);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.list.length <= 0) {
            that.$message.warning("请选择需要提交的模板");
            return;
          }
          if (this.form.createTime) {
            this.$request.msgTemplateUpdate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.form.msgTypeCode = this.form.msgTypeCode[1];
            this.$request.msgTemplateCreate(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
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
    // 表单重置
    reset() {
      this.form = {
        msgTypeCode: "",
        templateTitle: "",
      };
      this.templateList = {
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
      };
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCurrentKey(0);
      });
      this.msgTypeName = "";
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 搜索重置按钮操作 */
    resetQuery() {
      this.params = {
        msgParentCode: undefined,
        msgTypeCode: undefined,
        templateCode: undefined,
        templateTitle: undefined,
        page: 1,
        pageSize: 20,
      };
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "msgTypeCode") {
          item.options = [];
        }
      });
      this.handleQuery();
    },
    // 新增
    addList() {
      this.reset();
      this.open = true;
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request
        .msgTemplateList(this.params)
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

    // 修改条数的监听
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    // 修改页数的监听
    handleCurrentChange(val) {
      this.s.page = val;
      this.getList();
    },

    // 删除
    handleDelete(index, row) {
      let that = this;
      this.$confirm("是否确认删除该字典值?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.feeDelFirst(row.id).then(() => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })

        .catch(function () {});
    },
    // 选中的模板
    treeCheck(list, item) {
      console.log(list, item.checkedKeys);
      this.checkedKeys = item.checkedKeys;
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  background: #fff;
  height: 50px;
}
.contant {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.delet {
  color: #f56c6c;
}
.pagination {
  text-align: center;
  margin-top: 34px;
}

/deep/.el-input__inner {
  height: 32px;
}
/deep/.el-input__icon {
  height: 115%;
}
.button {
  height: 50px;
  line-height: 50px;
}
.el-divider--horizontal {
  margin: 10px 0;
}
/deep/.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
// /deep/.is-focusable{
//   background: #000;
// }
// /deep/.is-current{
//   background: #000;
// }
/deep/.el-tree-node.is-current > .el-tree-node__content {
  background-color: #39a0fc !important;
  color: #fff;
}
// /deep/.el-tree-node__content {
//   background-color: #66b1ff87;
// }
.el-form-item {
  margin-bottom: 0px;
}
.muban-title {
  color: #000;
  margin: 20px 0 10px 0;
  font-size: 15px;
  .qudao {
    display: inline-block;
    background: #f0f2f6;
    width: 90px;
    height: 30px;
    text-align: right;
    padding-right: 10px;
    line-height: 30px;
    border-radius: 3px;
  }
  .nav {
    display: inline-block;
    background: #f0f2f6;
    width: 545px;
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
.el-form-item__content .el-cascader {
  width: 100% !important;
}
</style>
