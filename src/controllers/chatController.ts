import { Request, Response } from "express";
import ChatService from "../service/chatService";


class ChatController {
    constructor(private chatService: ChatService) { }

    async accessChat(req: Request, res: Response) {
        try {
            const { userId } = req.body
            const current_userId = req.userId;

            if (!userId) return res.json({ success: false, message: 'userId is undefined' })
            if (!current_userId) return res.json({ success: false, message: 'user is not logined' })

            const chat = await this.chatService.accessChat(userId, current_userId);
            console.log(chat);

            if (chat.length > 0) {
                console.log('Its founding here........');
                console.log(chat[0]);
                res.send({ success: true, data: chat[0], message: 'Success' });
            } else {
                var chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [current_userId, userId]
                }
                const FullChat = await this.chatService.saveChat(chatData);
                res.json({ success: true, data: FullChat, message: 'Success' });
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
                if (chat) res.json({ success: true, data: chat, message: 'successful' });
                else res.json({ success: false, message: 'Somthing went wrong!' })
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'INternal server Error' });
        }
    }
    async createGroupchat(req: Request, res: Response) {
        try {
            let { name, users } = req.body;
            if (!name || !users) return res.json({ success: false, message: 'Please enter the fields' });

            let user = JSON.parse(users);
            if (user.length < 2) return res.json({ success: false, message: 'More than 2 users are required to form a group chat' });
            user.push(req.user);

            const newGroupchat = await this.chatService.createGroupChat(name, user, req.user);
            if (newGroupchat) res.json({ success: true, data: newGroupchat, message: 'successful' });
            else res.json({ success: false, message: 'Something went  wrong' });
        } catch (error) {
            console.log(error as Error)
            res.json({ success: false, message: 'Internal server error' });
        }
    }
    async renameGroup(req: Request, res: Response) {
        try {
            const { chatId, chatName } = req.body;
            const result = this.chatService.renameGroup(chatId, chatName);
            if (!result) res.json({ success: false, message: 'Chat not found!' })
            else res.json({ success: true, data: result, message: 'successful' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error' });
        }
    }
    async addToGroup(req: Request, res: Response) {
        try {
            const { chatId, userId } = req.body;
            if (!chatId || !userId) return res.json({ success: false, message: 'please enter the input fields!' });
            const result = await this.chatService.addToGroup(chatId, userId);
            if (result) res.json({ success: true, data: result, message: 'successful' });
            else res.json({ success: false, message: 'Something went wrong while adding a new user.' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal server Error' });
        }
    }
    async removeFromGroup(req: Request, res: Response) {
        try {
            const { chatId, userId } = req.body;
            const result = await this.chatService.removeFromGroup(chatId, userId);
            if (result) res.json({ success: true, data: result, message: 'Successful' });
            else res.json({ success: false, message: 'Something went wrong..' });
        } catch (error) {
            console.log(error as Error)
            res.json({ success: false, message: 'internal server error' });
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