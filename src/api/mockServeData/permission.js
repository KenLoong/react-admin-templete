import Mock from 'mockjs'

// 生成模拟权限数据
let List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.word(5, 10),
      description: Mock.Random.sentence(10, 20),
      type: Mock.Random.pick(['menu', 'action']),
      url: Mock.Random.url(),
      parent_id: i > 0 ? Mock.Random.integer(1, i) : null,
      order_num: Mock.Random.integer(1, 100)
    })
  )
}

export default {
  // 获取权限列表
  getPermission: config => {
    console.log('Mock getPermission called with config:', config);
    const { url } = config;
    const params = new URLSearchParams(url.split('?')[1]);
    const name = params.get('name') || '';
    const page = parseInt(params.get('page')) || 1;
    const pageSize = parseInt(params.get('pageSize')) || 10;

    const mockList = List.filter(permission => {
      if (name && !permission.name.toLowerCase().includes(name.toLowerCase())) {
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

