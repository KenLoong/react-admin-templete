import Mock from 'mockjs'

// Generate mock permission data
let List = [
  {
    id: '1',
    name: 'System Management',
    description: 'Permissions related to system management',
    type: 'menu',
    url: '/',
    parent_id: null,
    order_num: 1
  },
  {
    id: '2',
    name: 'User Management',
    description: 'Permissions related to user management',
    type: 'menu',
    url: '/users',
    parent_id: '1',
    order_num: 1
  },
  {
    id: '3',
    name: 'Role Management',
    description: 'Permissions related to role management',
    type: 'menu',
    url: '/roles',
    parent_id: '1',
    order_num: 2
  },
  {
    id: '4',
    name: 'Permission Management',
    description: 'Permissions related to permission management',
    type: 'menu',
    url: '/permissions',
    parent_id: '1',
    order_num: 3
  },
  {
    id: '5',
    name: 'View Users',
    description: 'Permission to view user list',
    type: 'action',
    url: '/api/users',
    parent_id: '2',
    order_num: 1
  },
  {
    id: '6',
    name: 'Create User',
    description: 'Permission to create new user',
    type: 'action',
    url: '/api/users/create',
    parent_id: '2',
    order_num: 2
  },
  {
    id: '7',
    name: 'Edit User',
    description: 'Permission to edit user information',
    type: 'action',
    url: '/api/users/edit',
    parent_id: '2',
    order_num: 3
  },
  {
    id: '8',
    name: 'Delete User',
    description: 'Permission to delete user',
    type: 'action',
    url: '/api/users/delete',
    parent_id: '2',
    order_num: 4
  },
  {
    id: '9',
    name: 'View Roles',
    description: 'Permission to view role list',
    type: 'action',
    url: '/api/roles',
    parent_id: '3',
    order_num: 1
  },
  {
    id: '10',
    name: 'Create Role',
    description: 'Permission to create new role',
    type: 'action',
    url: '/api/roles/create',
    parent_id: '3',
    order_num: 2
  },
  {
    id: '11',
    name: 'Edit Role',
    description: 'Permission to edit role information',
    type: 'action',
    url: '/api/roles/edit',
    parent_id: '3',
    order_num: 3
  },
  {
    id: '12',
    name: 'Delete Role',
    description: 'Permission to delete role',
    type: 'action',
    url: '/api/roles/delete',
    parent_id: '3',
    order_num: 4
  },
  {
    id: '13',
    name: 'View Permissions',
    description: 'Permission to view permission list',
    type: 'action',
    url: '/api/permissions',
    parent_id: '4',
    order_num: 1
  },
  {
    id: '14',
    name: 'Create Permission',
    description: 'Permission to create new permission',
    type: 'action',
    url: '/api/permissions/create',
    parent_id: '4',
    order_num: 2
  },
  {
    id: '15',
    name: 'Edit Permission',
    description: 'Permission to edit permission information',
    type: 'action',
    url: '/api/permissions/edit',
    parent_id: '4',
    order_num: 3
  },
  {
    id: '16',
    name: 'Delete Permission',
    description: 'Permission to delete permission',
    type: 'action',
    url: '/api/permissions/delete',
    parent_id: '4',
    order_num: 4
  }
];

export default {
  // 获取权限列表
  getPermission: config => {
    console.log('Mock getPermission called with config:', config);
    let params = {};
    if (config.body) {
      try {
        params = JSON.parse(config.body);
      } catch (error) {
        console.error('Error parsing config.body:', error);
      }
    }
    const { name = '', page = 1, pageSize = 10, type } = params;

    const mockList = List.filter(permission => {
      // 按名称筛选
      if (name && permission.name && !permission.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      // 按类型筛选
      if (type && permission.type !== type) {
        return false;
      }
      return true;
    });

    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1));
    
    return {
      code: 200,
      total: mockList.length,
      permissions: pageList
    };
  },

  // 添加权限
  addPermission: config => {
    console.log('Mock addPermission called with config:', config);
    const { name, description, type, url, parent_id, order_num } = JSON.parse(config.body);
    List.unshift({
      id: Mock.Random.guid(),
      name,
      description,
      type,
      url,
      parent_id,
      order_num
    });
    return {
      code: 200,
      message: 'Permission added successfully'
    };
  },

  // 删除权限
  deletePermission: config => {
    console.log('Mock deletePermission called with config:', config);
    const { id } = JSON.parse(config.body);
    if (!id) {
      return {
        code: 400,
        message: 'Invalid parameters: Missing permission ID'
      };
    }
    const index = List.findIndex(u => u.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Permission not found'
      };
    }
    List.splice(index, 1);
    return {
      code: 200,
      message: 'Permission deleted successfully'
    };
  },

  // 编辑权限
  editPermission: config => {
    console.log('Mock editPermission called with config:', config);
    const { id, name, description, type, url, parent_id, order_num } = JSON.parse(config.body);
    const index = List.findIndex(u => u.id === id);
    if (index !== -1) {
      List[index] = {
        ...List[index],
        name,
        description,
        type,
        url,
        parent_id,
        order_num
      };
      return {
        code: 200,
        message: 'Permission updated successfully'
      };
    } else {
      return {
        code: 404,
        message: 'Permission not found'
      };
    }
  }
};
