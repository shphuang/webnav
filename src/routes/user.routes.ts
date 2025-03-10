import { API_PREFIX } from "./../config/app.ts";
import { Router } from "oak";
import { UserController } from "../controllers/user.controller.ts";

const router = new Router({
  prefix: API_PREFIX,
});

// 用户路由
router
  .get("/users", UserController.getUsers)
  .get("/users/:id", UserController.getUser)
  .post("/users", UserController.createUser)
  .put("/users/:id", UserController.updateUser)
  .delete("/users/:id", UserController.deleteUser);

export default router;
