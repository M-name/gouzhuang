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
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
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
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号:" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工编号:" prop="managerCode">
              <el-input
                v-model="form.managerCode"
                placeholder="请输入员工编号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工姓名:" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱:" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="员工性别:" prop="userSex">
          <el-radio v-model="form.userSex" :label="1">男</el-radio>
          <el-radio v-model="form.userSex" :label="0">女</el-radio>
        </el-form-item>
        <!-- <el-form-item label="员工生日:" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="所在部门:" prop="deptCode">
          <el-select v-model="form.deptCode" placeholder="请选择">
            <el-option
              v-for="item in deptList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工角色：" prop="roleCode">
          <el-select v-model="form.roleCode" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态：" prop="userStatus">
          <el-select v-model="form.userStatus" placeholder="请选择">
            <el-option
              v-for="item in userStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户口所在地:" prop="areaCode">
          <el-cascader
            v-model="form.areaCode"
            :props="props"
            :options="areaList"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="currAddr">
          <el-input v-model="form.currAddr" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="岗位状态:" prop="postStatus">
          <el-select v-model="form.postStatus" placeholder="请选择">
            <el-option
              v-for="item in postStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            autosize
            v-model="form.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    var email =
      /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/; //邮箱验证
    var namereg = /^[\u4E00-\u9FA5A-Za-z]+$/; //姓名验证
    var phone = /^1(3|4|5|6|7|8|9)\d{9}$/; //手机号验证
    let isName = (rule, value, callback) => {
      if (value != undefined && value != "") {
        if (!namereg.test(value)) {
          return callback(new Error("请输入正确的姓名"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let isPhone = (rule, value, callback) => {
      if (value != undefined && value != "") {
        if (!phone.test(value)) {
          return callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let isEmail = (rule, value, callback) => {
      if (value != undefined && value != "") {
        if (!email.test(value)) {
          return callback(new Error("请输入正确邮箱"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      // 级联配置
      props: {
        value: "areaCode",
        label: "areaName",
      },
      //加载状态
      loading: false,
      // 非单个禁用
      single: true,
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
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "realName", label: "员工姓名" },
        { prop: "managerCode", label: "员工编号" },
        {
          prop: "deptCode",
          label: "所属部门",
          type: "select",
          options: [],
        },
        {
          prop: "postStatus",
          label: "在岗状态",
          type: "select",
          options: [],
        },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 在岗状态列表
      postStatusList: [],
      //部门列表
      deptList: [],
      // 角色列表
      roleList: [],
      // 地区级联列表
      areaList: [],
      // 角色状态列表
      userStatusList: [],
      //表格列
      column: [
        { prop: "realName", label: "员工姓名" },
        { prop: "managerCode", label: "员工编号", widht: "180" },
        { prop: "deptCode", label: "所属部门", widht: "180" },
        {
          prop: "postStatus",
          label: "在岗状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(this.postStatusList, row.postStatus);
          },
        },
        { prop: "currAddr", label: "现住址" },
        { prop: "createTime", label: "创建时间" },
        { prop: "remark", label: "备注" },
      ],
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          { validator: isPhone, trigger: "blur" },
        ],
        managerCode: [
          { required: true, message: "员工编号不能为空", trigger: "change" },
        ],
        realName: [
          { required: true, message: "员工姓名不能为空", trigger: "change" },
          { validator: isName, trigger: "blur" },
        ],
        email: [
          { required: true, message: "电子邮箱不能为空", trigger: "change" },
          { validator: isEmail, trigger: "blur" },
        ],
        userSex: [
          { required: true, message: "员工性别不能为空", trigger: "change" },
        ],
        // birthday: [
        //   { required: true, message: "员工生日不能为空", trigger: "change" },
        // ],
        deptCode: [
          { required: true, message: "所在部门不能为空", trigger: "change" },
        ],
        roleCode: [
          { required: true, message: "员工角色不能为空", trigger: "change" },
        ],
        userStatus: [
          { required: true, message: "员工状态不能为空", trigger: "change" },
        ],
        areaCode: [
          { required: true, message: "户口所在地不能为空", trigger: "change" },
        ],
        currAddr: [
          { required: true, message: "详细地址不能为空", trigger: "change" },
        ],
        postStatus: [
          { required: true, message: "岗位状态不能为空", trigger: "change" },
        ],
      },
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        deptCode: undefined,
        managerCode: undefined,
        realName: undefined,
        postStatus: undefined,
      },
    };
  },
  created() {
    this.$request.areaListAll().then((res) => {
      this.areaList = res.data.data;
    });
    // 字典处理
    this.$request.propertyFindEnum().then((res) => {
      let role = [];
      let dept = [];
      let status = [];
      let userStatus = [];
      let lists = res.data.data;
      for (var i = 0; i < Object.keys(lists.deptMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.deptMap)[i];
        arr.label = lists.deptMap[Object.keys(lists.deptMap)[i]];
        dept.push(arr);
      }
      for (var i = 0; i < Object.keys(lists.postStatusMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.postStatusMap)[i];
        arr.label = lists.postStatusMap[Object.keys(lists.postStatusMap)[i]];
        arr.value = parseFloat(arr.value);
        status.push(arr);
      }
      for (var i = 0; i < Object.keys(lists.roleMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.roleMap)[i];
        arr.label = lists.roleMap[Object.keys(lists.roleMap)[i]];

        role.push(arr);
      }
      for (var i = 0; i < Object.keys(lists.userStatusMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.userStatusMap)[i];
        arr.label = lists.userStatusMap[Object.keys(lists.userStatusMap)[i]];
        arr.value = parseFloat(arr.value);
        userStatus.push(arr);
      }
      this.roleList = role;
      this.postStatusList = status;
      this.deptList = dept;
      this.userStatusList = userStatus;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "postStatus") {
          item.options = status;
        }
        if (item.type == "select" && item.prop == "deptCode") {
          item.options = dept;
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
      this.ids = selection.map((item) => item.userCode);
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
        deptCode: undefined,
        managerCode: undefined,
        roleCode: undefined,
        postStatus: undefined,
      };
      this.handleQuery();
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      const id = row.userCode || this.ids[0];
      this.$request.propertyFindOne(id).then((res) => {
        if (res.data.status === 200) {
          res.data.data.areaCode = res.data.data.areaCode.split(",");
          this.form = res.data.data;
          this.open = true;
          this.title = "修改";
        } else {
          this.$message.error(res.data.msg);
        }
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
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.areaCode = this.form.areaCode.toString();
          if (this.form.createTime) {
            this.$request.propertyUpdate(this.form).then((res) => {
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
            this.$request.propertyCreate(this.form).then((res) => {
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
        mobile: undefined,
        managerCode: undefined,
        realName: undefined,
        email: undefined,
        userSex: 1,
        birthday: undefined,
        deptCode: undefined,
        roleCode: undefined,
        postStatus: undefined,
        remark: undefined,
        userStatus: undefined,
        createBy: JSON.parse(localStorage.getItem("userInfo")).userCode,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    //获取字典列表
    getList() {
      this.loading = true;
      this.$request
        .propertyAll(this.params)
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
        .catch((err) => {
          console.log(err);
        });
    },

    // 删除
    handleDelete() {
      let that = this;
      const id = this.ids[0];
      this.$confirm("是否确认删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.deptDelDict(id).then(() => {
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
/deep/.el-dialog__body {
  padding: 30px 30px 30px 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
/deep/.el-form-item__content .el-cascader {
  width: 100%;
}
</style>
