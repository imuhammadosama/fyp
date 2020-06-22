import { Router } from "express";
import {
  RecoverPasswordBySMS,
  VerifyRecoveryCode,
  UpdatePassword,
} from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.post("/recover", RecoverPasswordBySMS);
UserRouter.post("/recover/verify", VerifyRecoveryCode);
UserRouter.post("/recover/changePassword", UpdatePassword);

export default UserRouter;
