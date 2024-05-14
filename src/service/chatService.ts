import ChatRepository from "../repositories/chatRepository";
import UserRepository from "../repositories/userRepository";


class ChatService {
    constructor(private chatRepository: ChatRepository, private userRepository: UserRepository) { }

    async accessChat(userId: string, current_userId: string) {
        try {
            return await this.chatRepository.accessChat(userId, current_userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }) {
        try {
            return this.chatRepository.saveChat(chatData);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getChat(userId: string) {
        return this.chatRepository.getChat(userId);
    }
    async createGroupChat(name: string, users: any, groupAdmin: any) {
        try {
            return await this.chatRepository.createGroupChat(name, users, groupAdmin);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async renameGroup(chatId: string, chatName: string) {
        try {
            return this.chatRepository.renameGroup(chatId, chatName);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addToGroup(chatId: string, userId: string) {
        try {
            return await this.chatRepository.addToGroup(chatId, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeFromGroup(chatId: string, userId: string) {
        try {
            return await this.chatRepository.removeFromGroup(chatId, userId)
        } catch (error) {
            console.log(error as Error)
        }
    }
    async getAllUsers(search: string | undefined, userId: string) {
        try {
            this.userRepository.getAllUsers(search, userId)
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default ChatService;