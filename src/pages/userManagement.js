import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Popconfirm, Select } from 'antd';
import { getUser, addUser, editUser, deleteUser } from '../api';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async (page = 1, pageSize = 10, searchText = '') => {
    setLoading(true);
    try {
      const response = await getUser({ page, pageSize, username: searchText });
      if (response && response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.total || response.data.users.length
        }));
      } else {
        console.error('Unexpected API response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchUsers(1, pagination.pageSize, value);
  };

  const handleAdd = () => {
    
    setEditingUserId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUserId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      console.log('Deleting user with id:', id);
      const response = await deleteUser({ id });
      console.log('Delete response:', response);
      if (response && response.data && response.data.code === 200) {
        message.success('User deleted successfully');
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      } else {
        console.error('Unexpected delete response:', response);
        message.error('Failed to delete user: ' + (response?.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUserId) {
        await editUser({ ...values, id: editingUserId });
        message.success('User updated successfully');
      } else {
        await addUser(values);
        message.success('User added successfully');
      }
      setModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error('Validation failed: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: deletingId === record.id }}
          >
            <Button danger loading={deletingId === record.id}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 在这里添加 console.log
  console.log('Current users:', users);

  return (
    <div>
      <h1>User Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd} type="primary">
          Add User
        </Button>
        <Search
          placeholder="Search users"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={users} 
        loading={loading} 
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingUserId ? "Edit User" : "Add User"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editingUserId, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
