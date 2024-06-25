<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          :placeholder="$t('user.login.username.placeholder')"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          :placeholder="$t('user.login.password.placeholder')"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >{{ $t('user.login.forgot-password') }}</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.login') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { login } from '@/api/login'

export default {
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        loginBtn: false
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.state.loginBtn = true
          // 使用导入的 login 函数
          login(values).then(response => {
            console.log('Login response:', response)
            if (response && response.access && response.refresh) {
              // 格式化并保存令牌到 localStorage
              const formattedAccessToken = `Bearer ${response.access}`
              localStorage.setItem('accessToken', formattedAccessToken)
              localStorage.setItem('refreshToken', response.refresh)
              console.log('Tokens saved:', { access: formattedAccessToken, refresh: response.refresh })

              // 登录成功后跳转到 dashboard
              this.$router.replace('/')
            } else {
              console.error('Expected tokens are not provided in the response')
            }
          }).catch(err => {
            console.error('API Error:', err)
            this.requestFailed(err)
          }).finally(() => {
            this.state.loginBtn = false
          })
        }
      })
    },
    requestFailed (err) {
      console.error('Login request failed:', err)
      // 更多错误处理逻辑
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
