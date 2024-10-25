import Mock from 'mockjs'
import { predefinedPermissions } from './permission'  // 假设我们从 permission.js 导入了预定义的权限列表

// 预定义的角色列表
export const predefinedRoles = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full access to all features',
    permissions: predefinedPermissions.map(p => ({ id: p.id, name: p.name })),
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Access to most features, including system settings',
    permissions: predefinedPermissions.map(p => ({ id: p.id, name: p.name })), // 给予所有权限
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'User Manager',
    description: 'Access to user management features',
    permissions: predefinedPermissions.filter(p => p.id === '1' || p.id === '2' || p.id === '5' || p.id === '6').map(p => ({ id: p.id, name: p.name })),
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Regular User',
    description: 'Basic access to the system',
    permissions: predefinedPermissions.filter(p => p.id === '1').map(p => ({ id: p.id, name: p.name })),
    createdAt: '2023-01-04T00:00:00Z'
  }
];

// 生成模拟角色数据，包括预定义角色
let List = [...predefinedRoles];
const count = 20;

for (let i = predefinedRoles.length; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: `Role ${i + 1}`,
      description: Mock.Random.sentence(10, 20),
      permissions: Mock.Random.shuffle(predefinedPermissions).slice(0, Mock.Random.integer(1, 5)).map(p => ({ id: p.id, name: p.name })),
      createdAt: Mock.Random.datetime()
    })
  )
}

export default {
  // 获取角色列表
  getRole: config => {
    console.log('Mock getRole called with config:', config);
    let { body } = config;
    
    // 确保 body 是一个对象
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        body = {};
      }
    } else if (typeof body !== 'object') {
      console.warn('Request body is not an object');
      body = {};
    }

    const { name = '', page = 1, pageSize = 10 } = body;

    const mockList = List.filter(role => {
      if (name && !role.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      return true;
    });

    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1));
    
    return {
      code: 200,
      total: mockList.length,
      roles: pageList
    };
  },

  // 添加角色
  addRole: config => {
    console.log('Mock addRole called with config:', config);
    const { name, description, permissionIds } = JSON.parse(config.body)
    const newRole = {
      id: Mock.Random.guid(),
      name: name,
      description: description,
      permissions: permissionIds.map(id => {
        const permission = predefinedPermissions.find(p => p.id === id);
        return { id, name: permission ? permission.name : `Unknown Permission` };
      }),
      createdAt: Mock.Random.now()
    }
    List.unshift(newRole)
    return {
      code: 200,
      message: 'Role added successfully'
    }
  },

  // 删除角色
  deleteRole: config => {
    console.log('Mock deleteRole called with config:', config);
    const { id } = JSON.parse(config.body)
    if (!id) {
      return {
        code: 400,
        message: 'Invalid parameters: Missing role ID'
      }
    }
    const index = List.findIndex(u => u.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: 'Role not found'
      }
    }
    List.splice(index, 1)
    return {
      code: 200,
      message: 'Role deleted successfully'
    }
  },

  // 编辑角色
  editRole: config => {
    console.log('Mock editRole called with config:', config);
    const { id, name, description, permissionIds } = JSON.parse(config.body)
    const index = List.findIndex(u => u.id === id)
    if (index !== -1) {
      List[index] = {
        ...List[index],
        name,
        description,
        permissions: permissionIds.map(id => {
          const permission = predefinedPermissions.find(p => p.id === id);
          return { id, name: permission ? permission.name : `Unknown Permission` };
        })
      }
      return {
        code: 200,
        message: 'Role updated successfully'
      }
    } else {
      return {
        code: 404,
        message: 'Role not found'
      }
    }
  }
}
