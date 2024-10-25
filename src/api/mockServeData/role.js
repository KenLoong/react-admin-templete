import Mock from 'mockjs'

// 预定义的角色列表
const predefinedRoles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Access to most features, excluding system settings',
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic access to the system',
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Guest',
    description: 'Limited access to view-only features',
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
      createdAt: Mock.Random.datetime()
    })
  )
}

export { predefinedRoles };

export default {
  // 获取角色列表
  getRole: config => {
    console.log('Mock getRole called with config:', config);
    const { name = '', page = 1, pageSize = 10 } = JSON.parse(config.body);

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
      permissions: permissionIds.map(id => ({ id, name: `Permission ${id}` })),
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
        permissions: permissionIds.map(id => ({ id, name: `Permission ${id}` }))
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
