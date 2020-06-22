import { Router } from 'express';
import {
  CreateAdmin,
  Login,
  AddDriver,
  GetAllDrivers,
  DeleteDriver,
  UpdateDriver,
  UpdatePassword,
  AddMember,
  GetAllMembers,
  UpdateMember,
  DeleteMember,
  AddGuard,
  GetAllGuards,
  UpdateGuard,
  DeleteGuard,
  GetAlerts,
  GetDriverRides,
  TrackActiveRide,
  GetAllWorkers,
  GetWorkerServices,
  GetService,
  DeleteService,
  GetAllServices,
} from '../controllers/admin.controller';

const AdminRouter = Router();

AdminRouter.get('/', CreateAdmin);
AdminRouter.post('/login', Login);

AdminRouter.post('/driver/add', AddDriver);
AdminRouter.get('/driver/view', GetAllDrivers);
AdminRouter.post('/driver/update', UpdateDriver);
AdminRouter.post('/driver/update/password', UpdatePassword);
AdminRouter.post('/driver/delete', DeleteDriver);
AdminRouter.get('/driver/rides', GetDriverRides);
AdminRouter.get('/driver/track', TrackActiveRide);

AdminRouter.post('/member/add', AddMember);
AdminRouter.get('/member/view', GetAllMembers);
AdminRouter.post('/member/update', UpdateMember);
AdminRouter.post('/member/update/password', UpdatePassword);
AdminRouter.post('/member/delete', DeleteMember);
AdminRouter.get('/member/:id/services', GetWorkerServices);

AdminRouter.post('/guard/add', AddGuard);
AdminRouter.get('/guard/view', GetAllGuards);
AdminRouter.post('/guard/update', UpdateGuard);
AdminRouter.post('/guard/delete', DeleteGuard);
AdminRouter.get('/guard/alerts', GetAlerts);

AdminRouter.get('/worker/view', GetAllWorkers);
AdminRouter.get('/worker/:id/services', GetWorkerServices);

AdminRouter.get('/service/:id', GetService);
AdminRouter.post('/service/delete', DeleteService);

AdminRouter.get('/services/all', GetAllServices);

export default AdminRouter;
