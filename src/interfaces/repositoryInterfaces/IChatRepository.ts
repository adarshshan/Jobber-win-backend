import { Document } from "mongoose";
import { ChatInterface } from "../../models/chatModel"; // Assuming ChatInterface is defined in chatModel.ts

export interface IChatRepository {
    accessChat(userId: string, current_userId: string): Promise<any[] | undefined>; // Return type is complex due to populate, leaving as any for now
    saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }): Promise<(ChatInterface & Document) | undefined>;
    getChat(userId: string): Promise<any[] | undefined>; // Return type is complex due to populate, leaving as any for now
    createGroupChat(name: string, users: any, groupAdmin: any): Promise<(ChatInterface & Document) | undefined>;
    renameGroup(chatId: string, chatName: string): Promise<(ChatInterface & Document) | undefined>;
    addToGroup(chatId: string, userId: string): Promise<(ChatInterface & Document) | undefined>;
    removeFromGroup(chatId: string, userId: string): Promise<(ChatInterface & Document) | undefined>;
    postShareSuggestedUsers(userId: string): Promise<any[] | undefined>; // Return type is complex due to aggregate, leaving as any for now
}