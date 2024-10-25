import React from 'react'
import { Form, Input, Button, message } from 'antd';
import "./login.css"
import { login } from '../../api/index'
import { useNavigate, Navigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  if (localStorage.getItem('token')) {
    return <Navigate to="/home" replace />
  }
  const handleLogin = async (values) => {
    try {
      console.log('Login attempt with values:', values);
      const response = await login(values.username, values.password);
      console.log('Login response:', response);
      if (response.code === 200 && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage:', response.data.token);
        message.success('登录成功');
        navigate('/home');
      } else {
        console.error('Unexpected login response:', response);
        message.error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败: ' + (error.message || '未知错误'));
    }
  };
  return (
    <Form
      className="login-container"
      onFinish={handleLogin}
    >
      <div className="login_title">系统登录</div>
      <Form.Item
        label="账号"
        name="username"
        rules={[{ required: true, message: '请输入账号' }]}
      >
        <Input placeholder="请输入账号" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">登录</Button>
      </Form.Item>
    </Form>
  )
}

export default Login
