import React, { useEffect, useState } from 'react';
import { Card, List, Typography } from 'antd';
import "./home.css"

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user_info');
    if (userString) {
      const user = JSON.parse(userString);
      setUserInfo(user);
    }
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <Card title="User Information" style={{ marginBottom: 16 }}>
        <Typography.Text strong>Username:</Typography.Text> {userInfo.username}
        <br />
        <Typography.Text strong>Roles:</Typography.Text> {userInfo.roles.map(role => role.name).join(', ')}
        <br />
        <Typography.Text strong>Permissions:</Typography.Text>
        <List
          size="small"
          bordered
          dataSource={userInfo.permissions}
          renderItem={item => (
            <List.Item>
              {item.name} ({item.type})
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Home
