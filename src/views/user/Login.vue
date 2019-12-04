<template>
  <div>
    <van-nav-bar
      title="登陆"
      left-arrow
      @click-left="$router.back()"
    />
    <van-cell-group>
      <van-field label="手机号" placeholder="请输入手机号" v-model.trim="loginForm.mobile"
      :error-message="errmsg.mobile" @blur="checkMobile"/>
      <van-field label="验证码" placeholder="请输入验证码"  v-model.trim="loginForm.code"
      :error-message="errmsg.code" @blur="checkCode">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
// 导入login的请求
import { login } from '@/api/login'
// 导入mapMutations
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 错误信息提示
      errmsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 失去焦点时验证
    // 校验手机号
    checkMobile () {
      // 是否为空
      if (!this.loginForm.mobile) {
        this.errmsg.mobile = '请输入手机号'
        return false
      }
      // 校验格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errmsg.mobile = '请输入正确的手机号'
        return false
      }
      // 成功
      this.errmsg.mobile = ''
    },
    // 校验验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errmsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errmsg.code = '请输入正确的验证码'
      }
      this.errmsg.code = ''
    },
    // 整体验证
    ...mapMutations(['setUser']),
    async login () {
      this.checkMobile()
      this.checkCode()
      if (!this.errmsg.mobile && !this.errmsg.code) {
        try {
          // 发请求跳转
          const data = await login(this.loginForm)
          // 成功，更改用户信息
          this.setUser(data)
          // 跳转
          this.$router.push(this.$route.query.redirectUrl || '/user')
          // 提示跳转成功
          this.$toast.success('登陆成功')
        } catch (error) { // 登陆失败
          this.$toast.fail('用户名或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
