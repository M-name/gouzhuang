<template>
  <div class="contant">
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
              >新增报事</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="Export"
              >导出Excel</el-button
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
    <!-- 添加或修改字典值 -->
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="报事类型：" prop="businessTypeId">
          <el-select v-model="form.businessTypeId" placeholder="请选择">
            <el-option
              v-for="item in businessDict"
              :key="item.type"
              :label="item.dictName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="住户姓名：" prop="userName">
          <el-input
            class="elinput"
            disabled
            v-model="form.userName"
            placeholder="请输入住户姓名"
          />
          <el-button class="btn-buka" type="primary" @click="choosePeople"
            >选择</el-button
          >
        </el-form-item>
        <el-form-item label="楼栋：" prop="buildingCode">
          <el-cascader
            placeholder="请选择"
            v-model="form.buildingCode"
            :props="codes"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="事件描述：" prop="businessContent">
          <el-input
            type="textarea"
            autosize
            v-model="form.businessContent"
            placeholder="请输入事件描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="住户选择" width="800px" :visible.sync="chooseShow">
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
        :operations="chooseTableOperations"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "filterTable",
  data() {
    let that = this;
    return {
      // 房屋信息级联配置
      codes: {
        value: "code",
        label: "name",
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.data) {
            node.add = "";
          }
          const { level } = node; // 获取当前node对象中的level属性
          if (level == 1) {
            that.build = node.value;
            node.add = node.value;
          } else if (level == 2) {
            that.unit = node.value;
            node.add = that.build + "," + node.value;
          } else if (level == 3) {
            node.add = that.build + "," + that.unit + "," + node.value;
          }
          that.$request
            .houseListAll({
              type: level,
              code: node.add,
            })
            .then((res) => {
              if (res.data.status == 200) {
                const nodes = res.data.data;
                if (level > 1) {
                  nodes.forEach((item) => {
                    item.leaf = level >= 3; //判断是否为末尾节点，这个地方是0,1,2三级
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
      chooseShow: false,
      // 公用搜索组件内容
      commonSearchList: [
        {
          prop: "businessTypeId",
          label: "报事类型",
          type: "select",
          options: [],
        },
        {
          prop: "userName",
          label: "住户姓名",
        },
        {
          prop: "buildingCode",
          label: "楼栋编码",
        },
        {
          prop: "mobile",
          label: "手机号",
        },
        {
          prop: "businessStatus",
          label: "处理状态",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "提交时间段",
          type: "datePicker",
        },
      ],
      //表格操作列内容
      tableOperations: [
        {
          label: "处理录入",
          icon: "iconfont icon-process",
          handler: (row) => this.handleEdit(row),
        },
      ],
      // 表格参数
      tableOptions: {
        border: false, //边框
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      chooseTableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
        border: false, // 边框
      },
      //表格操作列内容
      chooseTableOperations: [
        {
          label: "选择",
          icon: "el-icon-edit",
          handler: (row) => this.choose(row),
        },
      ],
      //用户选择表格列
      chooseColumn: [
        { prop: "userName", label: "用户姓名" },
        { prop: "certificateTypeIdStr", label: "证件类型" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "userSexStr", label: "性别" },
        { prop: "contactMethod", label: "联系人电话" },
        { prop: "mobile", label: "电话" },
        { prop: "liveStatusStr", label: "居住状态" },
      ],
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
      //表格列
      column: [
        { prop: "businessType", label: "报事类型" },
        { prop: "userName", label: "住户姓名" },
        { prop: "buildingCode", label: "楼栋编码" }, //
        { prop: "mobile", label: "手机号" },
        { prop: "businessContent", label: "报事描述" }, //
        { prop: "submitMethodValue", label: "提交方式" }, //
        { prop: "businessStatusValue", label: "处理状态" },
        { prop: "createTime", label: "创建时间" }, //
        { prop: "createBy", label: "提交人" }, //
      ],
      ids: [],
      // 表格参数
      tableData: [],
      chooseTableData: [],
      // 总条数
      total: 0,
      chooseTotal: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        businessTypeId: [
          {
            required: true,
            message: "报事类型未选择",
            trigger: "change",
          },
        ],
        userName: [
          {
            required: true,
            message: "住户未选择",
            trigger: "change",
          },
        ],
        buildingCode: [
          {
            required: true,
            message: "楼栋未选择",
            trigger: "change",
          },
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "change",
          },
        ],
      },
      // 字典列表
      dictList: {},
      // 报事类型
      businessDict: [],
      multiple: true,
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
      // 查询或请求参数
      params: {
        userName: undefined,
        businessTypeId: undefined,
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        buildingCode: undefined,
        mobile: undefined,
        businessStatus: undefined,
      },
    };
  },
  mounted() {
    //   repairGetBusinessDict
    this.$request.repairGetBusinessDict().then((res) => {
      if (res.data.status == 200) {
        this.businessDict = res.data.data;
      }
    });
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
    this.$request.findRepairAlleuems().then((res) => {
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "businessStatus") {
          res.data.data.businessStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
        if (item.type == "select" && item.prop == "businessTypeId") {
          res.data.data.businessTypeEnum.map((res) => {
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
    // 选择所有人按钮操作
    choose(row) {
      this.$request
        .peopleFfindUser({ id: row.id, userCode: row.userCode })
        .then((res) => {
          if (res.data.status == 200) {
            this.form.userName = res.data.data.userName;
            this.form.userCode = res.data.data.userCode;
            this.chooseShow = false;
          }else {
          this.$message.error(res.data.msg);
        }
        });
    },
    chooseGetList() {
      this.chooseLoading = true;
      this.$request.detailAll(this.chooseParams).then((res) => {
        if (res.data.status === 200) {
          this.chooseTableData = res.data.data.rows;
          this.chooseTotal = res.data.data.records;
          this.chooseParams.page = res.data.data.page;
          this.chooseLoading = false;
        } else {
          this.chooseLoading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    chooseHandleQuery() {
      this.chooseParams.page = 1;
      this.chooseGetList();
    },
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
    // 所有人类型选择改变后
    choosePeople() {
      this.chooseShow = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      if (this.params.times) {
        this.params.startTime = this.params.times[0];
        this.params.endTime = this.params.times[1];
      } else {
        this.params.startTime = undefined;
        this.params.endTime = undefined;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        userName: undefined,
        businessTypeId: undefined,
        page: 1,
        pageSize: 20,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
        buildingCode: undefined,
        mobile: undefined,
        businessStatus: undefined,
      };
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 新增的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.buildingCode = this.form.buildingCode.toString();
          this.$request.repairAdd(this.form).then((res) => {
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
      });
    },
    // 表单重置
    reset() {
      this.form = {
        businessTypeId: undefined,
        userName: undefined,
        userCode: undefined,
        buildingCode: undefined,
        mobile: undefined,
        businessContent: undefined,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增业主报事";
    },
    //获取业主报事列表
    getList() {
      this.loading = true;
      this.$request.repairFindBusinessQuery(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
      });
    },
    // 导出
    Export() {
      this.$request.downloadExcelBusiness(this.params);
    },
    //查看二级的跳转
    handleEdit(row) {
      this.$router.push({
        path: "/ownerRepairsDetail",
        name: "ownerRepairsDetail",
        params: {
          code: row.businessCode,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.delet {
  color: #f56c6c;
}
.pagination {
  text-align: center;
  margin-top: 34px;
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
.elinput {
  width: 75%;
}
.btn-buka {
  width: 20%;
  margin-left: 4%;
  color: #fff;
}
.el-cascader {
  width: 100%;
}
/deep/.el-dialog__body {
  padding: 30px 20px 30px 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
</style>
