import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Modal, Form, Select, TreeSelect, InputNumber } from 'antd';
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
  const [filters, setFilters] = useState({});

  const fetchPermissions = async (page = 1, pageSize = 10, name = '', filters = {}) => {
    setLoading(true);
    try {
      const response = await getPermission({ page, pageSize, name, ...filters });
      if (response && response.data && Array.isArray(response.data.permissions)) {
        setPermissions(response.data.permissions);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.total || response.data.permissions.length
        }));
      } else {
        console.error('Unexpected API response structure:', response);
        message.error('Failed to fetch permissions: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions: ' + (error.message || 'Unknown error'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPermissions(pagination.current, pagination.pageSize, searchText, filters);
  }, [filters]);

  const handleTableChange = (pagination, filters, sorter) => {
    const type = filters.type && filters.type.length > 0 ? filters.type[0] : undefined;
    fetchPermissions(pagination.current, pagination.pageSize, searchText, { type });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchPermissions(1, pagination.pageSize, value, filters);
  };

  const handleDelete = async (id) => {
    try {
      await deletePermission({ id });
      message.success('Permission deleted successfully');
      fetchPermissions(pagination.current, pagination.pageSize, searchText, filters);
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
      fetchPermissions(pagination.current, pagination.pageSize, searchText, filters);
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      filters: [
        { text: 'Menu', value: 'menu' },
        { text: 'Action', value: 'action' },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Parent ID',
      dataIndex: 'parent_id',
      key: 'parent_id',
    },
    {
      title: 'Order',
      dataIndex: 'order_num',
      key: 'order_num',
      sorter: (a, b) => a.order_num - b.order_num,
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
            />
          </Form.Item>
          <Form.Item
            name="order_num"
            label="Order Number"
            rules={[{ type: 'number', min: 0, message: 'Order number must be a non-negative integer!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;
