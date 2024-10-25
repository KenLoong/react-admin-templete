import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import userApi from './mockServeData/user'
import roleApi from './mockServeData/role'
import permissionApi from './mockServeData/permission'

// 设置延迟时间
Mock.setup({
    timeout: '200-600'
})

// 设置全局的请求头处理
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false
        if (this.responseType) {
            this.custom.xhr.responseType = this.responseType
        }
    }
    this.proxy_send(...arguments)
}

// 简单的 token 生成函数
const generateToken = (username) => {
    return btoa(JSON.stringify({ username, exp: Date.now() + 3600000 })); // 1小时后过期
}

// 简单的 token 验证函数
const verifyToken = (token) => {
    try {
        const decoded = JSON.parse(atob(token));
        return decoded.exp > Date.now();
    } catch (e) {
        return false;
    }
}

// 模拟登录接口
Mock.mock('/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body);
    return userApi.login(username, password);
})

// 验证 token 的中间件
const authMiddleware = (options) => {
    const headers = options.headers || {};
    const authHeader = headers['Authorization'] || headers['authorization'];
    if (!authHeader) {
        return {
            code: 401,
            message: '未提供 token'
        }
    }

    const token = authHeader.split(' ')[1]
    if (!verifyToken(token)) {
        return {
            code: 401,
            message: 'token 无效或已过期'
        }
    }
}

// 首页相关
Mock.mock('/home/getData', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return homeApi.getStatisticalData()
})

// 用户管理相关
Mock.mock('/users/list', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return userApi.getUser(options)
})
Mock.mock('/users/add', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return userApi.addUser(options)
})
Mock.mock('/users/edit', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return userApi.editUser(options)
})
Mock.mock('/users/delete', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return userApi.deleteUser(options)
})

// 角色管理相关
Mock.mock('/roles/list', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return roleApi.getRole(options)
})
Mock.mock('/roles/add', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return roleApi.addRole(options)
})
Mock.mock('/roles/edit', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return roleApi.editRole(options)
})
Mock.mock('/roles/delete', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return roleApi.deleteRole(options)
})

// 权限管理相关
Mock.mock('/permissions/list', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return permissionApi.getPermission(options)
})
Mock.mock('/permissions/add', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return permissionApi.addPermission(options)
})
Mock.mock('/permissions/edit', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return permissionApi.editPermission(options)
})
Mock.mock('/permissions/delete', 'post', (options) => {
    const authResult = authMiddleware(options)
    if (authResult) return authResult
    return permissionApi.deletePermission(options)
})

export default Mock
