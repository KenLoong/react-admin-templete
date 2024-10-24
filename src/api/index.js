import axios from './axios'

// 用户管理相关的 API
export const getUser = (params) => {
  return axios.request({
    url: '/users/list',
    method: 'post',
    data: params
  })
}

export const addUser = (data) => {
  return axios.request({
    url: '/users/add',
    method: 'post',
    data
  })
}

export const editUser = (data) => {
  return axios.request({
    url: '/users/edit',
    method: 'post',
    data
  })
}

export const deleteUser = (params) => {
  return axios.request({
    url: '/users/delete',
    method: 'post',
    data: params
  })
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
    url: '/permissions',
    method: 'get',
    params
  })
}

export const addPermission = (data) => {
  return axios.request({
    url: '/permissions',
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
    data: { id: params.id }
  })
}

// 登录 API
export const login = (data) => {
  return axios.request({
    url: '/login',
    method: 'post',
    data
  })
}
