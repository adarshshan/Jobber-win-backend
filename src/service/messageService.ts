import { IMessageRepository } from "../interfaces/repositoryInterfaces/IMessageRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class MessageService {
    constructor(private messageRepository: IMessageRepository) { }

    async sendMessage(content: string, chatId: string, userId: string): Promise<any> {
        try {
            return await this.messageRepository.sendMessage(userId, content, chatId); // Corrected order of arguments
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in sendMessage:", error);
            throw new Error("An unexpected error occurred while sending message."); // Re-throw generic error
        }
    }
    async allMessages(chatId: string): Promise<any[]> {
        try {
            return await this.messageRepository.allMessages(chatId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in allMessages:", error);
            throw new Error("An unexpected error occurred while retrieving all messages."); // Re-throw generic error
        }
    }


}

export default MessageService;