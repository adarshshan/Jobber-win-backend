import { Request, Response } from "express";
import MessageService from "../service/messageService";


class MessageController {
    constructor(private messageService: MessageService) { }

    async sendMessage(req: Request, res: Response) {
        try {
            const { content, chatId } = req.body;
            const userId = req.userId;
            if (!content || !chatId) {
                console.log('Invalid data passed into request');
                return res.sendStatus(400);
            }
            if (userId) {
                const result = await this.messageService.sendMessage(content, chatId, userId)
                if (result) res.json({ success: true, data: result, message: "successful" });
                else res.json({ success: false, message: 'somthing went wrong' });
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async allMessages(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            const result = await this.messageService.allMessages(chatId);
            if (result) res.json({ success: true, data: result, message: 'successful' });
            else res.json({ success: false, message: 'Somthing went wrong while fetching the data' });
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default MessageController;