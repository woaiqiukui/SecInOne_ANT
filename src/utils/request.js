import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import router from '@/router'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从localStorage获取token
    const token = storage.get('accessToken')

    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }

    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: data.result && data.result.isLogin ? data.message : 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          // 重定向到登录页面，添加一个query参数以指示登录后可以重定向回来的位置
          router.push({ path: '/user/login', query: { redirect: router.currentRoute.fullPath } })
        })
      } else {
        // 如果没有token，直接跳转到登录页
        router.push('/user/login')
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get('accessToken')
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
