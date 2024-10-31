import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Popconfirm, Select, Tag } from 'antd';
import { getUser, addUser, editUser, deleteUser, getRole } from '../api';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async (page = 1, pageSize = 10, username = '') => {
    console.log('Fetching users with:', { page, pageSize, username });
    setLoading(true);
    try {
      const response = await getUser({ page, pageSize, username });
      console.log('getUser response:', response);
      if (response.code === 200 && response.data) {
        setUsers(response.data.list);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.total
        }));
      } else {
        console.error('Unexpected API response structure:', response);
        message.error('获取用户列表失败：意外的响应结构');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('获取用户列表失败：' + (error.message || '未知错误'));
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await getRole({ page: 1, pageSize: 100 });
      console.log('Roles API response:', response);
      if (response.data && response.code === 200 && Array.isArray(response.data.list)) {
        setRoles(response.data.list);
        console.log('Roles set:', response.data.list);
      } else {
        console.error('Unexpected API response structure for roles:', response);
        message.error('获取角色列表失败：意外的响应结构');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('获取角色列表失败：' + (error.message || '未知错误'));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  useEffect(() => {
    console.log('Users updated:', users);
  }, [users]);

  useEffect(() => {
    console.log('Roles updated:', roles);
  }, [roles]);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    console.log('Searching for:', value);
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
    form.setFieldsValue({
      username: record.username,
      status: record.status,
      roleIds: record.roles ? record.roles.map(role => role.id) : []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      console.log('Deleting user with id:', id);
      const response = await deleteUser({ id });
      console.log('Delete response:', response);
      if (response.code === 200) {
        message.success('User deleted successfully');
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      } else {
        console.error('Unexpected delete response:', response);
        message.error('Failed to delete user: ' + (response.data?.message || 'Unknown error'));
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
      const payload = {
        ...values,
        roles: values.roleIds.map(roleId => ({ id: roleId }))
      };
      let response;
      if (editingUserId) {
        response = await editUser({ 
          id: editingUserId,
          ...payload
        });
      } else {
        response = await addUser(payload);
      }
      if (response.data && response.code === 200) {
        message.success(editingUserId ? 'User updated successfully' : 'User added successfully');
        setModalVisible(false);
        form.resetFields();
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      } else {
        message.error('Failed to save user: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Failed to save user: ' + error.message);
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
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {roles && roles.map(role => (
            <Tag color="blue" key={role.id}>
              {`${role.name} (${role.id})`}
            </Tag>
          ))}
        </>
      ),
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
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="roleIds"
            label="Roles"
            rules={[{ required: true, message: 'Please select at least one role!' }]}
          >
            <Select mode="multiple" placeholder="Select roles">
              {roles.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
