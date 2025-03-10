import app from "./src/app.ts";
import { APP_CONFIG } from "./src/config/app.ts";

// 启动服务器
await app.listen({ port: APP_CONFIG.port, hostname: APP_CONFIG.host });