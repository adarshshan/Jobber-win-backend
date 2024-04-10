import express, { Request, Response } from "express";
import adminController from "../controllers/adminController";

const adminRouter = express.Router();
const controller = new adminController();

adminRouter.get('/login', async (req: Request, res: Response) => controller.adminLogin(req, res));



export default adminRouter;