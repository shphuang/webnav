import { Context } from "oak";
import { User, users, CreateUserDto, UpdateUserDto } from "../models/user.ts";

// 用户控制器
export class UserController {
  // 获取所有用户
  static getUsers(ctx: Context) {
    ctx.response.body = Array.from(users.values());
  }

  // 获取单个用户
  static getUser(ctx: Context) {
    const user = users.get(ctx.params.id!);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }
    ctx.response.body = user;
  }

  // 创建用户
  static async createUser(ctx: Context) {
    const body = ctx.request.body();
    if (body.type !== "json") {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid request body" };
      return;
    }

    const { name, email } = await body.value as CreateUserDto;
    if (!name || !email) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Name and email are required" };
      return;
    }

    const id = crypto.randomUUID();
    const user: User = {
      id,
      name,
      email,
      createdAt: new Date(),
    };

    users.set(id, user);
    ctx.response.status = 201;
    ctx.response.body = user;
  }

  // 更新用户
  static async updateUser(ctx: Context) {
    const user = users.get(ctx.params.id!);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    const body = ctx.request.body();
    if (body.type !== "json") {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid request body" };
      return;
    }

    const updateData = await body.value as UpdateUserDto;
    const updatedUser = {
      ...user,
      ...updateData,
      id: user.id,
      createdAt: user.createdAt,
    };

    users.set(user.id, updatedUser);
    ctx.response.body = updatedUser;
  }

  // 删除用户
  static deleteUser(ctx: Context) {
    const user = users.get(ctx.params.id!);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    users.delete(ctx.params.id!);
    ctx.response.status = 204;
  }
}