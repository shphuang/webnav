import { Context } from "oak";

// 通用的404错误响应处理函数
export const send404Response = (ctx: Context) => {
  ctx.response.status = 404;
  ctx.response.body = { message: "Not Found" };
};