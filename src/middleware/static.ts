import { Context, send } from "oak";
import { API_PREFIX } from "../config/app.ts";
import { send404Response } from "../utils/response.ts";

// 静态文件中间件
export const staticFileMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const { pathname } = ctx.request.url;

  // 如果是API请求，直接放行
  if (pathname.startsWith(API_PREFIX)) {
    await next();
    return;
  }

  try {
    // 尝试访问静态资源
    await send(ctx, pathname, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    // 静态资源访问失败，返回404
    send404Response(ctx);
  }
};