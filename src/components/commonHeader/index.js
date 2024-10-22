import React from 'react'
import { Button, Layout, Dropdown, Avatar, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.css'
import { useDispatch } from "react-redux";
import { collapseMenu } from '../../store/reducers/tab'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

const CommonHeader = ({ collapsed }) => {
    const dispatch = useDispatch()
    const setCollapsed = () => {
        dispatch(collapseMenu())
    }
    const navigate = useNavigate()
    // 头像的下拉框选项
    const items = [
      {
          key: '1',
          label: (
              <a target="_blank" rel="noopener noreferrer">
              个人中心
              </a>
          ),
      },
      {
          key: '2',
          label: (
              <a onClick={() => logout(!collapsed)} target="_blank" rel="noopener noreferrer" >
              退出
              </a>
          ),
      }
  ]
  // 登出
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
    return(
        <Header className="header-container">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            // 点击实现下拉栏的收缩/展开
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 32,
              backgroundColor: '#fff'
            }}
          />
          <Dropdown
          // 下拉功能
            menu={{items}}
          >
            <a onClick={(e) => e.preventDefault()}>
                <Avatar size={36} src={<img src={require("../../assets/images/user.png")}/> }/>
            </a>
          </Dropdown>
        </Header>
    )
}

export default CommonHeader