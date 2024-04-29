import express, { Request, Response, Router } from "express";
import authenticate from '../middlewares/userAuthMiddleware';
import RecruiterRepository from "../repositories/recruiterRepository";
import RecruiterService from "../service/recruiterService";
import RecruiterController from "../controllers/recruiterController";

const recruiterRouter: Router = express.Router();

const recruiterRepository = new RecruiterRepository();
const recruiterService = new RecruiterService(recruiterRepository);
const recruiterController = new RecruiterController(recruiterService);

recruiterRouter.get('/get-alljobs', authenticate, async (req: Request, res: Response) => recruiterController.getAllJobs(req, res));
recruiterRouter.post('/post-new-job', authenticate, async (req: Request, res: Response) => recruiterController.postNewJob(req, res));
recruiterRouter.delete('/delete-job', async (req: Request, res: Response) => recruiterController.deleteJob(req, res));
recruiterRouter.put('/edit-jobs', async (req: Request, res: Response) => recruiterController.editJobs(req, res));


export default recruiterRouter;