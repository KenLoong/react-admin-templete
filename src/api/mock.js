import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import userApi from './mockServeData/user'
import roleApi from './mockServeData/role'
import permissionApi from './mockServeData/permission'

// 设置延迟时间
Mock.setup({
    timeout: '200-600'
})

// 简单的 token 验证函数
const verifyToken = (token) => {
    try {
        console.log('Verifying token:', token);
        const decoded = JSON.parse(atob(token));
        console.log('Decoded token:', decoded);
        const isValid = decoded.exp > Date.now();
        console.log('Token is valid:', isValid);
        return isValid;
    } catch (e) {
        console.error('Error verifying token:', e);
        return false;
    }
}

// 验证 token 的中间件
const authMiddleware = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
    if (!token) {
        console.log('No token found in localStorage');
        return {
            code: 401,
            message: '未提供 token'
        }
    }

    if (!verifyToken(token)) {
        console.log('Invalid or expired token');
        return {
            code: 401,
            message: 'token 无效或已过期'
        }
    }
    console.log('Token verified successfully');
}

// 模拟登录接口
Mock.mock('/login', 'post', (options) => {
    console.log('Mock login called with options:', options);
    const { username, password } = JSON.parse(options.body);
    return userApi.login(username, password);
})

// 首页相关
Mock.mock('/home/getData', 'get', () => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return homeApi.getStatisticalData()
})

// 用户管理相关
Mock.mock('/users/list', 'post', (options) => {
    console.log('Mock /users/list called with options:', options);
    const authResult = authMiddleware()
    if (authResult) return authResult
    return userApi.getUser(JSON.parse(options.body))
})

Mock.mock('/users/add', 'post', (options) => {
    console.log('Mock /users/add called with options:', options);
    const authResult = authMiddleware()
    if (authResult) return authResult
    return userApi.addUser(options.body)  // 直接传递 options.body
})

Mock.mock('/users/edit', 'post', (options) => {
    console.log('Mock /users/edit called with options:', options);
    const authResult = authMiddleware()
    if (authResult) return authResult
    return userApi.editUser(options)
})

Mock.mock('/users/delete', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return userApi.deleteUser(options)  // 直接传递 options，而不是尝试解析 body
})

// 角色管理相关
Mock.mock('/roles/list', 'post', (options) => {
    console.log('Mock /roles/list called with options:', options);
    const authResult = authMiddleware()
    if (authResult) return authResult
    return roleApi.getRole(JSON.parse(options.body))
})

Mock.mock('/roles/add', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return roleApi.addRole(JSON.parse(options.body))
})

Mock.mock('/roles/edit', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return roleApi.editRole(JSON.parse(options.body))
})

Mock.mock('/roles/delete', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return roleApi.deleteRole(JSON.parse(options.body))
})

// 权限管理相关
Mock.mock('/permissions/list', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return permissionApi.getPermission(JSON.parse(options.body))
})

Mock.mock('/permissions/add', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return permissionApi.addPermission(JSON.parse(options.body))
})

Mock.mock('/permissions/edit', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return permissionApi.editPermission(JSON.parse(options.body))
})

Mock.mock('/permissions/delete', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return permissionApi.deletePermission(JSON.parse(options.body))
})

// 菜单相关
Mock.mock('/permission/getMenu', 'post', (options) => {
    const authResult = authMiddleware()
    if (authResult) return authResult
    return permissionApi.getMenu(JSON.parse(options.body))
})

export default Mock
