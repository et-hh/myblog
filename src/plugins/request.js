import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

import qs from 'qs'

// create an axios instance
const service = axios.create({
  timeout: 60000, // request timeout
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// request interceptor
service.interceptors.request.use(config => {
  if (config.type === 'json') {
    config.headers['Content-Type'] = 'application/json'
  }

  if (config.method !== 'get') {
    config.headers['x-csrf-token'] = store.getters['x-csrf-token']
  }

  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
  (config.method === 'post' || config.method === 'put' || config.method === 'delete' || config.method === 'patch')) {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const { data } = response
    const { code, resultMsg } = data
    if (code && code !== 200) {
      Message({
        message: resultMsg,
        type: 'error',
        duration: 3000
      })
      if (code === 400) { // 未登录，跳转到登录页
        // router.push('/login')
      }
      return Promise.reject(data)
    }
    return response
  },
  async(error) => {
    const { response } = error
    if (axios.isCancel(error)) { // 若是取消请求
      return Promise.reject()
    }
    if (response) {
      const { config, data } = response
      if (data) {
        const { code, resultMsg } = data
        if (code) {
          Message({
            message: resultMsg,
            type: 'error',
            duration: 1000
          })
          return Promise.reject(error)
        }
      }
      Message({
        message: '服务器开小差啦~',
        type: 'error',
        duration: 1000
      })
    } else {
      Message({
        message: '网络异常',
        type: 'error',
        duration: 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
