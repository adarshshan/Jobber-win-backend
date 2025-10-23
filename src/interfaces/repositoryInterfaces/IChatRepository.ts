import { ChatInterface } from "../../models/chatModel";

export interface IChatRepository {
    accessChat(senderId: string, recieverId: string): Promise<ChatInterface>;
    saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }): Promise<ChatInterface>;
    fetchChats(userId: string): Promise<ChatInterface[]>;
    createGroupChat(users: string[], chatName: string, groupAdmin: string): Promise<ChatInterface>;
    renameGroup(chatId: string, chatName: string): Promise<ChatInterface>;
    addToGroup(chatId: string, userId: string): Promise<ChatInterface>;
    removeFromGroup(chatId: string, userId: string): Promise<ChatInterface>;
    postShareSuggestedUsers(userId: string): Promise<any[]>;
}