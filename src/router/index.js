import { createBrowserRouter, Navigate } from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import UserManagement from '../pages/userManagement'
import RoleManagement from '../pages/roleManagement'
import PermissionManagement from '../pages/permissionManagement'
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
                element: <Navigate to="home" replace /> //将/路由重定向至/home
            },
            {
                path: 'home',
                Component: Home,
            },
            {
                path: 'users',
                Component: UserManagement,
            },
            {
                path: 'roles',
                Component: RoleManagement,
            },
            {
                path: 'permissions',
                Component: PermissionManagement,
            }
        ]
    },
    {
        path: '/login',
        Component: Login
    }
]

export default createBrowserRouter(routes)