import express, { Request, Response, Router } from "express";
import authenticate from '../middlewares/userAuthMiddleware';
import RecruiterRepository from "../repositories/recruiterRepository";
import RecruiterService from "../service/recruiterService";
import RecruiterController from "../controllers/recruiterController";
import JobApplicationRepository from "../repositories/jobApplicationRepository";
import SubscriptionRepository from "../repositories/subscriptionRepository";
import SubscriptionService from "../service/subscriptionService";
import SubscriptionController from "../controllers/subscriptionController";
import UserRepository from "../repositories/userRepository";
import { upload } from "../utils/multer";

const recruiterRouter: Router = express.Router();

const jobApplicationRepository = new JobApplicationRepository();
const recruiterRepository = new RecruiterRepository();
const subscriptionRepository = new SubscriptionRepository();
const userRepository = new UserRepository();
const recruiterService = new RecruiterService(recruiterRepository, jobApplicationRepository, userRepository, subscriptionRepository);
const recruiterController = new RecruiterController(recruiterService);

recruiterRouter.get('/get-alljobs', authenticate, async (req: Request, res: Response) => recruiterController.getAllJobs(req, res));
recruiterRouter.post('/post-new-job', authenticate, async (req: Request, res: Response) => recruiterController.postNewJob(req, res));
// recruiterRouter.delete('/delete-job', async (req: Request, res: Response) => recruiterController.deleteJob(req, res));
recruiterRouter.put('/edit-jobs', authenticate, async (req: Request, res: Response) => recruiterController.editJobs(req, res));
recruiterRouter.get('/get-all-applications', authenticate, async (req: Request, res: Response) => recruiterController.getAllApplications(req, res));
recruiterRouter.put('/change-application-states/:status/:applicationId', authenticate, async (req: Request, res: Response) => recruiterController.changeStatus(req, res));
recruiterRouter.get('/change-application/graph', authenticate, async (req: Request, res: Response) => recruiterController.getGraphData(req, res));


recruiterRouter.post('/upload-logo' , upload.single('file'),  async (req: Request, res: Response) => recruiterController.uploadLogo(req, res));




// Subscription

const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository);
const subscriptionController = new SubscriptionController(subscriptionService);


recruiterRouter.get('/get-subscriptions', authenticate, async (req: Request, res: Response) => subscriptionController.getAllSubscriptions(req, res));
recruiterRouter.post('/payment-subscription', authenticate, async (req: Request, res: Response) => subscriptionController.subscriptionPayment(req, res));
recruiterRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => subscriptionController.webHook(req, res));
recruiterRouter.get('/current-subscriptions', authenticate, async (req: Request, res: Response) => subscriptionController.getCurrentSubscription(req, res));





export default recruiterRouter;