import React from 'react'
import { Card } from 'antd'
import "./home.css"

const Home = () => {
  const userImg = require("../../assets/images/user.png")

  return (
    <div className="home">
      <Card className="user-card" hoverable>
        <div className="user">
          <img src={userImg} alt="User" />
          <div className="userinfo">
            <p className="name">Admin</p>
            <p className="access">超级管理员</p>
          </div>
        </div>
        <div className="login-info">
          <p>上次登录时间：<span>2021-7-19</span></p>
          <p>上次登录地点：<span>武汉</span></p>
        </div>
      </Card>
      {/* 这里可以添加其他内容 */}
    </div>
  )
}

export default Home
