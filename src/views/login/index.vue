<template>
  <div id="login" style="background:url(https://2016-0708-1305237326.cos.ap-shanghai.myqcloud.com/background.png) no-repeat;">
    <div class="loginConbox">
      <div class="loginBox">
        <div class="loginCon">
          <p class="title">勾庄佳苑智慧社区平台</p>
          <el-card shadow="always" class="login-module" v-if="smdl">
            <div slot="header" class="clearfix formTitlt">
              <span>欢迎登录</span>
              <!-- <span class="titIconbox">
                <i class="iconfont xu-saomadenglu2 fa-lg iconcolor"></i>
                <i
                  class="iconfont xu-saomadenglu01 el-icon--right fa-lg pointer"
                  @click="smdl = !smdl"
                ></i>
              </span> -->
            </div>
            <el-form
              :model="loginForm"
              status-icon
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item>
                <el-input
                  type="text"
                  prefix-icon="el-icon-user"
                  v-model="loginForm.mobile"
                  auto-complete="off"
                  placeholder="请输入登录账号"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  prefix-icon="el-icon-lock"
                  type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="请输入登录密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  class="subBtn" type="primary" @click="submitForm"
                  >登录</el-button
                >
              </el-form-item>
              <p class="smalltxt">
                <router-link class="a" to="#">忘记密码</router-link>
              </p>
            </el-form>
          </el-card>

          <!-- <el-card shadow="always" class="login-module" v-else>
            <div slot="header" class="clearfix formTitlt">
              <span>扫码登录</span>
              <span class="titIconbox">
              <i class="iconfont xu-mimadenglu1 fa-lg iconcolor"></i>
              <i class="iconfont xu-imagevector el-icon--right fa-lg pointer" @click="smdl = !smdl"></i>
            </span>
            </div>
            <div class="ewmbox">
              <div class="ewm">
                <img src="https://img.alicdn.com/tfscom/TB1ivYYyHvpK1RjSZFqwu3XUVXa.png">
              </div>
              <div class="ewmicon">
                <i class="iconfont xu-saomadenglu fa-2x iconcolor"></i>
                <p>打开 微信 扫一扫登录</p>
              </div>
              <p class="smalltxt">
                <router-link class="a" to="#">免费注册</router-link>
              </p>
            </div>
          </el-card> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      smdl: true,
      loginForm: {
        loginType: 0,
        mobile: "17354628459",
        password: "123456",
      },
    };
  },
  methods: {
    submitForm() {
      let that = this;
      if (this.loginForm.mobile === "" || this.loginForm.password === "") {
        this.$message({
          showClose: true,
          message: "账号或密码不能为空",
          type: "error",
        });
        return false;
      } else {
        let timer = null;
        if(timer){
            clearTimeout(timer) 
        }
        timer = setTimeout(this.$request
          .fetchLogin(that.loginForm)
          .then((res) => {
            if(res.data.status == 200) {
              that.$restBack(
              res,
              () => {
                localStorage.setItem("userInfo", JSON.stringify(res.data.data));
                that.$store.commit('userRoute',JSON.stringify(res.data.data));
                that.$store
                  .dispatch("setToken", res.data.data.userUniqueToken)
                  .then((item) => {
                    that.$router.push({ path: "/" });
                  });
              },
              "登录成功"
            );
            }else{
              that.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          }),1000) // 简化写法
        
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" >
#login {
  width: 100%;
  height: 100%;
  
  background-size: 100% 100%;
  .loginBox {
    .iconcolor {
      color: #409eff;
    }

    padding: 74px 0 118px;

    .loginCon {
      width: 100%;
      text-align: center;
        .el-input__icon{
       color:#2176FF;
       font-size: 20px;
       margin-right: 10px;
}
      .el-card__header {
        border-bottom: 0px;
        
      }
      .title {
        font-size: 36px;
        font-weight: 600;
        color: #ffffff;
        margin-top: 0px;
        &:first-child {
          font-size: 34px;
          margin-top: 50px;
         
        }
      }
      .login-module {
        width: 380px;
        height: 325px;
        margin-top: 60px;
        border-radius: 16px !important;
        display: inline-block;

        .formTitlt {
          font-size: 18px;
          font-weight: 400;
          span {
            font-size: 26px;
            font-weight: 400;
            color: #2176ff;
          }
          .titIconbox {
            float: right;

            .pointer {
              cursor: pointer;
            }
          }
        }

        .smalltxt {
          text-align: right;

          .a {
            text-decoration: none;
            color: #999999;
            font-size: 12px;
            margin-left: 8px;
          }
        }
      }

      .el-form-item__content {
        margin-left: 0px !important;

        .subBtn {
          width: 100%;
        }
      }
    }

    .el-input__inner,
    .el-button,
    .el-card,
    .el-message {
      border-radius: 0px !important;
    }
    .el-input__inner{
      padding-left: 40px;
    }

    .el-form-item__content .ico {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 999;
      width: 40px;
      height: 39px;
      text-align: center;
      border-right: 1px solid #ccc;
    }

    .ewmbox {
      width: 100%;
      height: 240px;
      margin-top: -25px;

      .ewm {
        width: 140px;
        height: 140px;
        margin: 20px auto;

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }

      .ewmicon {
        width: 140px;
        margin: 20px auto 0;

        .iconfont {
          float: left;
        }

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }
    }
  }
}

</style>
