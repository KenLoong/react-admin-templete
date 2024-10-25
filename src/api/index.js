import axios from './axios'

// 用户管理相关的 API
export const getUser = (params) => {
  console.log('Calling getUser API with params:', params);
  return axios.post('/users/list', params)
    .then(response => {
      console.log('getUser API response:', response);
      return response;
    })
    .catch(error => {
      console.error('getUser API error:', error);
      throw error;
    });
}

export const addUser = (data) => {
  return axios.post('/users/add', data)
}

export const editUser = (data) => {
  return axios.post('/users/edit', data)
}

export const deleteUser = (data) => {
  return axios.post('/users/delete', data)
}

// 角色管理相关的 API
export const getRole = (params) => {
  return axios.request({
    url: '/roles/list',
    method: 'post',
    data: params
  })
}

export const addRole = (data) => {
  return axios.request({
    url: '/roles/add',
    method: 'post',
    data
  })
}

export const editRole = (data) => {
  return axios.request({
    url: '/roles/edit',
    method: 'post',
    data
  })
}

export const deleteRole = (params) => {
  return axios.request({
    url: '/roles/delete',
    method: 'post',
    data: params
  })
}

// 权限管理相关的 API
export const getPermission = (params) => {
  return axios.request({
    url: '/permissions/list',
    method: 'post',
    data: params
  })
}

export const addPermission = (data) => {
  return axios.request({
    url: '/permissions/add',
    method: 'post',
    data
  })
}

export const editPermission = (data) => {
  return axios.request({
    url: '/permissions/edit',
    method: 'post',
    data
  })
}

export const deletePermission = (params) => {
  return axios.request({
    url: '/permissions/delete',
    method: 'post',
    data: params
  })
}

// 登录 API
export const login = (username, password) => {
  console.log('Calling login API with:', { username, password });
  return axios.post('/login', { username, password })
    .then(response => {
      console.log('Login API response:', response);
      return response;
    })
    .catch(error => {
      console.error('Login API error:', error);
      throw error;
    });
}

// 从 old-index.js 合并的 API
export const getMenu = (param) => {
  return axios.request({
    url: '/permission/getMenu',
    method: 'post',
    data: param
  })
}

export const getData = () => {
  return axios.request({
    url: '/home/getData',
    method: 'get'
  })
}
