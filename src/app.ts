import { Application } from "oak";
import { APP_CONFIG } from "./config/app.ts";
import userRouter from "./routes/user.routes.ts";
import { apiPrefixMiddleware } from "./middleware/api-prefix.ts";

// 创建应用实例
const app = new Application();

// 静态文件中间件
import { staticFileMiddleware } from "./middleware/static.ts";
app.use(staticFileMiddleware);

// 中间件：记录请求日志
import { loggerMiddleware } from "./middleware/logger.ts";
app.use(loggerMiddleware);

// 注册路由
app.use(apiPrefixMiddleware, userRouter.routes());
app.use(apiPrefixMiddleware, userRouter.allowedMethods());

// 启动服务器
console.log(`Server running on http://${APP_CONFIG.host}:${APP_CONFIG.port}`);

export default app;
