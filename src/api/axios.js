import axios from 'axios'

const instance = axios.create({
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log('Axios request interceptor called', config);
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('Token added to request headers:', token)
    }
    return config
  },
  error => {
    console.error('Axios request error:', error);
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('Axios response interceptor called', response);
    return response.data
  },
  error => {
    console.error('Axios response error:', error)
    return Promise.reject(error)
  }
)

export default instance
