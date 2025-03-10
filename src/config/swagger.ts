import { Application } from "oak";
import { SwaggerRouter } from "oak_swagger_ui";

// Swagger文档配置
export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "用户管理API文档",
    version: "1.0.0",
    description: "基于Oak框架的RESTful API",
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
      description: "开发环境",
    },
  ],
  tags: [
    {
      name: "用户",
      description: "用户相关接口",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", description: "用户ID" },
          name: { type: "string", description: "用户名称" },
          email: { type: "string", description: "用户邮箱" },
          createdAt: { type: "string", format: "date-time", description: "创建时间" },
        },
      },
      CreateUserDto: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", description: "用户名称" },
          email: { type: "string", description: "用户邮箱" },
        },
      },
      UpdateUserDto: {
        type: "object",
        properties: {
          name: { type: "string", description: "用户名称" },
          email: { type: "string", description: "用户邮箱" },
        },
      },
    },
  },
};

// 配置Swagger UI
export function setupSwagger(app: Application) {
  const swaggerRouter = new SwaggerRouter();
  
  // 设置Swagger UI路由
  swaggerRouter.swagger({
    swaggerJson: swaggerConfig,
    swaggerUiOptions: {
      url: "/swagger/swagger.json",
    },
    exposeApiDocs: true,
    apiPrefix: "/swagger",
  });

  // 注册Swagger路由
  app.use(swaggerRouter.routes());
  app.use(swaggerRouter.allowedMethods());
}