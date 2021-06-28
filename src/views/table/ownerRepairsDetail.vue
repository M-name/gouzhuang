<template>
  <div class="content">
    <i class="el-icon-user icon"></i>
    <span class="title">报事处理</span>
    <span style="color: #0f8dff">{{ repairsDetail.businessStatusValue }}</span>
    <el-divider></el-divider>
    <div class="info">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-form-item label="报事类型"
              ><p>{{ repairsDetail.businessType }}</p></el-form-item
            ></el-col
          >
          <el-col :span="8"
            ><el-form-item label="住户姓名"
              ><p>{{ repairsDetail.userName }}</p></el-form-item
            ></el-col
          >
          <el-col :span="8"
            ><el-form-item label="手机号码">
              <p>{{ repairsDetail.mobile }}</p></el-form-item
            ></el-col
          >
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-form-item label="楼幢编码"
              ><p>{{ repairsDetail.buildingCode }}</p></el-form-item
            ></el-col
          >
          <el-col :span="8"
            ><el-form-item label="提交方式"
              ><p>{{ repairsDetail.submitMethodValue }}</p></el-form-item
            ></el-col
          >
          <el-col :span="8"
            ><el-form-item label="提交时间">
              <p>{{ repairsDetail.createTime }}</p>
            </el-form-item></el-col
          >
        </el-row>
        <el-form-item label="报事描述">
          <div>{{ repairsDetail.businessContent }}</div></el-form-item
        >
        <el-form-item label="报事照片">
          <el-image
            v-for="item in repairsDetail.imgUrls"
            style="width: 100px; height: 100px; margin-right: 10px"
            :key="item"
            :src="item"
            :preview-src-list="repairsDetail.imgUrls"
          >
          </el-image
        ></el-form-item>
      </el-form>
    </div>
    <i class="el-icon-user icon"></i>
    <span class="title">处理历史</span>
    <el-divider></el-divider>
    <div class="table">
      <CommonTable
        :defColumns="column"
        @pagination="getList"
        :dataList="repairsDetail.businessProgressLogList"
        :options="tableOptions"
      />
    </div>
    <i class="el-icon-user icon"></i>
    <span class="title">本次处理记录</span>
    <el-divider></el-divider>
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="处理状态：" prop="businessStatusDesc">
          <el-radio-group v-model="form.businessStatusDesc">
            <el-radio
              v-for="item in dictLists.businessStatusEnum"
              :key="item.type"
              :label="item.value"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理描述：" prop="businessHandleContent">
          <el-input
            type="textarea"
            autosize
            v-model="form.businessHandleContent"
            placeholder="请输入处理描述"
          />
        </el-form-item>
        <el-form-item label="上传照片：" prop="progressImageCodes">
          <el-upload
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
      </el-form>
      <div class="dialog-footer" style="text-align: right">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm($store.getters.rightNav)"
          >确 定</el-button
        >
      </div>
    </div>
    <el-dialog title="进展照片查看" :visible.sync="open">
      <el-image
        v-for="item in srcList"
        style="width: 100px; height: 100px; margin-right: 10px"
        :key="item"
        :src="item"
        :preview-src-list="srcList"
      >
      </el-image>
    </el-dialog>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileImg: [],
      uploadImgList: [],
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      // 上一级code
      code: 1034519348256768,
      // 照片弹窗显示
      open: false,
      // 提交参数
      form: {},
      // 总条数
      total: 0,
      //加载状态
      loading: false,
      //枚举值
      dictLists: {},
      //表格列
      column: [
        { prop: "businessStatusDesc", label: "处理状态" }, //
        { prop: "businessHandleContent", label: "处理描述" }, //
        { prop: "createTime", label: "处理时间" },
        { prop: "createBy", label: "处理客服" }, //
        {
          prop: "imgUrls",
          label: "进展照片",
          render: (h, scope) => {
            if (scope.row.imgUrls.length > 0) {
              return h(
                "p",
                {
                  style: { color: "#0F8DFF", cursor: "pointer" },
                  on: {
                    click: () => {
                      this.checkImg(scope.row);
                    },
                  },
                },
                "查看"
              );
            } else {
              return h("p", "无");
            }
          },
        }, //
      ],
      // 表格参数
      repairsDetail: [],
      // 表格参数
      tableOptions: {
        border: true, //边框
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      // 表单校验
      rules: {
        businessStatusDesc: [
          {
            required: true,
            message: "处理状态未选择",
            trigger: "blur",
          },
        ],
      },
      srcList: [],
    };
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("repairsDetailCode", this.$route.params.code);
      this.code = this.$route.params.code;
    } else {
      this.code = localStorage.getItem("repairsDetailCode");
    }
    this.$request.findRepairAlleuems().then((res) => {
      this.dictLists = res.data.data;
    });
    this.getList();
  },
  methods: {
    // 取消
    cancel() {
      this.form = {
        businessStatusDesc: undefined,
        businessHandleContent: undefined,
        progressImageCodes: undefined,
      };
      this.fileImg = [];
      this.uploadImgList = [];
    },
    // 新增的提交
    submitForm(tabItem) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const that = this;
          let str = [];
          for (var i = 0; i < this.uploadImgList.length; i++) {
            str.push(this.uploadImgList[i].code);
            console.log(this.uploadImgList[i].code);
          }
          this.form.progressImageCodes = str.toString();
          this.dictLists.businessStatusEnum.forEach((item) => {
            if (item.value == this.form.businessStatusDesc) {
              this.repairsDetail.businessStatus = item.type;
            }
          });
          this.repairsDetail.businessProgressLog = this.form;
          this.$request.repairUpdateBusiness(this.repairsDetail).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("提交成功");
              that.$router.go(-1);
              that.$store.dispatch("removeTab", {
                tabItem,
                fullPath: this.$route.fullPath,
                router: this.$router,
              });
            } else {
              that.$message.error(res.data.msg);
            }
          });
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
    // 列表照片查看
    checkImg(row) {
      this.srcList = row.imgUrls;
      this.open = true;
    },
    //获取处理历史列表
    getList() {
      this.$request
        .repairFindBusiness({ businessCode: this.code })
        .then((res) => {
          if (res.data.status == 200) {
            this.repairsDetail = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  padding: 25px;
}
.info {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.el-divider--horizontal {
  margin: 20px 0;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
.icon {
  font-size: 16px;
  font-weight: bold;
}
.table {
  margin-bottom: 30px;
}
</style>