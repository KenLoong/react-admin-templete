import Mock from 'mockjs'

// Generate mock permission data
export const predefinedPermissions = [
  {
    id: '1',
    name: 'Home',
    description: 'Access to home page',
    type: 'menu',
    url: '/home',
    parent_id: null,
    order_num: 1,
    icon: 'HomeOutlined'
  },
  {
    id: '2',
    name: 'User Management',
    description: 'Access to user management',
    type: 'menu',
    url: '/users',
    parent_id: null,
    order_num: 2,
    icon: 'UserOutlined'
  },
  {
    id: '3',
    name: 'Role Management',
    description: 'Access to role management',
    type: 'menu',
    url: '/roles',
    parent_id: null,
    order_num: 3,
    icon: 'TeamOutlined'
  },
  {
    id: '4',
    name: 'Permission Management',
    description: 'Access to permission management',
    type: 'menu',
    url: '/permissions',
    parent_id: null,
    order_num: 4,
    icon: 'SafetyOutlined'
  },
  {
    id: '5',
    name: 'Create User',
    description: 'Ability to create new users',
    type: 'action',
    url: '/api/users/create',
    parent_id: '2',
    order_num: 1
  },
  {
    id: '6',
    name: 'Edit User',
    description: 'Ability to edit existing users',
    type: 'action',
    url: '/api/users/edit',
    parent_id: '2',
    order_num: 2
  },
  {
    id: '7',
    name: 'Delete User',
    description: 'Ability to delete users',
    type: 'action',
    url: '/api/users/delete',
    parent_id: '2',
    order_num: 3
  },
  // ... 添加更多权限 ...
];

let List = [...predefinedPermissions];

export default {
  // 获取权限列表
  getPermission: body => {
    console.log('Mock getPermission called with body:', body);
    const { name = '', page = 1, pageSize = 10, type } = body;

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
  addPermission: body => {
    console.log('Mock addPermission called with body:', body);
    const { name, description, type, url, parent_id, order_num } = body;
    const newPermission = {
      id: Mock.Random.guid(),
      name,
      description,
      type,
      url,
      parent_id,
      order_num
    };
    List.unshift(newPermission);
    return {
      code: 200,
      permission: newPermission,
      message: 'Permission added successfully'
    };
  },

  // 删除权限
  deletePermission: body => {
    console.log('Mock deletePermission called with body:', body);
    const { id } = body;
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
  editPermission: body => {
    console.log('Mock editPermission called with body:', body);
    const { id, name, description, type, url, parent_id, order_num } = body;
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
        permission: List[index],
        message: 'Permission updated successfully'
      };
    } else {
      return {
        code: 404,
        message: 'Permission not found'
      };
    }
  },

  // 获取菜单
  /*getMenu: body => {
    console.log('Mock getMenu called with body:', body);
    // 这里可以根据需要实现获取菜单的逻辑
    // 例如，可以返回所有类型为 'menu' 的权限
    const menuList = List.filter(permission => permission.type === 'menu');
    return {
      code: 200,
      data: menuList
    };
  }*/
};
