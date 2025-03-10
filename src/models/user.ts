// 用户模型定义

// 用户接口定义
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// 用户数据存储
export const users: Map<string, User> = new Map();

// 用户创建接口
export interface CreateUserDto {
  name: string;
  email: string;
}

// 用户更新接口
export interface UpdateUserDto {
  name?: string;
  email?: string;
}