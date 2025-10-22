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
import SubscriptionRepository from "../repositories/subscriptionRepository";
import SubscriptionService from "../service/subscriptionService";
import SubscriptionController from "../controllers/subscriptionController";
import UserRepository from "../repositories/userRepository";
import JobApplicationRepository from "../repositories/jobApplicationRepository";

const adminRouter = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const jobRepository = new JobRepository();
const postRepository = new PostRepository();
const jobReportRepository = new JobReportRepository();
const reportRepository = new ReportRepository()
const jobApplicationRepository = new JobApplicationRepository();
const adminService: AdminService = new AdminService(adminReopsitory, encrypt, createjwt, jobReportRepository, reportRepository, jobRepository, postRepository, jobApplicationRepository);
const controller = new adminController(adminService);

//admin login
adminRouter.post('/login', async (req: Request, res: Response) => controller.adminLogin(req, res));
adminRouter.post('/registration', async (req: Request, res: Response) => controller.adminSignup(req, res));
adminRouter.post('/verify-otp', async (req: Request, res: Response) => controller.veryfyOtp(req, res));
adminRouter.get('/logout', async (req: Request, res: Response) => controller.adminLogout(req, res));

// dashboard
adminRouter.get('/dashboard/bar', async (req: Request, res: Response) => controller.barChart(req, res));
adminRouter.get('/dashboard/line', async (req: Request, res: Response) => controller.lineChart(req, res));
adminRouter.get('/dashboard/pie', async (req: Request, res: Response) => controller.pieChart(req, res));

//users
adminRouter.get('/users', adminAuth, async (req: Request, res: Response) => controller.getUserList(req, res));
adminRouter.put('/users/block/:userId', adminAuth, async (req: Request, res: Response) => controller.blockNunblockUser(req, res));
adminRouter.post('/users', async (req: Request, res: Response) => controller.sentNotification(req, res));

//jobs
adminRouter.get('/all-jobs', async (req: Request, res: Response) => controller.getUserList(req, res));
adminRouter.get('/get-all-jobreports', async (req: Request, res: Response) => controller.getAllJobReports(req, res));
adminRouter.put('/change-report-status/:jobId', async (req: Request, res: Response) => controller.changeReportStatus(req, res));
adminRouter.put('/delete-job-report/:reportId', async (req: Request, res: Response) => controller.deleteJobReport(req, res));

//posts
adminRouter.get('/get-all-postreports', async (req: Request, res: Response) => controller.getAllPostReports(req, res));
adminRouter.put('/change-status-post/:postId', async (req: Request, res: Response) => controller.changePostReportStatus(req, res));
adminRouter.put('/delete-post-report/:reportId', async (req: Request, res: Response) => controller.deletePostReport(req, res));

///subscriptions
const subscriptionRepository = new SubscriptionRepository();
const userRepository = new UserRepository()
const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

adminRouter.get('/subscription', async (req: Request, res: Response) => subscriptionController.getSubscriptionList(req, res));
adminRouter.post('/subscription', async (req: Request, res: Response) => subscriptionController.createSubscription(req, res));
adminRouter.put('/subscription/:id', async (req: Request, res: Response) => subscriptionController.editSubscription(req, res));
adminRouter.delete('/subscription/:id', async (req: Request, res: Response) => subscriptionController.deleteSubscription(req, res));
adminRouter.put('/subscription/activate/:id', async (req: Request, res: Response) => subscriptionController.activateSubscription(req, res));
adminRouter.put('/subscription/deactivate/:id', async (req: Request, res: Response) => subscriptionController.deactivateSubscription(req, res));



export default adminRouter;