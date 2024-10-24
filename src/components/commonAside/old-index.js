import React from 'react'
import { Menu, Layout } from 'antd'
import * as Icon from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import MenuConfig from '../../config' // 定义侧边栏
import { useDispatch } from "react-redux"
import { selectMenuList } from '../../store/reducers/tab'

const { Sider } = Layout

// 根据name选择icon
const iconToElement = (name) => React.createElement(Icon[name]);
// 遍历侧边栏定义
const items = MenuConfig.map((icon) => {
  const child = {
    key: `${icon.path}`,
    icon: iconToElement(icon.icon),
    label: `${icon.label}`
  }
  if (icon.children) { // children 属性不为空，则说明有子菜单
    child.children = icon.children.map(item => {
      return {
        key: item.path, // key是组件的唯一标识
        label: item.label
      }
    })
  }
  return child
})
const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 添加数据到store
  const setTabsList = (val) => {
    dispatch(selectMenuList(val))
  }
  // 点击菜单(实现跳转)
  const selectMenu = (e) => {
    let data
    MenuConfig.forEach((item) => {
      // 找到当前的数据
      if (item.path === e.keyPath[e.keyPath.length - 1]) {
        data = item
        // 如果是有二级菜单
        if (e.keyPath.length > 1) {
          data = item.children.find((child) => {
            return child.path === e.key
          })
        }
      }
    })
    setTabsList({
      path: data.path,
      name: data.name,
      label: data.label
    })
    // 页面跳转
    navigate(e.key)
  }
  return (
    <Sider
      width={200}
      collapsed={collapsed}
    >
      <h3 className="app-name">{collapsed ? '后台' : '通用后台管理系统'}</h3>
      <Menu
        mode="inline"
        theme="dark"
        style={{
          height: '100%',
          borderRight: 0,
        }}
        items={items}
        onClick={selectMenu}
      />
    </Sider>
  )
}

export default CommonAside