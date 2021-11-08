<template>
  <div class="login" ref="clcheight">
    <div id="app">
      <vue-particles
        class="login-bg"
        color="#39AFFD"
        :particleOpacity="0.7"
        :particlesNumber="100"
        shapeType="circle"
        :particleSize="4"
        linesColor="#8DD1FE"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      ></vue-particles>
    </div>
    <!-- 登录面板 -->
    <div class="login-box">
      <div class="login-box-title">南斗星教务系统</div>
      <div class="login-box-from">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" size="medium">
              <el-button slot="prepend" icon="el-icon-user"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="medium"
            >
              <el-button slot="prepend" icon="el-icon-key"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img width="100%" :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              :loading="loading"
              style="width:100%;font-size: large"
              @click="handleLogin('loginForm')"
              v-if="!isUpdateSystem"
            >登&nbsp;&nbsp;录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <y-notice-bar :switchNotice="isUpdateSystem" :title="title"></y-notice-bar>
  </div>
</template>

<script>
import { getCodeImg, getSystemUpdateStatus } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      title: "系统正在更新，请等待3-10分钟！再登入",
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      // 是否在更新系统
      isUpdateSystem: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  mounted() {
    this.$refs.clcheight.style.height = `${document.documentElement.clientHeight}px`;
    getSystemUpdateStatus().then(res => {
      if ("true" == res.data) {
        this.isUpdateSystem = true;
      } else {
        this.isUpdateSystem = false;
      }
    });
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;
}
.login-bg {
  width: 100%;
  height: 100%;
  background: #3e3e3e;
  position: relative;
}
.login-box {
  width: 350px;
  background: hsla(0, 0%, 100%, 0.3);
  border-radius: 5px;
  box-shadow: 0 0 2px #f7f7f7;
  border: 1px solid #f7f7f7;
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  margin-left: -175px;
  margin-top: -150px;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-box-title {
  line-height: 50px;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}
.login-box-from {
  width: 100%;
  height: auto;
  padding: 30px;
  box-sizing: border-box;
}
</style>
