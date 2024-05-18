import express, { Request, Response } from "express";
import adminController from "../controllers/adminController";
import AdminService from "../service/adminService";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import adminAuth from '../middlewares/adminAuthMiddleware'
import ReportRepository, { JobReportRepository } from "../repositories/reportRepository";
import JobRepository from "../repositories/jobRepository";
import PostRepository from "../repositories/postRepository";

const adminRouter = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const jobRepository = new JobRepository();
const postRepository = new PostRepository();
const jobReportRepository = new JobReportRepository();
const reportRepository = new ReportRepository()
const adminService: AdminService = new AdminService(adminReopsitory, encrypt, createjwt, jobReportRepository, reportRepository, jobRepository,postRepository);
const controller = new adminController(adminService);

//admin login
adminRouter.post('/login', async (req: Request, res: Response) => controller.adminLogin(req, res));
adminRouter.post('/registration', async (req: Request, res: Response) => controller.adminSignup(req, res));
adminRouter.post('/verify-otp', async (req: Request, res: Response) => controller.veryfyOtp(req, res));
adminRouter.get('/logout', async (req: Request, res: Response) => controller.adminLogout(req, res));

//users
adminRouter.get('/users', adminAuth, async (req: Request, res: Response) => controller.getUserList(req, res));
adminRouter.put('/users/block/:userId', adminAuth, async (req: Request, res: Response) => controller.blockNunblockUser(req, res));
adminRouter.post('/users', async (req: Request, res: Response) => controller.sentNotification(req, res));

//jobs
adminRouter.get('/all-jobs', async (req: Request, res: Response) => controller.getUserList(req, res));
adminRouter.get('/get-all-jobreports', async (req: Request, res: Response) => controller.getAllJobReports(req, res));
adminRouter.put('/change-report-status/:jobId', async (req: Request, res: Response) => controller.changeReportStatus(req, res));

//posts
adminRouter.get('/get-all-postreports', async (req: Request, res: Response) => controller.getAllPostReports(req, res));
adminRouter.put('/change-status-post/:postId', async (req: Request, res: Response) => controller.changePostReportStatus(req, res));


///subscriptions
// adminRouter.get('/subscription', async (req: Request, res: Response) => controller.getSubscriptionList(req, res));
// adminRouter.post('/subscription', async (req: Request, res: Response) => controller.createSubscription(req, res));
// adminRouter.put('/subscription', async (req: Request, res: Response) => controller.editSubscription(req, res));
// adminRouter.delete('/subscription', async (req: Request, res: Response) => controller.deleteSubscription(req, res));



export default adminRouter;