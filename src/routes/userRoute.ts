import express, { Router, Request, Response } from "express";
import userController from "../controllers/userController";
import UserRepository from '../repositories/userRepository';
import userService from "../service/userService";



const userRouter: Router = express.Router();

const userRepository = new UserRepository()
const userServices = new userService(userRepository)
const controller = new userController(userServices);

userRouter.post('/login', async (req: Request, res: Response) => await controller.userLogin(req, res));
userRouter.post('/google-login', async (req: Request, res: Response) => await controller.googleLogin(req, res));
userRouter.post('/registration', async (req: Request, res: Response) => await controller.userSingnup(req, res));
userRouter.post('/veryfy-otp', async (req: Request, res: Response) => await controller.veryfyOtp(req, res));
userRouter.get('/profile', async (req: Request, res: Response) => await controller.profile(req, res));
userRouter.put('/edit-user', async (req: Request, res: Response) => await controller.editUserDetails(req, res));
userRouter.put('/edit-about', async (req: Request, res: Response) => await controller.changeAboutInfo(req, res));
userRouter.put('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));
userRouter.put('/add-skill', async (req: Request, res: Response) => await controller.addSkill(req, res));
userRouter.delete('/remove-skill', async (req: Request, res: Response) => await controller.removeSkill(req, res));
userRouter.put('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));


export default userRouter;