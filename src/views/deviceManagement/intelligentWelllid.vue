<template>
  <div class="content">
    <div class="static">
      <div class="static-item yunxing">
        <img src="@/assets/zhengzaiyunxing.png" alt="" />
        <div>
          <p>正在运行</p>
          <span class="num">{{statics.deviceCount}}<span style="font-size: 18px">台</span></span>
        </div>
      </div>
      <div class="static-item lixian">
        <img src="@/assets/lixianshebei.png" alt="" />
        <div>
          <p>离线设备</p>
          <span class="num">{{statics.offLineCount}}<span style="font-size: 18px">台</span></span>
        </div>
      </div>
      <div class="static-item daichuli">
        <img src="@/assets/gaojingdaichuli.png" alt="" />
        <div>
          <p>告警待处理</p>
          <span class="num">{{statics.pendingCount}}<span style="font-size: 18px">条</span></span>
        </div>
      </div>
      <div class="static-item yichang">
        <img src="@/assets/yichanggaojing.png" alt="" />
        <div>
          <p>异常告警</p>
          <span class="num">{{statics.alarmCount}}<span style="font-size: 18px">条</span></span>
        </div>
      </div>
    </div>
    <div class="list">
      <el-tabs v-model="activeName">
        <el-tab-pane label="设备档案" name="first">
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
                  <el-button type="primary" icon="el-icon-download" size="mini"
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
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="运行数据" name="second"
          ><CommonTable
            :total="heartbeatTotal"
            :loading="heartbeatLoading"
            :defColumns="heartbeatColumn"
            @pagination="heartbeatGetList"
            :dataList="heartbeatTableData"
            :options="tableOptions"
            :page.sync="heartbeatParams.page"
            :limit.sync="heartbeatParams.pageSize"
        /></el-tab-pane>
        <el-tab-pane label="异常告警" name="third"
          ><CommonTable
            :total="alarmTotal"
            :loading="alarmLoading"
            :defColumns="alarmColumn"
            @pagination="alarmGetList"
            :dataList="alarmTableData"
            :options="tableOptions"
            :page.sync="alarmParams.page"
            :limit.sync="alarmParams.pageSize"
        /></el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="设备编码：" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备种类：" prop="deviceCategoryId">
          <el-select v-model="form.deviceCategoryId" placeholder="请选择">
            <el-option
              v-for="item in dictList.subjectTypeEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号：" prop="deviceModel">
          <el-input v-model="form.deviceModel" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="安装位置：" prop="installAddr">
          <el-input v-model="form.installAddr" placeholder="请输入安装位置" />
        </el-form-item>
        <el-form-item label="安装经度：" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入安装经度" />
        </el-form-item>
        <el-form-item label="安装纬度：" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入安装纬度" />
        </el-form-item>
        <el-form-item label="厂家名称：" prop="supplier">
          <el-input v-model="form.supplier" placeholder="请输入厂家名称" />
        </el-form-item>
        <el-form-item label="联系人：" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式：" prop="contactMethod">
          <el-input v-model="form.contactMethod" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="设备图片：" prop="deviceImageCodes">
          <el-upload
            ref="upload"
            action="uploadUrl"
            list-type="picture-card"
            :http-request="uploadSectionFile"
            :headers="header"
            :limit="1"
            :with-credentials="true"
            accept="image/png, image/gif, image/jpg, image/jpeg"
            :on-preview="getLocalImg"
            :on-remove="getLocalImgs"
            :file-list="fileImg"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="设备文档：" prop="deviceFileCodes">
          <el-input v-model="form.deviceFileCodes" placeholder="请输入设备文档" />
        </el-form-item> -->
        <el-form-item label="安装日期：" prop="installTime">
          <el-date-picker
            v-model="form.installTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用状态：" prop="deviceUseStatus">
          <el-select v-model="form.deviceUseStatus" placeholder="请选择">
            <el-option
              v-for="item in dictList.deviceUseStatusEnum"
              :key="item.type"
              :label="item.value"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注 " />
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
export default {
  name: "userControl",
  data() {
    return {
      fileImg: [],
      uploadImgList: [],
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      activeName: "first",
      //加载状态
      loading: false,
      alarmLoading: false,
      heartbeatLoading: false,
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
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.handleUpdate(row),
        },
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //表格列
      column: [
        { prop: "deviceCode", label: "设备编码 " },
        { prop: "deviceName", label: "设备名称" },
        { prop: "deviceModel", label: "设备型号" },
        { prop: "installAddr", label: "安装位置" },
        { prop: "deviceStatusValue", label: "设备状态" },
        { prop: "createTime", label: "安装日期" },
        { prop: "supplier", label: "厂家名称" },
        { prop: "remark", label: "备注" },
        { prop: "deviceUseStatusValue", label: "使用状态" },
      ],
      alarmColumn: [
        { prop: "alarmCode", label: "告警编码" },
        { prop: "alarmContent", label: "告警详情" },
        { prop: "alarmHandleStatus", label: "处理状态" },
        { prop: "alarmRank", label: "告警级别" },
        { prop: "alarmTime", label: "告警时间" },
        { prop: "alarmTitle", label: "告警简要描述" },
        { prop: "createTime", label: "创建时间" },
      ],
      heartbeatColumn: [
        { prop: "angle", label: "倾斜角度" },
        { prop: "assetNo", label: "资产编号" },
        { prop: "currGear", label: "水位档位" },
        { prop: "electricityPercentage", label: "电量" },
        { prop: "humidity", label: "井内湿度" },
      ],
      // 字典数据
      dictList: [],
      // 表格参数
      tableData: [],
      alarmTableData: [],
      heartbeatTableData: [],
      // 总条数
      total: 0,
      alarmTotal: 0,
      heartbeatTotal: 0,
      // 表单参数
      form: {},
      // 表单校验
      // 统计数据
      statics: {},
      rules: {
        deviceCode: [
          { required: true, message: "设备编码不能为空", trigger: "change" },
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "change" },
        ],
        deviceCategoryId: [
          { required: true, message: "设备种类未选择", trigger: "change" },
        ],
        deviceModel: [
          { required: true, message: "设备型号不能为空", trigger: "change" },
        ],
        installAddr: [
          { required: true, message: "安装位置不能为空", trigger: "change" },
        ],
        longitude: [
          { required: true, message: "安装经度不能为空", trigger: "change" },
        ],
        latitude: [
          { required: true, message: "安装纬度不能为空", trigger: "change" },
        ],
        supplier: [
          { required: true, message: "厂家名称不能为空", trigger: "change" },
        ],
        deviceUseStatus: [
          { required: true, message: "使用状态未选择", trigger: "change" },
        ],
      },
      ids: [],
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        deviceCategoryId: "2",
      },
      alarmParams: {
        page: 1,
        pageSize: 20,
        alarmMainCode: "2",
      },
      heartbeatParams: {
        page: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    this.$request.deviceStatistics("2").then((res) => {
      if (res.data.status === 200) {
        this.statics = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.$request.deviceGetEnum().then((res) => {
      if (res.data.status === 200) {
        this.dictList = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.getList();
    this.alarmGetList();
    this.heartbeatGetList();
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
        this.uploadImgList.push({
          code: res.data.data.split(",")[0],
          url: res.data.data.split(",")[1],
        });
      });
    },
    //显示图片
    getLocalImg(event) {
      let url = event.url;
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 删除上传图片
    getLocalImgs(file, fileList) {
      this.uploadImgList.forEach((item, index) => {
        if (item.url == file.url) {
          this.uploadImgList.splice(index, 1);
        }
      });
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset();
      this.$request.deviceFindOne(row.uniformDeviceCode).then((res) => {
        if (res.data.status == 200) {
          this.form = res.data.data;
          this.open = true;
          this.title = "修改设备";
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
      this.fileImg = [];
      this.uploadImgList = [];
    },
    // 新增的提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let str = [];
          for (var i = 0; i < this.uploadImgList.length; i++) {
            str.push(this.uploadImgList[i].code);
          }
          this.form.deviceImageCodes = str.toString();
          if (this.form.createTime) {
            this.$request.deviceUpdate(this.form).then((res) => {
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
            this.$request.deviceSave(this.form).then((res) => {
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
      //
      this.form = {
        remark: undefined,
        deviceUseStatus: undefined,
        installTime: undefined,
        deviceCode: undefined,
        deviceName: undefined,
        deviceCategoryId: undefined,
        deviceModel: undefined,
        installAddr: undefined,
        longitude: undefined,
        longitude: undefined,
        supplier: undefined,
        contactPerson: undefined,
        contactMethod: undefined,
        deviceImageCodes: undefined,
      };
    },

    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加设备";
    },
    //获取设备档案列表
    getList() {
      this.loading = true;
      this.$request.deviceFindByQuery(this.params).then((res) => {
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
    //获取异常告警列表
    alarmGetList() {
      this.alarmLoading = true;
      this.$request.deviceAlarmWS(this.alarmParams).then((res) => {
        if (res.data.status == 200) {
          this.alarmTableData = res.data.data.rows;
          this.alarmTotal = res.data.data.records;
          this.alarmParams.page = res.data.data.page;
          this.alarmLoading = false;
        } else {
          this.$message.error(res.data.msg);
          this.alarmLoading = false;
        }
      });
    },
    //获取运行数据列表
    heartbeatGetList() {
      this.heartbeatLoading = true;
      this.$request.deviceFindCover(this.heartbeatParams).then((res) => {
        if (res.data.status == 200) {
          this.heartbeatTableData = res.data.data.rows;
          this.heartbeatTotal = res.data.data.records;
          this.heartbeatParams.page = res.data.data.page;
          this.heartbeatLoading = false;
        } else {
          this.$message.error(res.data.msg);
          this.heartbeatLoading = false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.static {
  //   padding: 40px 0;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .yunxing {
    background-image: linear-gradient(to right, #54adff, #66cef9);
  }
  .lixian {
    background-image: linear-gradient(to right, #9b91fb, #b2aaf9);
  }
  .daichuli {
    background-image: linear-gradient(to right, #feb354, #f6c640);
  }
  .yichang {
    background-image: linear-gradient(to right, #fb7269, #f89189);
  }
  .static-item {
    width: 20%;
    height: 70px;
    padding: 20px 30px;
    border-radius: 8px;

    img {
      display: inline-block;
      width: 64px;
      height: 64px;
    }
    div {
      vertical-align: top;
      display: inline-block;
      margin-left: 18px;
      p {
        font-size: 20px;
        color: #fff;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .num {
        font-size: 25px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
}
.common-search {
  padding: 0;
}
.button {
  height: 50px;
  line-height: 50px;
}
.list {
  background: #fff;
  padding: 0 24px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
/deep/.el-dialog__body {
  padding: 30px 40px 30px 5px;
}
</style>