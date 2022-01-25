<template>
  <div class="contant">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="图文类型:" prop="newsType">
        <el-select v-model="form.newsType" placeholder="请选择">
          <el-option
            v-for="item in newsTypeMap"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图文标题:" prop="newsTitle">
        <el-input v-model="form.newsTitle" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item>
        <el-tabs v-model="activeName" :stretch="false">
          <el-tab-pane label="通知封面上传" name="first">
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
        <wang-editor ref="wangeditor" :content="form.newsContent" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel($store.getters.rightNav)">取 消</el-button>
      <el-button type="primary" @click="submitForm($store.getters.rightNav, 0)"
        >不发布修改</el-button
      >
      <el-button type="primary" @click="submitForm($store.getters.rightNav, 1)"
        >发布修改</el-button
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
      defaultContent: "<p>请输入题目</p>",
      // 父级类型
      parentid: "",
      //tab默认
      activeName: "first",
      fileImg: [],
      uploadImgList: [],
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
    });
  },
  mounted() {
    if (this.$route.params.id) {
      localStorage.setItem("editID", this.$route.params.id);
      this.parentid = this.$route.params.id;
    } else {
      this.parentid = localStorage.getItem("editID");
    }
    this.$request.findByIdNews(this.parentid).then((res) => {
      res.data.data.newsType = res.data.data.newsType.toString();
      if(res.data.data.newsImagesCodes) {
        this.uploadImgList.push({
        code: res.data.data.newsImagesCodes,
        url: res.data.data.newsImagesCodesValue,
      });
      }
      if (res.data.data.newsImagesCodesValue) {
        this.fileImg.push({
          uid: 1,
          url: res.data.data.newsImagesCodesValue,
        });
      }

      this.form = res.data.data;
    });
  },
  methods: {
    //上传视频
    uploadVadioFile(param) {
      var form = new FormData();
      // 文件对象
      console.log(param);
      form.append("file", param.file);
      this.$request.upload(form).then((res) => {
        if (this.form.newsVideoCodes != undefined) {
          this.form.newsVideoCodes =
            this.form.newsVideoCodes + "," + res.data.data.split(",")[0];
        } else {
          this.form.newsVideoCodes = res.data.data.split(",")[0];
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
        console.log(this.fileImg,'this.fileImg1')
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
      console.log(this.fileImg,'this.fileImg2')
      this.fileImg.forEach((item, index) => {
        if (item.url == file.url) {
          this.fileImg.splice(index, 1);
        }
      });
      console.log(this.fileImg,'this.fileImg3')
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
    // 修改的提交
    submitForm(tabItem, index) {
      if (this.$refs.wangeditor.editorContent == "") {
        this.$message.error("内容不能为空");
        return;
      } else {
        this.form.newsContent = this.$refs.wangeditor.editorContent;
        this.form.userCode = JSON.parse(
          localStorage.getItem("userInfo")
        ).userCode;
      }
      let that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let str = [];
          for (var i = 0; i < this.uploadImgList.length; i++) {
            str.push(this.uploadImgList[i].code);
            console.log(this.uploadImgList[i].code,'12112');
          }
          this.form.newsImagesCodes = str.toString();
          if (index == 0) {
            this.$request.updateNews(this.form).then((res) => {
              if (res.data.status == 200) {
                this.$router.go(-1);
                this.$store.dispatch("removeTab", {
                  tabItem,
                  fullPath: this.$route.fullPath,
                  router: this.$router,
                });
                this.msgSuccess("修改成功");
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else if (index == 1) {
            this.$request.publisUpdateNews(this.form).then((res) => {
              if (res.data.status == 200) {
                this.$router.go(-1);
                this.$store.dispatch("removeTab", {
                  tabItem,
                  fullPath: this.$route.fullPath,
                  router: this.$router,
                });
                this.msgSuccess("修改成功");
              }else {
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
  padding-left: 7%;
}
.el-select {
  width: 100%;
}
</style>