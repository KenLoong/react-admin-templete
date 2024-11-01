import React, { useState } from 'react'
import { Button, Layout, Dropdown, Avatar, Modal, Input, message } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.css'
import { useDispatch } from "react-redux";
import { collapseMenu } from '../../store/reducers/tab'
import { useNavigate } from 'react-router-dom'
import { changePassword, deleteUser } from '../../api';
import { jwtDecode } from 'jwt-decode'; // 导入 jwt-decode

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

    // 获取用户 ID
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const decoded = jwtDecode(token);
            return decoded.sub || decoded.user_id || decoded.id; // 根据你的 JWT 结构调整
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }

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
    const deleteAccount = async () => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                message.error('Failed to retrieve user ID');
                return;
            }
            const response = await deleteUser(userId);
            if (response.code === 200) {
                message.success('Account deleted successfully');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                message.error(response.data.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            message.error('An error occurred while deleting account');
        }
    }

    // Handle password change
    const handlePasswordChange = async () => {
        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.data.code === 200) {
                message.success('Password changed successfully');
                setIsModalVisible(false);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                message.error(response.data.message || 'Failed to change password');
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