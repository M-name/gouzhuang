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
      <el-form ref="form" :model="form" label-width="90px">
        <i class="el-icon-s-custom"></i>
        <span>邀请信息</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="住户姓名:" prop="userName">
              <span>{{ form.userName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住户手机号:" label-width="100px" prop="mobile">
              <span>{{ form.mobile }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="到访目的:" prop="purposeType">
              <span>{{ form.purposeType }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到访房屋:" prop="repairType">
              <span>{{ form.buildingCode }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="放行起始:" prop="reserveTime">
          <span>{{ form.reserveTime }}</span>
        </el-form-item>
        <el-form-item label="放行截止:" prop="expireTime">
          <span>{{ form.expireTime }}</span>
        </el-form-item>
        <el-form-item label="来访备注:" prop="remark">
          <span>{{ form.remark }}</span>
        </el-form-item>
      </el-form>
      <i class="el-icon-s-custom"></i>
      <span>访客信息</span>
      <el-divider></el-divider>
      <div
        v-for="(item, index) in form.visitUsers"
        class="visitor"
        :key="index"
      >
        <div class="visitor-head">
          <img
            v-if="item.visitorImageCodes"
            :src="item.visitorImageCodes"
            alt=""
          />
          <img
            v-if="!item.visitorImageCodes"
            src="@/assets/novisitor.png"
            alt=""
          />
        </div>
        <div class="visitor-info">
          <p>{{ item.visitorName }}</p>
          <span>{{ item.visitorMobile }}</span>
        </div>
        <div class="visitor-car">
          <p>{{ item.plateNumber }}</p>
          <el-button
            v-if="item.visitStatus == 0"
            @click="pass(item)"
            type="primary"
            >放行</el-button
          >
          <el-button v-if="item.visitStatus == 1" disabled type="primary"
            >已放行</el-button
          >
          <el-button v-if="item.visitStatus == 3" disabled type="primary"
            >已取消</el-button
          >
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消邀请</el-button>
        <el-button type="primary" @click="submitForm">批量放行</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      code: undefined,
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
          label: "放行处理",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
          isShow: (row) => {
            return row.visitStatus == 0;
          },
        },
        {
          label: "-",
          icon: "none",
          isShow: (row) => {
            return row.visitStatus != 0;
          },
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "userName", label: " 住户姓名" },
        { prop: "mobile", label: " 住户手机号" },
        {
          prop: "buildingCode",
          label: "到访房屋",
        },
        {
          prop: "accessCode",
          label: "放行密码",
        },
        {
          prop: "visitStatus",
          label: "到访状态",
          type: "select",
          options: [],
        },
        {
          prop: "times",
          label: "到访时间段",
          type: "datePicker",
        },
      ],
      //表格列
      column: [
        { prop: "userName", label: "住户姓名 " },
        { prop: "mobile", label: "住户手机号" },
        { prop: "buildingCode", label: "到访房屋" },
        { prop: "accessCode", label: "放行密码" },
        { prop: "purposeType", label: "来访目的" },
        { prop: "expireTime", label: "来访有效期 " },
        { prop: "reserveTime", label: "来访时间" },
        {
          prop: "visitStatusStr",
          label: "到访状态",
        },
      ],
      // 表格参数
      tableData: [],
      // 批量放行禁用
      allPass: false,
      // 总条数
      total: 0,
      ids: [],
      loading: false,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 表单参数
      form: {},
      dicLists: {},
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        accessCode: undefined,
        visitStatus: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    // 获取访客放行所需字典
    this.$request.userGetEnum().then((res) => {
      let role = [];
      for (var i = 0; i < res.data.data.visitTypeEnum.length; i++) {
        let arr = {};
        arr.value = res.data.data.visitTypeEnum[i].type;
        arr.label = res.data.data.visitTypeEnum[i].value;
        role.push(arr);
      }
      this.dicLists = role;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "visitStatus") {
          item.options = role;
        }
      });
    });
    this.getList();
  },
  methods: {
    // 单个放行
    pass(event) {
      this.form.visitUser = event;
      console.log(this.form);
      this.$request.visitUpdate({ id: event.id }).then((res) => {
        if (res.data.status === 200) {
          this.$request.findByVisitCode(this.code).then((res) => {
            this.form = res.data.data;
          });
          this.msgSuccess("放行成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 批量放行
    submitForm() {
      let ids = [];
      for (var i = 0; i < this.form.visitUsers.length; i++) {
        ids.push(this.form.visitUsers[i].id);
      }
      this.$request.visitUpdateBatch(ids).then((res) => {
        if (res.data.status == 200) {
          this.open = false;
          this.msgSuccess("放行成功");
          this.getList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消邀请
    cancel() {
      let ids = [];
      for (var i = 0; i < this.form.visitUsers.length; i++) {
        ids.push(this.form.visitUsers[i].id);
      }
      ids = ids.toString();
      this.$request.userUpdateCancel(ids.toString()).then((res) => {
        if (res.data.status == 200) {
          this.msgSuccess("取消成功");
          this.open = false;
          this.getList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 放行处理详情
    handleUpdate(row) {
      this.code = row.visitCode;
      this.$request.findByVisitCode(this.code).then((res) => {
        if (res.data.status === 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
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
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        accessCode: undefined,
        visitStatus: undefined,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    //获取列表
    getList() {
      this.loading = true;
      this.$request
        .visitFindPage(this.params)
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

    // 删除
    handleDelete(row) {
      let that = this;
      console.log(this.ids[0]);
      this.$confirm("是否确认删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deptDelDict(row.id).then((res) => {
            if (res.data.status === 200) {
              that.getList();
              that.msgSuccess("删除成功");
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
.operation {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.button {
  height: 50px;
  line-height: 50px;
}
.el-form-item {
  padding: 0;
  margin: 0;
}
/deep/.el-dialog__body {
  padding: 0 20px 20px 20px;
}
.el-divider--horizontal {
  margin: 10px 0;
}
.visitor {
  width: 100%;
  height: 90px;
  border-radius: 3px;
  padding: 5px;
  margin-top: 10px;
  .visitor-head {
    width: 90px;
    height: 90px;
    display: inline-block;
    vertical-align: middle;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .visitor-info {
    display: inline-block;
    height: 90px;
    vertical-align: middle;
    margin-left: 10px;
    p {
      font-size: 14px;
      margin-top: 10px;
    }
    span {
      font-size: 14px;
      margin-top: 30px;
      display: inline-block;
    }
  }
  .visitor-car {
    text-align: right;
    margin-right: 5px;
    height: 90px;
    float: right;
    background: #fff;
    vertical-align: middle;
    p {
      font-size: 20px;
      margin: 10px 0 10px 0;
    }
  }
}
</style>
