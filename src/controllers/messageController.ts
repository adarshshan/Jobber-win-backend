import { Request, Response } from "express";
import MessageService from "../service/messageService";
import { DatabaseError } from '../utils/errors';


class MessageController {
    constructor(private messageService: MessageService) { }

    async sendMessage(req: Request, res: Response) {
        try {
            const { content, chatId } = req.body;
            const userId = req.userId;
            if (!content || !chatId) {
                console.log('Invalid data passed into request');
                return res.status(400).json({ success: false, message: 'Invalid data passed into request.' });
            }
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.messageService.sendMessage(content, chatId, userId);
            res.json({ success: true, data: result, message: "Message sent successfully." });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in sendMessage controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while sending message.' });
            } else if (error instanceof Error) {
                console.error("Error in sendMessage controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while sending message.' });
            } else {
                console.error("Unexpected error in sendMessage controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while sending message.' });
            }
        }
    }
    async allMessages(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            const result = await this.messageService.allMessages(chatId);
            res.json({ success: true, data: result, message: 'Messages fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in allMessages controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching messages.' });
            } else if (error instanceof Error) {
                console.error("Error in allMessages controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching messages.' });
            } else {
                console.error("Unexpected error in allMessages controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching messages.' });
            }
        }
    }


}

export default MessageController;