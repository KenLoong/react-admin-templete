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
      </Card>
    </div>
  )
}

export default Home
