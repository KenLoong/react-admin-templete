import axios from 'axios'

const instance = axios.create({
  baseURL: '/', // 改为 '/' 或空字符串 ''
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      // token 过期或无效
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
