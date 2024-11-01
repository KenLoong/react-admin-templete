import React, { useEffect, useState } from 'react'
import { Menu, Layout } from 'antd'
import * as Icon from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { selectMenuList } from '../../store/reducers/tab'

const { Sider } = Layout
const { SubMenu } = Menu

const iconToElement = (name) => React.createElement(Icon[name] || Icon.AppstoreOutlined);

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    console.log('CommonAside useEffect triggered');
    const userString = localStorage.getItem('user_info');
    console.log('User string from localStorage:', userString);
    if (userString) {
      const user = JSON.parse(userString);
      console.log('Parsed user data:', user);

      if (user && user.permissions) {
        const menuData = user.permissions
          .filter(permission => permission.type === 'menu')
          .map(permission => ({
            key: permission.url,
            icon: iconToElement(permission.icon || 'AppstoreOutlined'),
            label: permission.name,
            children: permission.children ? permission.children.map(child => ({
              key: child.url,
              icon: iconToElement(child.icon || 'AppstoreOutlined'),
              label: child.name,
            })) : []
          }));
        

        // if (!menuData.some(item => item.key === '/home')) {
        //   menuData.unshift({
        //     key: '/home',
        //     icon: iconToElement('HomeOutlined'),
        //     label: 'Home',
        //   });
        // }
        
        console.log('Generated menu data:', menuData);
        setMenuItems(menuData);
      }
    }
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

  const renderMenuItems = (items) => {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      );
    });
  };

  return (
    <Sider width={200} collapsed={collapsed}>
      <h3 className="app-name">{collapsed ? 'Admin' : 'General Admin System'}</h3>
      <Menu
        mode="inline"
        theme="dark"
        style={{ height: '100%', borderRight: 0 }}
        onClick={selectMenu}
      >
        {renderMenuItems(menuItems)}
      </Menu>
    </Sider>
  )
}

export default CommonAside
