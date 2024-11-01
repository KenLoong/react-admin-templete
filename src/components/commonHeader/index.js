import React, { useState } from 'react'
import { Button, Layout, Dropdown, Avatar, Modal, Input, message } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.css'
import { useDispatch } from "react-redux";
import { collapseMenu } from '../../store/reducers/tab'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../api'; 

const { Header } = Layout

const CommonHeader = ({ collapsed }) => {
    const dispatch = useDispatch()
    const setCollapsed = () => {
        dispatch(collapseMenu())
    }
    const navigate = useNavigate()

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Dropdown menu options
    const items = [
        {
            key: '1',
            label: (
                <a onClick={() => setIsModalVisible(true)} rel="noopener noreferrer">
                    Change Password
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={() => logout()} rel="noopener noreferrer">
                    Logout
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a onClick={() => deleteAccount()} rel="noopener noreferrer">
                    Delete Account
                </a>
            ),
        }
    ]

    // Logout
    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    // Delete account
    const deleteAccount = () => {
        console.log('Deleting account...')
        localStorage.removeItem('token')
        navigate('/login')
    }

    // Handle password change
    const handlePasswordChange = async () => {
        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.code === 200) {
                message.success('Password changed successfully');
                setIsModalVisible(false);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                message.error(response.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('An error occurred while changing password');
        }
    }

    // 关闭弹窗时清空输入框
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
    }

    return (
        <Header className="header-container">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 32,
                    backgroundColor: '#fff'
                }}
            />
            <Dropdown
                menu={{ items }}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Avatar size={36} src={<img src={require("../../assets/images/user.png")} alt="user avatar" />} />
                </a>
            </Dropdown>

            <Modal
                title="Change Password"
                visible={isModalVisible}
                onOk={handlePasswordChange}
                onCancel={handleCancel}
            >
                <Input.Password
                    addonBefore="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input.Password
                    addonBefore="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </Modal>
        </Header>
    )
}

export default CommonHeader