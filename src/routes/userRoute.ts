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
import NetworkController from "../controllers/networkController";
import NetworkService from "../service/networkService";
import NetworkRepository from "../repositories/networkRepository";
import JobRepository from "../repositories/jobRepository";
import JobService from "../service/jobService";
import JobController from "../controllers/jobController";



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

userRouter.put('/edit-user/:userId', async (req: Request, res: Response) => await controller.editUserDetails(req, res));
userRouter.put('/edit-about/:id', async (req: Request, res: Response) => await controller.changeAboutInfo(req, res));
userRouter.put('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));
userRouter.delete('/delete-profile/:userId', async (req: Request, res: Response) => await controller.deleteProfilePic(req, res));
userRouter.patch('/add-skill/:id', async (req: Request, res: Response) => await controller.addSkill(req, res));
userRouter.get('/get-skills/:id', async (req: Request, res: Response) => await controller.getAllSkill(req, res));
userRouter.delete('/remove-skill/:skill/:id', async (req: Request, res: Response) => await controller.removeSkill(req, res));
userRouter.patch('/set-profile', async (req: Request, res: Response) => await controller.setProfilePic(req, res));



//postController
const postRepository = new PostRepository();
const postService = new PostServices(postRepository);
const postController = new PostController(postService);


userRouter.post('/new-post', async (req: Request, res: Response) => await postController.savePost(req, res))
userRouter.get('/getposts/:userId', async (req: Request, res: Response) => await postController.getPosts(req, res))
userRouter.get('/get-posts-home', async (req: Request, res: Response) => await postController.getPostForHome(req, res))


//netWorkcontroller
const networkRepository = new NetworkRepository();
const networkService = new NetworkService(networkRepository);
const networkController = new NetworkController(networkService);

userRouter.get('/get-alluser', authenticate, async (req: Request, res: Response) => await networkController.getAllUsers(req, res));
userRouter.get('/get-user-profile/:userId', authenticate, async (req: Request, res: Response) => await networkController.getUserProfile(req, res));
userRouter.get('/get-user-posts/:userId', async (req: Request, res: Response) => await networkController.getUserPostsById(req, res));
userRouter.post('/sendrequest', authenticate, async (req: Request, res: Response) => await networkController.sendRequest(req, res));
userRouter.delete('/withdraw-request/:id', authenticate, async (req: Request, res: Response) => await networkController.withdrawSentRequest(req, res));
userRouter.get('/getsend-requests', authenticate, async (req: Request, res: Response) => await networkController.getAllsendRequests(req, res));
userRouter.get('/getallrequests', authenticate, async (req: Request, res: Response) => await networkController.getAllRequests(req, res));
userRouter.put('/add-tofriend/:friendId', authenticate, async (req: Request, res: Response) => await networkController.addToFriend(req, res));
userRouter.put('/remove-request/:id', authenticate, async (req: Request, res: Response) => await networkController.removeRequest(req, res));
userRouter.get('/get-friends', authenticate, async (req: Request, res: Response) => await networkController.getAllFriends(req, res));
userRouter.delete('/unfriend/:id', authenticate, async (req: Request, res: Response) => await networkController.unFriend(req, res));


//JobController
const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository, userRepository);
const jobController = new JobController(jobService);


userRouter.get('/get-all-jobs', authenticate, async (req: Request, res: Response) => await jobController.getAllJobs(req, res));
userRouter.get('/get-single-jobs/:jobId', async (req: Request, res: Response) => await jobController.getSingleJobDetails(req, res));
userRouter.post('/apply-job/:jobId', authenticate, async (req: Request, res: Response) => await jobController.applyJOb(req, res));
userRouter.get('/get-saved-applied-jobs', authenticate, async (req: Request, res: Response) => await jobController.getApplied(req, res))



export default userRouter;