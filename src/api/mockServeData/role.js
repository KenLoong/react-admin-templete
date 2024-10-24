import Mock from 'mockjs'

// 生成模拟角色数据
let List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.word(5, 10),
      description: Mock.Random.sentence(10, 20),
      createdAt: Mock.Random.datetime()
    })
  )
}

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
    const { name, description } = JSON.parse(config.body)
    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      description: description,
      createdAt: Mock.Random.now()
    })
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
    const { id, name, description } = JSON.parse(config.body)
    const index = List.findIndex(u => u.id === id)
    if (index !== -1) {
      List[index] = {
        ...List[index],
        name,
        description
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
