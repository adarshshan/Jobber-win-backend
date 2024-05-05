import { Request, Response } from "express";
import ChatService from "../service/chatService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import chatModel from "../models/chatModel";
import userModel from "../models/userModel";


class ChatController {
    constructor(private chatService: ChatService) { }

    async accessChat(req: Request, res: Response) {
        try {
            const { userId } = req.body
            const current_userId = req.userId;
            if (!userId) {
                console.log('userid param is not send with the request...');
                return res.sendStatus(400);
            }
            if (!current_userId) {
                console.log('the user is not authenticated...');
                return res.sendStatus(400);
            }
            const chat = await this.chatService.accessChat(userId, current_userId);
            console.log(chat);
            if (chat.length > 0) {
                res.send(chat[0]);
            } else {
                var chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [current_userId, userId]
                }
                const FullChat = await this.chatService.saveChat(chatData);
                res.status(STATUS_CODES.OK).json(FullChat);
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async fetchChats(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const chat = await this.chatService.getChat(userId);
                res.status(STATUS_CODES.OK).json(chat);
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async createGroupchat(req: Request, res: Response) {
        try {
            let { name, users } = req.body;
            if (!name || !users) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Please enter the fields' });

            let user = JSON.parse(users);
            if (user.length < 2) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'More than 2 users are required to form a group chat' });
            user.push(req.user);

            const newGroupchat = this.chatService.createGroupChat(name, user, req.user);
            if (newGroupchat) res.status(STATUS_CODES.OK).json(newGroupchat);
        } catch (error) {
            console.log(error as Error)
        }
    }
    async renameGroup(req: Request, res: Response) {
        try {
            const { chatId, chatName } = req.body;
            const result = this.chatService.renameGroup(chatId, chatName);
            if (!result) res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Chat not found!' })
            else res.status(STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addToGroup(req: Request, res: Response) {
        try {
            const { chatId, userId } = req.body;
            if (!chatId || !userId) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'please enter the input fields!' });
            const result = await this.chatService.addToGroup(chatId, userId);
            if (result) res.status(STATUS_CODES.OK).json(result);
            else res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Something went wrong while adding a new user.' });
        } catch (error) {
            console.log(error as Error);
        }
    }

    async sendMessage(req: Request, res: Response) {
        try {

        } catch (error) {
            console.log(error as Error);
        }
    }
    async allMessages(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            console.log(`this chat id is ${chatId}`)
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllUsers(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const search: any = req.query.search
                console.log(search);
                const result = await this.chatService.getAllUsers(search, userId)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default ChatController;