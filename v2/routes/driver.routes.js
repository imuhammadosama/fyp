import { Router } from "express";
import {
  Login,
  UpdateDriver,
  UpdatePassword,
  GetRideStatus,
  StartRide,
  TrackRide,
  StopRide,
} from "../controllers/driver.controller";

const DriverRouter = Router();

DriverRouter.post("/login", Login);
DriverRouter.post("/profile/update", UpdateDriver);
DriverRouter.post("/profile/password", UpdatePassword);

DriverRouter.get("/ride/status", GetRideStatus);
DriverRouter.post("/ride/start", StartRide);
DriverRouter.post("/ride/stop", StopRide);
DriverRouter.post("/ride/track", TrackRide);

export default DriverRouter;
