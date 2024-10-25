import Mock from 'mockjs'
import { predefinedRoles } from './role'

function param2Obj(url, type, body) {
  const [path, query] = url.split('?');
  const params = {};

  // 处理查询参数
  if (query) {
    query.split('&').forEach(item => {
      const [key, value] = item.split('=');
      params[key] = decodeURIComponent(value);
    });
  }

  // 处理路径参数
  const pathParts = path.split('/');
  if (pathParts.length > 2) {
    params.id = pathParts[pathParts.length - 1];
  }

  // 根据 HTTP 方法处理请求体
  if (type.toLowerCase() === 'post' || type.toLowerCase() === 'put') {
    if (body) {
      Object.assign(params, JSON.parse(body));
    }
  }

  return params;
}

// 生成模拟用户数据
let List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      username: Mock.Random.word(5, 10),
      'status|1': ['active', 'inactive'],
      roleId: () => predefinedRoles[Mock.Random.integer(0, predefinedRoles.length - 1)].id,
      createdAt: Mock.Random.datetime()
    })
  )
}

export default {
  // 获取用户列表
  getUser: config => {
    console.log('Mock getUser called with config:', config);
    const { username, page = 1, pageSize = 10 } = JSON.parse(config.body);
    console.log('Parsed parameters:', { username, page, pageSize });
    
    const mockList = List.filter(user => {
      if (username && !user.username.toLowerCase().includes(username.toLowerCase())) {
        return false;
      }
      return true;
    })
    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    
    const result = {
      code: 200,
      total: mockList.length,
      users: pageList
    };
    console.log('Mock getUser returning:', result);
    return result;
  },

  // 添加用户
  addUser: config => {
    const { username, status, roleId } = JSON.parse(config.body);
    const newUser = {
      id: Mock.Random.guid(),
      username,
      status,
      roleId,
      createdAt: Mock.Random.now()
    };
    List.unshift(newUser);
    return {
      code: 200,
      data: newUser,
      message: 'User added successfully'
    }
  },

  // 删除用户
  deleteUser: config => {
    console.log('Mock deleteUser called with config:', config);
    const { id } = JSON.parse(config.body);

    if (!id) {
      console.log('Invalid parameters: Missing user ID');
      return {
        code: 400,
        message: 'Invalid parameters: Missing user ID'
      }
    }

    const index = List.findIndex(u => u.id === id);
    if (index === -1) {
      console.log('User not found');
      return {
        code: 404,
        message: 'User not found'
      }
    }

    List.splice(index, 1);
    console.log('User deleted successfully');
    return {
      code: 200,
      message: 'User deleted successfully'
    }
  },

  // 更新用户
  editUser: config => {
    const { id, username, status, roleId } = JSON.parse(config.body);
    console.log('Editing user:', { id, username, status, roleId });
    const index = List.findIndex(u => u.id === id);
    if (index !== -1) {
      List[index] = {
        ...List[index],
        username,
        status,
        roleId
      }
      console.log('User updated:', List[index]);
      return {
        code: 200,
        data: List[index],
        message: 'User updated successfully'
      }
    } else {
      return {
        code: 404,
        message: 'User not found'
      }
    }
  }
}
