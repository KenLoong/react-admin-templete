import React, { useState, useEffect } from 'react';
import { Table, Space, Input, message } from 'antd';
import { getAuditLogs } from '../api';

const { Search } = Input;

const AuditLogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchLogs = async (page = 1, pageSize = 10, userId = '') => {
    if (userId && isNaN(userId)) {
      message.error('Please enter a valid user ID (numbers only).');
      return;
    }

    setLoading(true);
    try {
      const response = await getAuditLogs({ page, pageSize, user_id: userId });
      console.log('getAuditLogs response:', response);
      if (response.data && response.code === 200 && Array.isArray(response.data.list)) {
        setLogs(response.data.list);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: response.data.pagination.total
        });
      } else {
        console.error('Unexpected API response structure:', response);
        message.error('Failed to fetch audit logs: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      message.error('Failed to fetch audit logs: ' + (error.message || 'Unknown error'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleTableChange = (pagination) => {
    fetchLogs(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchLogs(1, pagination.pageSize, value);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  return (
    <div>
      <h1>Audit Log Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by User ID"
          onSearch={handleSearch}
          style={{ width: 200 }}
          allowClear
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={logs} 
        loading={loading} 
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AuditLogManagement;
