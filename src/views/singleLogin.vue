<template>
  <div>
    <h1>单点登录</h1>
  </div>
</template>

<script>
import { singleLogin } from '@/api/system/login'

export default {
  name: 'singleLogin',
  data() {
    return {
      key: '',
    }
  },
  created() {
    this.key = this.$route.query.key
    // this.key = 'UQcCz3YWxQPaODfO2yQVCQ=='
    // singleLogin({ key: this.key }).then((res) => {
    //   console.log(res)
    // })
    this.singleLogin()
  },
  methods: {
    singleLogin() {
      this.$store
        .dispatch('singleLogin', this.key)
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
    },
  },
}
</script>
