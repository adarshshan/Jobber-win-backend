import { Request, Response } from "express";
import ChatService from "../service/chatService";


class ChatController {
    constructor(private chatService: ChatService) { }

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