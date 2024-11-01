import axios from './axios'

// 用户管理相关的 API
export const getUser = (params) => {
  console.log('Calling getUser API with params:', params);
  return axios.post('/users/list', params);
}

export const addUser = (data) => {
  return axios.post('/users/add', data);
}

export const editUser = (params) => {
  console.log('Calling editUser API with params:', params);
  return axios.post('/users/edit', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const changePassword = (currentPassword, newPassword) => {
  console.log('Calling changePassword API with:', { currentPassword, newPassword });
  return axios.post('/users/change-password', { currentPassword, newPassword });
}

export const deleteUser = (data) => {
  return axios.post('/users/delete', data);
}

// 角色管理相关的 API
export const getRole = (params) => {
  return axios.post('/roles/list', params);
}

export const addRole = (data) => {
  return axios.post('/roles/add', data);
}

export const editRole = (data) => {
  return axios.post('/roles/edit', data);
}

export const deleteRole = (params) => {
  return axios.post('/roles/delete', params);
}

// 权限管理相关的 API
export const getPermission = (params) => {
  return axios.post('/permissions/list', params);
}

export const addPermission = (data) => {
  return axios.post('/permissions/add', data);
}

export const editPermission = (data) => {
  return axios.post('/permissions/edit', data);
}

export const deletePermission = (params) => {
  return axios.post('/permissions/delete', params);
}

// 登录 API
export const login = (username, password) => {
  console.log('Calling login API with:', { username, password });
  return axios.post('/login', { username, password });
}

// 从 old-index.js 合并的 API
export const getMenu = (param) => {
  return axios.post('/permission/getMenu', param);
}

export const getData = () => {
  return axios.get('/home/getData');
}
