import { Router } from "express";
import {
  GetAllGuards,
  GenerateAlert,
  ResolveAlert,
} from "../controllers/guard.controller";

const GuardRouter = Router();

GuardRouter.get("/all", GetAllGuards);

GuardRouter.post("/alert", GenerateAlert);
GuardRouter.post("/alert/resolve", ResolveAlert);

export default GuardRouter;
