import { Context } from "oak";

// 请求日志中间件
export const loggerMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
};