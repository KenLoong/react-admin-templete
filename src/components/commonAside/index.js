import React, { useEffect, useState } from 'react'
import { Menu, Layout } from 'antd'
import * as Icon from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { selectMenuList } from '../../store/reducers/tab'
import { getPermission } from '../../api'

const { Sider } = Layout

const iconToElement = (name) => React.createElement(Icon[name] || Icon.AppstoreOutlined);

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermission({ page: 1, pageSize: 1000 });
        if (response && response.data && Array.isArray(response.data.permissions)) {
          const permissions = response.data.permissions;
          const menuData = permissions
            .filter(item => item.type === 'menu')
            .map(item => ({
              key: item.url,
              icon: iconToElement(item.icon || 'AppstoreOutlined'),
              label: item.name,
              children: permissions
                .filter(child => child.parent_id === item.id && child.type === 'menu')
                .map(child => ({
                  key: child.url,
                  label: child.name
                }))
            }));
          setMenuItems(menuData);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  const setTabsList = (val) => {
    dispatch(selectMenuList(val))
  }

  const selectMenu = (e) => {
    setTabsList({
      path: e.key,
      name: e.item.props.children,
      label: e.item.props.children
    })
    navigate(e.key)
  }

  return (
    <Sider width={200} collapsed={collapsed}>
      <h3 className="app-name">{collapsed ? '后台' : '通用后台管理系统'}</h3>
      <Menu
        mode="inline"
        theme="dark"
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={selectMenu}
      />
    </Sider>
  )
}

export default CommonAside
