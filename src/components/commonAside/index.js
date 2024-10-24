import React, { useEffect, useState } from 'react'
import { Menu, Layout } from 'antd'
import * as Icon from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { selectMenuList } from '../../store/reducers/tab'
import { getPermission } from '../../api'  // 假设我们有这个 API 函数

const { Sider } = Layout

// 根据name选择icon
const iconToElement = (name) => React.createElement(Icon[name] || Icon.AppstoreOutlined);

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermission();
        if (response && response.data && Array.isArray(response.data.permissions)) {
          setPermissions(response.data.permissions);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  // 生成菜单项
  const generateMenuItems = (menuItems) => {
    return menuItems.filter(item => item.type === 'menu').map((item) => {
      const menuItem = {
        key: item.url,  // 使用 url 作为 key
        icon: iconToElement(item.icon || 'AppstoreOutlined'),
        label: item.name,
      }

      const children = permissions.filter(child => child.parent_id === item.id && child.type === 'menu');
      if (children.length > 0) {
        menuItem.children = generateMenuItems(children);
      }

      return menuItem;
    });
  }

  const items = generateMenuItems(permissions.filter(item => item.parent_id === null));

  // 添加数据到store
  const setTabsList = (val) => {
    dispatch(selectMenuList(val))
  }

  // 点击菜单(实现跳转)
  const selectMenu = (e) => {
    const selectedItem = permissions.find(item => item.url === e.key);
    if (selectedItem) {
      setTabsList({
        path: selectedItem.url,
        name: selectedItem.name,
        label: selectedItem.name
      })
      // 页面跳转
      navigate(e.key)
    }
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
