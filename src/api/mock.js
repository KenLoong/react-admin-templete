import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import userApi from './mockServeData/user'
import permissionApi from './mockServeData/permission'

// 设置延迟时间
Mock.setup({
    timeout: '200-600'
})

Mock.mock('/home/getData', homeApi.getStatisticalData)
Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)


// User Management
Mock.mock(/\/users\/?(\?.+)?$/, 'get', userApi.getUser)
Mock.mock('/users', 'post', userApi.addUser)
Mock.mock('/users/delete', 'post', userApi.deleteUser)
Mock.mock('/users/edit', 'post', userApi.editUser)

export default Mock