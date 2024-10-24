import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import userApi from './mockServeData/user'
import roleApi from './mockServeData/role'
import permissionApi from './mockServeData/permission'

// 设置延迟时间
Mock.setup({
    timeout: '200-600'
})

// 首页相关
Mock.mock('/home/getData', homeApi.getStatisticalData)

// 用户管理相关
Mock.mock(/\/users\/?(\?.+)?$/, 'get', userApi.getUser)
Mock.mock('/users', 'post', userApi.addUser)
Mock.mock('/users/edit', 'post', userApi.editUser)
Mock.mock('/users/delete', 'post', userApi.deleteUser)

// 角色管理相关
Mock.mock(/\/roles\/?(\?.+)?$/, 'get', roleApi.getRole)
Mock.mock('/roles', 'post', roleApi.addRole)
Mock.mock('/roles/edit', 'post', roleApi.editRole)
Mock.mock('/roles/delete', 'post', roleApi.deleteRole)

// 权限相关
Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)

export default Mock
