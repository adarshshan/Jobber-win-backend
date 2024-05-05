import { Request, Response, Router } from "express";
import ChatRepository from "../repositories/chatRepository";
import ChatService from "../service/chatService";
import ChatController from "../controllers/chatController";
import UserRepository from "../repositories/userRepository";
import express from 'express'
import authenticate from '../middlewares/userAuthMiddleware'

const chatRouter: Router = express.Router();


const chatRepository = new ChatRepository();
const userRepository = new UserRepository();
const chatService = new ChatService(chatRepository, userRepository);
const controller = new ChatController(chatService);

chatRouter.post('/', async (req: Request, res: Response) => controller.sendMessage(req, res))
chatRouter.get('/', authenticate, async (req: Request, res: Response) => controller.getAllUsers(req, res));
chatRouter.post('/:chatId', async (req: Request, res: Response) => controller.allMessages(req, res))


export default chatRouter;