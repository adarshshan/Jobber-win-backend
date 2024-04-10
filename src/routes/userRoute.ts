import express, { Router, Request, Response } from "express";
import userController from "../controllers/userController";



const userRouter: Router = express.Router();

const controller = new userController();

userRouter.get('/login', async (req: Request, res: Response) => await controller.userLogin(req, res));
userRouter.get('/registration', async (req: Request, res: Response) => await controller.userSingnup(req, res));


export default userRouter;