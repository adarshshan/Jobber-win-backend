import express, { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/userController";
import UserRepository from '../repositories/userRepository';
import userService from "../service/userService";
import authenticate from '../middlewares/userAuthMiddleware';
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import PostRepository from "../repositories/postRepository";
import PostServices from "../service/postService";
import PostController from "../controllers/postController";



const userRouter: Router = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const userRepository = new UserRepository()
const userServices = new userService(userRepository, encrypt, createjwt);
const controller = new userController(userServices);

userRouter.post('/login', async (req: Request, res: Response) => await controller.userLogin(req, res));
userRouter.post('/google-login', async (req: Request, res: Response, next: NextFunction) => await controller.googleLogin(req, res, next));
userRouter.post('/registration', async (req: Request, res: Response) => await controller.userSingnup(req, res));
userRouter.post('/veryfy-otp', async (req: Request, res: Response) => await controller.veryfyOtp(req, res));
userRouter.get('/logout', async (req: Request, res: Response) => await controller.logout(req, res));
userRouter.get('/profile', authenticate, async (req: Request, res: Response) => await controller.getProfile(req, res));

userRouter.put('/edit-user', async (req: Request, res: Response) => await controller.editUserDetails(req, res));
userRouter.put('/edit-about/:id', async (req: Request, res: Response) => await controller.changeAboutInfo(req, res));
userRouter.put('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));
userRouter.patch('/add-skill/:id', async (req: Request, res: Response) => await controller.addSkill(req, res));
userRouter.get('/get-skills/:id', async (req: Request, res: Response) => await controller.getAllSkill(req, res));
userRouter.delete('/remove-skill/:skill/:id', async (req: Request, res: Response) => await controller.removeSkill(req, res));
userRouter.patch('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));




const postRepository = new PostRepository();
const postService = new PostServices(postRepository);
const postController = new PostController(postService);


userRouter.post('/new-post', async (req: Request, res: Response) => await postController.savePost(req, res))
userRouter.get('/getposts', async (req: Request, res: Response) => await postController.getPosts(req, res))
userRouter.get('/get-posts-home', async (req: Request, res: Response) => await postController.getPostForHome(req, res))


export default userRouter;