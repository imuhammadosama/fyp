import { Router } from "express";
import {
  Login,
  UpdateMember,
  UpdatePassword,
  AddNewService,
  DeleteService,
  GetServices,
  UpdateService,
  HireService,
  GetHireStatus,
  MarkServiceAsComplete,
  GetMyActiveOrders,
  ChangeOrderApprovalStatus,
  GetMyOrdersHistory,
  GetMyHiringHistory,
  GetAllDrivers,
  GetUpdatedTrack,
  RemoveNotificationToken,
  GetHomeActiveOrders,
} from "../controllers/member.controller";

const MemberRouter = Router();

MemberRouter.post("/login", Login);
MemberRouter.post("/profile/update", UpdateMember);
MemberRouter.post("/profile/password", UpdatePassword);

MemberRouter.get("/services", GetServices);
MemberRouter.post("/service/add", AddNewService);
MemberRouter.post("/service/update", UpdateService);
MemberRouter.post("/service/delete", DeleteService);
MemberRouter.post("/service/hire", HireService);
MemberRouter.get("/service/hireStatus", GetHireStatus);
MemberRouter.post("/service/changeApprovalStatus", ChangeOrderApprovalStatus);
MemberRouter.post("/service/markComplete", MarkServiceAsComplete);

MemberRouter.get("/orders", GetMyActiveOrders);
MemberRouter.get("/orders/history", GetMyOrdersHistory);

MemberRouter.get("/hiring/history", GetMyHiringHistory);

MemberRouter.get("/drivers/all", GetAllDrivers);
MemberRouter.get("/driver/track", GetUpdatedTrack);

MemberRouter.post("/notification/remove", RemoveNotificationToken);

MemberRouter.get("/orders/home", GetHomeActiveOrders);

export default MemberRouter;
