<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="showCaptcha != 'off'">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
          ref="codeTxt"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
      <el-form-item style="width: 40%; margin: 10px auto">
        <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <!-- <div style="float: right">
          <router-link class="link-type" :to="'/register'">还没有账号？立即注册</router-link>
        </div> -->
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{ copyRight }}</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/system/login'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      title: defaultSettings.title,
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      showCaptcha: '',
      loading: false,
      redirect: undefined,
    }
  },
  computed: {
    copyRight: function () {
      return defaultSettings.copyRight
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.getCode()
    this.getCookie()
    // this.getConfigKey('sys.account.captchaOnOff').then((response) => {
    //   this.showCaptcha = response.data
    // })
  },
  methods: {
    getCode() {
      // this.loginForm.code = "";
      getCodeImg().then((res) => {
        this.codeUrl = 'data:image/gif;base64,' + res.data.img
        this.loginForm.uuid = res.data.uuid
        this.showCaptcha = res.data.captchaOff
        this.$forceUpdate()
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')

      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30,
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.msgSuccess('登录成功')
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch((error) => {
              this.msgError(error.msg)
              this.loading = false
              this.getCode()
              this.$refs.codeTxt.focus()
            })
        } else {
          console.log('未完成')
        }
      })
    },
  },
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/image/background.jpg');
  background-size: cover;
  // background-color: rgba(56, 157, 170, 0.82);
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  // color: #707070;
  color: #151313;
}

.login-form {
  border-radius: 6px;
  // background: #ffffff;
  background-color: hsla(0, 0%, 100%, 0.8);
  width: 450px;
  padding: 25px 45px 5px 45px;

  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }

  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }

  ::v-deep .el-input__inner {
    height: 36px;
    line-height: 36px;
    font-size: 16px;
  }
  .input-icon {
    height: 38px;
    width: 16px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
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
.el-login-footer {
  height: 30px;
  line-height: 30px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #1b1919;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
