import { Context } from "oak";
import { API_PREFIX } from "../config/app.ts";
import { send404Response } from "../utils/response.ts";

// API前缀验证中间件
export const apiPrefixMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const { pathname } = ctx.request.url;
  
  // 检查API前缀
  if (!pathname.startsWith(API_PREFIX)) {
    send404Response(ctx);
    return;
  }

  await next();
};