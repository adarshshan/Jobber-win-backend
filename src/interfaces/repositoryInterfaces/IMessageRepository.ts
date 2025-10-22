import { Document } from "mongoose";
import { MessageInterface } from "../../models/messageModel";

export interface IMessageRepository {
    sendMessage(content: string, chatId: string, userId: string): Promise<(MessageInterface & Document) | undefined>;
    allMessages(chatId: string): Promise<(MessageInterface & Document)[] | undefined>;
    sharePostMessage(postId: string, chatId: string, userId: string): Promise<(MessageInterface & Document) | undefined>;
    shareVideoLink(chatId: string, shared_link: string, userId: string): Promise<(MessageInterface & Document) | undefined>;
}