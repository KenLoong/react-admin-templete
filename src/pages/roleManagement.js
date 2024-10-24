import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Modal, Form } from 'antd';
import { getRole, addRole, editRole, deleteRole } from '../api';

const { Search } = Input;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();

  const fetchRoles = async (page = 1, pageSize = 10, name = '') => {
    setLoading(true);
    try {
      const response = await getRole({ page, pageSize, name });
      if (response && response.data && Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: response.data.total || response.data.roles.length
        });
      } else {
        console.error('Unexpected API response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleTableChange = (pagination) => {
    fetchRoles(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchRoles(1, pagination.pageSize, value);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole({ id });
      message.success('Role deleted successfully');
      fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error('Failed to delete role: ' + error.message);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await editRole({ ...values, id: editingRole.id });
        message.success('Role updated successfully');
      } else {
        await addRole(values);
        message.success('Role added successfully');
      }
      setModalVisible(false);
      fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error saving role:', error);
      message.error('Failed to save role: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Role Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd} type="primary">
          Add Role
        </Button>
        <Search
          placeholder="Search roles"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={roles} 
        loading={loading} 
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please input the role name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
