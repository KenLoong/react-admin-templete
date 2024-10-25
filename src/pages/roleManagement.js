import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Modal, Form, Select, Tag } from 'antd';
import { getRole, addRole, editRole, deleteRole, getPermission } from '../api';

const { Search } = Input;
const { Option } = Select;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
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
      console.log('getRole response:', response);
      if (response.data && response.data.code === 200 && Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: response.data.total || response.data.roles.length
        });
      } else {
        console.error('Unexpected API response structure:', response);
        message.error('Failed to fetch roles: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles: ' + (error.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermission({ page: 1, pageSize: 1000 });
      if (response.data && response.data.code === 200 && Array.isArray(response.data.permissions)) {
        setPermissions(response.data.permissions);
      } else {
        console.error('Unexpected API response structure for permissions:', response);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions: ' + error.message);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
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
      const response = await deleteRole({ id });
      if (response.data && response.data.code === 200) {
        message.success('Role deleted successfully');
        fetchRoles(pagination.current, pagination.pageSize, searchText);
      } else {
        message.error('Failed to delete role: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error('Failed to delete role: ' + error.message);
    }
  };

  const handleEdit = (record) => {
    setEditingRole(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      permissionIds: record.permissions ? record.permissions.map(p => p.id) : []
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedPermissions = permissions.filter(p => values.permissionIds.includes(p.id));
      let response;
      if (editingRole) {
        response = await editRole({ 
          ...values, 
          id: editingRole.id,
          permissions: selectedPermissions.map(p => ({ id: p.id, name: p.name }))
        });
      } else {
        response = await addRole({
          ...values,
          permissions: selectedPermissions.map(p => ({ id: p.id, name: p.name }))
        });
      }
      if (response.data && response.data.code === 200) {
        message.success(editingRole ? 'Role updated successfully' : 'Role added successfully');
        setModalVisible(false);
        form.resetFields();
        fetchRoles(pagination.current, pagination.pageSize, searchText);
      } else {
        message.error('Failed to save role: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving role:', error);
      message.error('Failed to save role: ' + error.message);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
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
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <>
          {permissions && permissions.map(perm => (
            <Tag color="blue" key={perm.id}>
              {`${perm.name} (${perm.id})`}
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
        onCancel={handleModalCancel}
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
          <Form.Item
            name="permissionIds"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission!' }]}
          >
            <Select mode="multiple" placeholder="Select permissions">
              {permissions.map(permission => (
                <Option key={permission.id} value={permission.id}>{`${permission.name} (${permission.id})`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
