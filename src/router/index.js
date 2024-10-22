import { createBrowserRouter, Navigate } from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import Mall from '../pages/mall'
import User from '../pages/user'
import pageOne from '../pages/other/pageOne'
import pageTwo from '../pages/other/pageTwo'
import Login from '../pages/login'

// 路由配置和对应的页面
const routes = [
    {
        path: '/',
        Component: Main, // 展示的内容
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
                path: 'mall',
                Component: Mall,
            },
            {
                path: 'user',
                Component: User,
            },
            {
                path: 'other',
                children: [
                    {
                        path: 'pageOne',
                        Component: pageOne
                    },
                    {
                        path: 'pageTwo',
                        Component: pageTwo
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        Component: Login
    }
]
export default createBrowserRouter(routes)