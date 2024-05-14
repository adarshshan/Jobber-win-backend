import express, { Request, Response, Router } from "express";
import MessageRepository from "../repositories/messageRepository";
import MessageService from "../service/messageService";
import MessageController from "../controllers/messageController";
import authenticate from '../middlewares/userAuthMiddleware'


const messageRouter: Router = express.Router()

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);
const controller = new MessageController(messageService);

messageRouter.post('/', authenticate, async (req: Request, res: Response) => controller.sendMessage(req, res))
messageRouter.get('/:chatId', authenticate, async (req: Request, res: Response) => controller.allMessages(req, res));

export default messageRouter;