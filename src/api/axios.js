import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5001',
  timeout: 5000
})

// Request interceptor
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

// Response interceptor
instance.interceptors.response.use(
  response => {
    console.log('Axios response interceptor called', response);
    // Check if response.data is empty
    if (response.data !== null && response.data !== undefined) {
      return response.data;
    } else {
      return response;
    }
  },
  error => {
    console.error('Axios response error:', error);
    return Promise.reject(error);
  }
)

export default instance
