import { Router } from "express";
import {
  AddWorker,
  Login,
  UpdateWorker,
  UpdatePassword,
  AddNewService,
  GetServices,
  UpdateService,
  DeleteService,
  GetMyActiveOrders,
  GetMyOrdersHistory,
  GetHomeActiveOrders,
} from "../controllers/worker.controller";

const WorkerRouter = Router();

WorkerRouter.post("/register", AddWorker);
WorkerRouter.post("/login", Login);
WorkerRouter.post("/profile/update", UpdateWorker);
WorkerRouter.post("/profile/password", UpdatePassword);

WorkerRouter.get("/services", GetServices);
WorkerRouter.post("/service/add", AddNewService);
WorkerRouter.post("/service/update", UpdateService);
WorkerRouter.post("/service/delete", DeleteService);

WorkerRouter.get("/orders", GetMyActiveOrders);
WorkerRouter.get("/orders/home", GetHomeActiveOrders);
WorkerRouter.get("/orders/history", GetMyOrdersHistory);

export default WorkerRouter;
