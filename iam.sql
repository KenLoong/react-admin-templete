CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- 用户唯一标识符
    username VARCHAR(50) NOT NULL UNIQUE,  -- 用户名，不可重复
    password VARCHAR(255) NOT NULL,  -- 加密后的密码
    status ENUM('active', 'inactive') DEFAULT 'active',  -- 用户状态，默认为激活状态
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 用户创建时间
);


CREATE TABLE Role (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- 角色唯一标识符
    name VARCHAR(50) NOT NULL UNIQUE,  -- 角色名称，不可重复
    description TEXT  -- 角色描述
);


CREATE TABLE Permission (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- 权限唯一标识符
    name VARCHAR(100) NOT NULL UNIQUE,  -- 权限名称，如'user:create'，不可重复
    description TEXT,  -- 权限描述
    type ENUM('menu', 'action') NOT NULL,  -- 权限类型：菜单项或具体操作
    url VARCHAR(255),  -- 对应的前端路由或API端点（如果适用）
    parent_id INT,  -- 父权限ID，用于构建层级菜单
    order_num INT,  -- 用于同级权限的排序
    FOREIGN KEY (parent_id) REFERENCES Permission(id)  -- 外键约束，确保parent_id有效
);

CREATE TABLE User_Role (
    user_id INT,  -- 用户ID
    role_id INT,  -- 角色ID
    PRIMARY KEY (user_id, role_id),  -- 联合主键，确保一个用户在一个角色中只出现一次
    FOREIGN KEY (user_id) REFERENCES User(id),  -- 外键约束，确保user_id有效
    FOREIGN KEY (role_id) REFERENCES Role(id)  -- 外键约束，确保role_id有效
);

CREATE TABLE Role_Permission (
    role_id INT,  -- 角色ID
    permission_id INT,  -- 权限ID
    PRIMARY KEY (role_id, permission_id),  -- 联合主键，确保一个角色对一个权限只分配一次
    FOREIGN KEY (role_id) REFERENCES Role(id),  -- 外键约束，确保role_id有效
    FOREIGN KEY (permission_id) REFERENCES Permission(id)  -- 外键约束，确保permission_id有效
);