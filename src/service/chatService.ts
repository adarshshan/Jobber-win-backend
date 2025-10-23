import { IChatRepository } from "../interfaces/repositoryInterfaces/IChatRepository";
import { ChatInterface } from "../models/chatModel";
import { UserInterface } from "../interfaces/entityInterface/Iuser";
import UserRepository from "../repositories/userRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';


class ChatService {
    constructor(private chatRepository: IChatRepository, private userRepository: UserRepository) { }

    async accessChat(userId: string, current_userId: string): Promise<ChatInterface> {
        try {
            return await this.chatRepository.accessChat(userId, current_userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in accessChat:", error);
            throw new Error("An unexpected error occurred while accessing chat."); // Re-throw generic error
        }
    }

    async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }): Promise<ChatInterface> {
        try {
            return await this.chatRepository.saveChat(chatData);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in saveChat:", error);
            throw new Error("An unexpected error occurred while saving chat."); // Re-throw generic error
        }
    }


    async fetchChats(userId: string): Promise<ChatInterface[]> {
        try {
            return await this.chatRepository.fetchChats(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in fetchChats:", error);
            throw new Error("An unexpected error occurred while fetching chats."); // Re-throw generic error
        }
    }

    async createGroupChat(name: string, users: string[], groupAdmin: string): Promise<ChatInterface> {
        try {
            return await this.chatRepository.createGroupChat(users, name, groupAdmin);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in createGroupChat:", error);
            throw new Error("An unexpected error occurred while creating group chat."); // Re-throw generic error
        }
    }
    async renameGroup(chatId: string, chatName: string): Promise<ChatInterface> {
        try {
            return await this.chatRepository.renameGroup(chatId, chatName);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in renameGroup:", error);
            throw new Error("An unexpected error occurred while renaming group chat."); // Re-throw generic error
        }
    }
    async addToGroup(chatId: string, userId: string): Promise<ChatInterface> {
        try {
            return await this.chatRepository.addToGroup(chatId, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in addToGroup:", error);
            throw new Error("An unexpected error occurred while adding user to group chat."); // Re-throw generic error
        }
    }
    async removeFromGroup(chatId: string, userId: string): Promise<ChatInterface> {
        try {
            return await this.chatRepository.removeFromGroup(chatId, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in removeFromGroup:", error);
            throw new Error("An unexpected error occurred while removing user from group chat."); // Re-throw generic error
        }
    }
    async postShareSuggestedUsers(userId: string): Promise<any[]> {
        try {
            return await this.chatRepository.postShareSuggestedUsers(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in postShareSuggestedUsers:", error);
            throw new Error("An unexpected error occurred while retrieving suggested users for post share."); // Re-throw generic error
        }
    }

    async getAllUsers(search: string | undefined, userId: string): Promise<UserInterface[]> {
        try {
            return await this.userRepository.getAllUsers(search, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllUsers:", error);
            throw new Error("An unexpected error occurred while retrieving all users."); // Re-throw generic error
        }
    }
}

export default ChatService;