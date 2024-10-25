import Mock from 'mockjs'
import { predefinedRoles } from './role'
import { predefinedPermissions } from './permission'

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

// 预定义用户
const predefinedUsers = [
  {
    id: '1',
    username: 'superadmin',
    password: '123456', // 在实际应用中，密码应该被加密存储
    status: 'active',
    roleId: '1', // Super Admin
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'admin',
    password: '123456',
    status: 'active',
    roleId: '2', // Admin
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    username: 'manager',
    password: '123456',
    status: 'active',
    roleId: '3', // User Manager
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    username: 'user',
    password: '123456',
    status: 'active',
    roleId: '4', // Regular User
    createdAt: '2023-01-04T00:00:00Z'
  }
];

// 生成模拟用户数据，包括预定义用户
let List = [...predefinedUsers];
const count = 20;

for (let i = predefinedUsers.length; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      username: Mock.Random.word(5, 10),
      password: Mock.Random.string('lower', 8, 8),
      'status|1': ['active', 'inactive'],
      roleId: () => predefinedRoles[Mock.Random.integer(0, predefinedRoles.length - 1)].id,
      createdAt: Mock.Random.datetime()
    })
  )
}

export const login = (username, password) => {
  console.log('Login attempt:', { username, password });
  const user = List.find(u => u.username === username && u.password === password);
  if (user) {
    const now = Date.now();
    const token = btoa(JSON.stringify({
      username: user.username,
      exp: now + 3600000 // 1小时后过期
    }));
    console.log('Generated token:', token);
    return {
      code: 200,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        // ... 其他用户信息
      }
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误'
    }
  }
};

export default {
  // 获取用户列表
  getUser: config => {
    console.log('Mock getUser called with config:', config);
    let { body } = config;
    
    // 确保 body 是一个有效的 JSON 字符串
    if (typeof body === 'string' && body.trim() !== '') {
      try {
        body = JSON.parse(body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        body = {};
      }
    } else {
      console.warn('Request body is empty or not a string');
      body = {};
    }

    const { username, page = 1, pageSize = 10 } = body;
    console.log('Parsed parameters:', { username, page, pageSize });
    
    const mockList = List.filter(user => {
      if (username && !user.username.toLowerCase().includes(username.toLowerCase())) {
        return false;
      }
      return true;
    })
    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    
    console.log('Filtered mockList:', mockList);
    console.log('Page list:', pageList);
    
    return {
      code: 200,
      list: pageList,
      total: mockList.length,
    };
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
      user: newUser,
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
    console.log('Edit user config:', config);
    console.log('Config body type:', typeof config.body);
    console.log('Config body content:', config.body);

    let body;
    if (config.body === undefined) {
      console.error('Config body is undefined');
      return {
        code: 400,
        message: 'Request body is missing'
      };
    }

    if (typeof config.body === 'string') {
      try {
        body = JSON.parse(config.body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        return {
          code: 400,
          message: 'Invalid request body'
        };
      }
    } else if (typeof config.body === 'object') {
      body = config.body;
    } else {
      console.error('Unexpected body type:', typeof config.body);
      return {
        code: 400,
        message: 'Invalid request body'
      };
    }

    const { id, username, status, roleId } = body;
    console.log('Editing user:', { id, username, status, roleId });
    
    if (!id) {
      return {
        code: 400,
        message: 'Missing user ID'
      };
    }

    const index = List.findIndex(u => u.id === id);
    if (index !== -1) {
      List[index] = {
        ...List[index],
        username: username || List[index].username,
        status: status || List[index].status,
        roleId: roleId || List[index].roleId
      };
      console.log('User updated:', List[index]);
      return {
        code: 200,
        user: List[index],
        message: 'User updated successfully'
      };
    } else {
      return {
        code: 404,
        message: 'User not found'
      };
    }
  },

  login
}
