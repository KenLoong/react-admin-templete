import React from 'react'
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd'
import CommonTag from '../components/commonTag';
import CommonHeader from '../components/commonHeader'
import CommonAside from '../components/commonAside';// 侧边栏组件
import { useSelector } from 'react-redux'
import { RouterAuth } from '../router/routerAuth'

const { Content } = Layout

const Main = () => {
  // 获取状态，然后传递给commonAside和commonHeader
  // 这个是 useSelector 钩子传入的回调函数，用于指定你希望从 Redux store 中取出哪一部分数据。state 参数表示 Redux 的整个状态树。
	// state.tab.isCollapse 这里说明了你在 Redux store 中有一个 tab 属性，它有一个子属性 isCollapse
  // useSelector 的函数体总是会在 Redux store 任何变化时被调用
  const collapsed = useSelector(state => state.tab.isCollapse)

  return (
    <RouterAuth>
      <Layout className="main-container">
        {/* 这里是侧边栏组件，collapsed 用于控制侧边栏的折叠状态 */} 
        <CommonAside collapsed={collapsed} />
        <Layout>
          <CommonHeader collapsed={collapsed} />
          <CommonTag />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </RouterAuth>
  )
}

export default Main