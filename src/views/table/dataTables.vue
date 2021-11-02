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
      />
    </div>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form"  label-width="110px">
        <el-form-item label="姓名:" prop="userName">
          <el-input
            :disabled="isShow"
            v-model="form.userName"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input
            :disabled="isShow"
            v-model="form.mobile"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="房号:" prop="buildingCode">
          <el-input
            :disabled="isShow"
            v-model="form.buildingCode"
            placeholder="请输入房号"
          />
        </el-form-item>
        <el-form-item label="维修事项:" prop="repairType">
          <el-select
            :disabled="isShow"
            v-model="form.repairType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dictLists.repairEnum"
              :key="item.type"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片:" prop="managerCode">
          <el-upload
            :disabled="isShow"
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadSectionFile"
            :headers="header"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :on-remove="getLocalImgs"
            :file-list="fileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="维修描述:" prop="repairDesc">
          <el-input
            :disabled="isShow"
            v-model="form.repairDesc"
            placeholder="请输入维修描述"
          />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            :disabled="isShow"
            type="textarea"
            autosize
            v-model="form.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{isShow?'受理':'提交'}}</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      isShow: false,
      fileImg: [],
      uploadImgList: [],
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
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
        {
          label: "受理",
          icon: "iconfont icon-accept",
          handler: (row) => this.handleUpdate(row),
        },
      ],
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "buildingCode", label: "房屋编码 " },
        { prop: "userName", label: " 住户姓名" },
        {
          prop: "mobile",
          label: "住户手机",
        },
        {
          prop: "repaireCode",
          label: "工单编号",
        },
        {
          prop: "times",
          label: "提交时间",
          type: "datePicker",
        },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "createTime", label: "提交时间 " },
        { prop: "repaireCode", label: "工单编号", widht: "180" },
        { prop: "repairType", label: "报修类型", widht: "180" },
        { prop: "buildingCode", label: "房屋编码" },
        {
          prop: "userName",
          label: "住户信息",
          render: (h, scope) => {
            return h("div", [scope.row.userName + "/ " + scope.row.mobile]);
          },
        },
        {
          prop: "repaireStatus",
          label: "处理状态",
          formatter: (row, column, index) => {
            return this.selectDictLabel(this.roleStatus, row.repaireStatus);
          },
        },
      ],
      // 表格参数
      tableData: [],
      dictLists: [],
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      // rules: {
      //   userName: [
      //     { required: true, message: "姓名不能为空", trigger: "change" },
      //   ],
      //   mobile: [
      //     { required: true, message: "手机号不能为空", trigger: "change" },
      //     this.$rules.mobile("请输入正确的手机号", "change"),
      //   ],
      //   buildingCode: [
      //     { required: true, message: "房号不能为空", trigger: "change" },
      //   ],
      //   repairType: [
      //     { required: true, message: "维修事项不能为空", trigger: "change" },
      //   ],
      // },
      roleStatus: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        repaireCode: undefined,
        repaireStatus: 10,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      },
    };
  },
  created() {
    this.$request.findRepairAlleuems().then((res) => {
      let role = [];
      let lists = res.data.data;
      this.dictLists = res.data.data;
      for (var i = 0; i < lists.repaireProgressEnum.length; i++) {
        let arr = {};
        arr.value = lists.repaireProgressEnum[i].type;
        arr.label = lists.repaireProgressEnum[i].value;
        role.push(arr);
      }
      this.roleStatus = role;
    });
    this.getList();
  },
  methods: {
    // 删除上传图片
    getLocalImgs(file, fileList) {
      this.uploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          this.uploadImgList.splice(index, 1);
        }
      });
      console.log(this.uploadImgList);
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
        this.uploadImgList.push({
          code: res.data.data.split(",")[0],
          url: res.data.data.split(",")[1],
        });
        console.log(this.fileImg);
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
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
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        userName: undefined,
        mobile: undefined,
        repaireCode: undefined,
        repaireStatus: 10,
        buildingCode: undefined,
        times: undefined,
        endTime: undefined,
        startTime: undefined,
      };
      this.handleQuery();
    },
    // 受理按钮
    handleUpdate(row) {
      this.reset();
      let that = this;
      this.isShow = true;
      const id = row.repaireCode;
      this.$request.selectOrderDetails(id).then((res) => {
       if(res.data.status == 200) {
          this.form = res.data.data;
        if (res.data.data.repaireImageList) {
          const codeList = res.data.data.repaireImageCodes.split(",");
          for (var i = 0; i < res.data.data.repaireImageList.length; i++) {
            that.uploadImgList.push({
              code: codeList[i],
              url: res.data.data.repaireImageList[i],
            });
            that.fileImg.push({
              uid: i,
              url: res.data.data.repaireImageList[i],
            });
          }
        }
        this.open = true;
        this.title = "修改报修";
       }else{
         this.$message.error(res.data.msg);
       }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
      this.$refs.upload.clearFiles();
      this.fileImg = [];
      this.uploadImgList = [];
    },
    // 新增的提交
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const that = this;
          let str = [];
          for (var i = 0; i < this.uploadImgList.length; i++) {
            str.push(this.uploadImgList[i].code);
            console.log(this.uploadImgList[i].code);
          }
          this.form.repaireImageCodes = str.toString();
          if (this.form.createTime) {
            this.$request.repairUpdateRepair(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("受理成功");
                this.open = false;
                this.getList();
                this.$refs.form.resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$request.saveRepair(this.form).then((res) => {
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
        userName: undefined,
        mobile: undefined,
        buildingCode: undefined,
        repairType: undefined,
        repairDesc: undefined,
        remark: undefined,
        repaireImageCodes: undefined,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "新增";
      this.isShow = false;
    },
    //获取报修受理列表
    getList() {
      this.loading = true;
      this.$request
        .getRepairList(this.params)
        .then((res) => {
         if (res.data.status === 200) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.records;
            this.params.page = res.data.data.page;
            this.loading = false;
          } else {
            this.$message.error(res.data.msg);
            this.loading = false;
          }
        })
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
  padding: 30px 40px 30px 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
</style>
