import express, { Request, Response } from "express";
import adminController from "../controllers/adminController";
import AdminService from "../service/adminService";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";

const adminRouter = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const adminService: AdminService = new AdminService(adminReopsitory, encrypt, createjwt);
const controller = new adminController(adminService);

//admin login
adminRouter.post('/login', async (req: Request, res: Response) => controller.adminLogin(req, res));
adminRouter.post('/registration', async (req: Request, res: Response) => controller.adminSignup(req, res));
adminRouter.post('/verify-otp', async (req: Request, res: Response) => controller.veryfyOtp(req, res));

//users
adminRouter.get('/users', async (req: Request, res: Response) => controller.getUserList(req, res));
adminRouter.patch('/users/block/:userId', async (req: Request, res: Response) => controller.blockNunblockUser(req, res));
adminRouter.post('/users', async (req: Request, res: Response) => controller.sentNotification(req, res));

//jobs
adminRouter.get('/all-jobs', async (req: Request, res: Response) => controller.getUserList(req, res));

///subscriptions
adminRouter.get('/subscription', async (req: Request, res: Response) => controller.getSubscriptionList(req, res));
adminRouter.post('/subscription', async (req: Request, res: Response) => controller.createSubscription(req, res));
adminRouter.put('/subscription', async (req: Request, res: Response) => controller.editSubscription(req, res));
adminRouter.delete('/subscription', async (req: Request, res: Response) => controller.deleteSubscription(req, res));



export default adminRouter;