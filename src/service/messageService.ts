import { IMessageRepository } from "../interfaces/repositoryInterfaces/IMessageRepository";

class MessageService {
    constructor(private messageRepository: IMessageRepository) { }

    async sendMessage(content: string, chatId: string, userId: string) {
        try {
            return await this.messageRepository.sendMessage(content, chatId, userId)
        } catch (error) {
            console.log(error as Error);
        }
    }
    async allMessages(chatId: string) {
        try {
            return await this.messageRepository.allMessages(chatId)
        } catch (error) {
            console.log(error as Error);
        }
    }
    async sharePostMessage(postId: string, chatId: string, userId: string) {
        try {
            return await this.messageRepository.sharePostMessage(postId, chatId, userId);
        } catch (error) {
            console.log(error as Error)
        }
    }
    async shareVideoLink(chatId: string, shared_link: string, userId: string) {
        try {
            return await this.messageRepository.shareVideoLink(chatId, shared_link, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default MessageService;