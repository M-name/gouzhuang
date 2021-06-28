<template>
  <div class="contant">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="图文类型：" prop="newsType">
        <el-select v-model="form.newsType" disabled placeholder="请选择">
          <el-option
            v-for="item in newsTypeMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="title + '标题:'" prop="newsTitle">
        <el-input v-model="form.newsTitle" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item>
        <el-tabs v-model="activeName" :stretch="false">
          <el-tab-pane label="通知封面上传" name="first">
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
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="内容视频上传" name="fourth">
            <el-upload
              ref="uploadVadio"
              action="uploadUrl"
              list-type="picture-card"
              :limit="1"
              :http-request="uploadVadioFile"
              :headers="header"
              :with-credentials="true"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="内容详情:" prop="userSex">
        <wang-editor ref="wangeditor" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel($store.getters.rightNav)">取 消</el-button>
      <el-button type="primary" @click="submitForm($store.getters.rightNav, 0)"
        >不发布提交</el-button
      >
      <el-button type="primary" @click="submitForm($store.getters.rightNav, 1)"
        >发布提交</el-button
      >
    </div>
    <el-dialog width="600px" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
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
      title: "",
      //tab默认
      activeName: "first",
      // 上传请求头
      header: {
        "Content-Type": "multipart/form-data",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      // 表单参数
      form: {
        newsImagesCodes: undefined,
        newsVideoCodes: undefined,
        newsTitle: undefined,
        newsType: undefined,
        newsContent: undefined,
        userCode: JSON.parse(localStorage.getItem("userInfo")).userCode,
      },
      // 新闻类型字典值
      newsTypeMap: [],
      // 表单校验
      rules: {
        newsTitle: [
          { required: true, message: "标题不能为空", trigger: "change" },
        ],
        newsType: [
          { required: true, message: "新闻类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    //获取通知字典
    this.$request.findAlleuemsNews().then((res) => {
      let role = [];
      let lists = res.data.data;
      for (var i = 0; i < Object.keys(lists.newsTypeMap).length; i++) {
        let arr = {};
        arr.value = Object.keys(lists.newsTypeMap)[i];
        arr.label = lists.newsTypeMap[Object.keys(lists.newsTypeMap)[i]];
        role.push(arr);
      }
      this.newsTypeMap = role;
      this.newsTypeMap.forEach((item) => {
        if (item.value == this.form.newsType) {
          this.title = item.label;
        }
      });
    });
  },
  mounted() {
    if (this.$route.params.code) {
      localStorage.setItem("newsType", this.$route.params.code);
      this.form.newsType = this.$route.params.code;
    } else {
      this.form.newsType = localStorage.getItem("newsType");
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传视频
    uploadVadioFile(param) {
      var form = new FormData();
      // 文件对象
      console.log(param);
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        this.form.newsVideoCodes = res.data.data.split(",")[0];
      });
    },
    //上传图片
    uploadSectionFile(param) {
      var form = new FormData();
      // 文件对象
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        this.form.newsImagesCodes = res.data.data.split(",")[0];
      });
    },
    //显示图片
    getLocalImg(event) {
      // 获取上传图片的本地url，用于上传前的本地预览
      let url = "";
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(event.raw);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(event.raw);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(event.raw);
      }
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 取消按钮
    cancel(tabItem) {
      this.$router.go(-1);
      this.$store.dispatch("removeTab", {
        tabItem,
        fullPath: this.$route.fullPath,
        router: this.$router,
      });
    },
    // 新增的提交
    submitForm(tabItem, index) {
      if (this.$refs.wangeditor.editorContent == "") {
        this.$message.error("内容不能为空");
        return;
      } else {
        this.form.newsContent = this.$refs.wangeditor.editorContent;
      }
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (index == 0) {
            this.$request.saveNews(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                that.$router.go(-1);
                that.$store.dispatch("removeTab", {
                  tabItem,
                  fullPath: this.$route.fullPath,
                  router: this.$router,
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else if (index == 1) {
            this.$request.publishNews(this.form).then((res) => {
              if (res.data.status === 200) {
                this.msgSuccess("新增成功");
                that.$router.go(-1);
                that.$store.dispatch("removeTab", {
                  tabItem,
                  fullPath: this.$route.fullPath,
                  router: this.$router,
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  padding: 16px;
  background: #fff;
}
.dialog-footer {
  padding-left: 120px;
}
.el-select {
  width: 100%;
}
</style>