import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Modal, Form, Select, TreeSelect } from 'antd';
import { getPermission, addPermission, editPermission, deletePermission } from '../api';

const { Search } = Input;
const { Option } = Select;

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form] = Form.useForm();

  const fetchPermissions = async (page = 1, pageSize = 10, name = '') => {
    setLoading(true);
    try {
      const response = await getPermission({ page, pageSize, name });
      if (response && response.data && Array.isArray(response.data.permissions)) {
        setPermissions(response.data.permissions);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: response.data.total || response.data.permissions.length
        });
      } else {
        console.error('Unexpected API response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleTableChange = (pagination) => {
    fetchPermissions(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchPermissions(1, pagination.pageSize, value);
  };

  const handleDelete = async (id) => {
    try {
      await deletePermission({ id });
      message.success('Permission deleted successfully');
      fetchPermissions(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error deleting permission:', error);
      message.error('Failed to delete permission: ' + error.message);
    }
  };

  const handleAdd = () => {
    setEditingPermission(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPermission(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPermission) {
        await editPermission({ ...values, id: editingPermission.id });
        message.success('Permission updated successfully');
      } else {
        await addPermission(values);
        message.success('Permission added successfully');
      }
      setModalVisible(false);
      fetchPermissions(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error saving permission:', error);
      message.error('Failed to save permission: ' + error.message);
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Parent Permission',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId) => {
        const parent = permissions.find(p => p.id === parentId);
        return parent ? parent.name : 'None';
      }
    },
    {
      title: 'Order',
      dataIndex: 'order_num',
      key: 'order_num',
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
      <h1>Permission Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd} type="primary">
          Add Permission
        </Button>
        <Search
          placeholder="Search permissions"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={permissions} 
        loading={loading} 
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={editingPermission ? "Edit Permission" : "Add Permission"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Permission Name"
            rules={[{ required: true, message: 'Please input the permission name!' }]}
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
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the permission type!' }]}
          >
            <Select>
              <Option value="menu">Menu</Option>
              <Option value="action">Action</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'Please input the URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_id"
            label="Parent Permission"
          >
            <TreeSelect
              treeData={permissions}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              treeDefaultExpandAll
              allowClear
              placeholder="Select parent permission"
            />
          </Form.Item>
          <Form.Item
            name="order_num"
            label="Order Number"
            rules={[{ required: true, message: 'Please input the order number!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;
