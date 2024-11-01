import { createBrowserRouter, Navigate } from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import UserManagement from '../pages/userManagement'
import RoleManagement from '../pages/roleManagement'
import PermissionManagement from '../pages/permissionManagement'
import AuditLogManagement from '../pages/auditLogManagement'
import Login from '../pages/login'
import { RouterAuth } from './routerAuth'

// 路由配置和对应的页面
const routes = [
    {
        path: '/',
        element: <RouterAuth><Main /></RouterAuth>,
        children: [
            {
                path: '/',
                element: <RouterAuth><Navigate to="/login" replace /></RouterAuth>
            },
            {
                path: 'home',
                element: <RouterAuth><Home /></RouterAuth>,
            },
            {
                path: 'users',
                element: <RouterAuth><UserManagement /></RouterAuth>,
            },
            {
                path: 'roles',
                element: <RouterAuth><RoleManagement /></RouterAuth>,
            },
            {
                path: 'permissions',
                element: <RouterAuth><PermissionManagement /></RouterAuth>,
            },
            {
                path: 'audit-logs', 
                element: <RouterAuth><AuditLogManagement /></RouterAuth>,
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]

export default createBrowserRouter(routes)
