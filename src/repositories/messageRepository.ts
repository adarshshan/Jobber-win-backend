import chatModel from "../models/chatModel";
import messageModel from "../models/messageModel";
import { IMessageRepository } from "../interfaces/repositoryInterfaces/IMessageRepository";
import { DatabaseError } from '../utils/errors';

class MessageRepository implements IMessageRepository {

    async sendMessage(sender: string, content: string, chatId: string): Promise<any> {
        try {
            var newMessage = {
                sender: sender,
                content: content,
                chat: chatId,
            };

            var message = await messageModel.create(newMessage);

            message = await message.populate("sender", "name profile_picture");
            message = await message.populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "name profile_picture email"
                }
            });

            await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });

            return message;
        } catch (error) {
            console.error("Error in sendMessage:", error);
            throw new DatabaseError(`Failed to send message in chat ${chatId} by sender ${sender}.`, error as Error);
        }
    }
    async allMessages(chatId: string): Promise<any[]> {
        try {
            const messages = await messageModel.find({ chat: chatId })
                .populate("sender", "name profile_picture email")
                .populate("chat");
            return messages;
        } catch (error) {
            console.error("Error in allMessages:", error);
            throw new DatabaseError(`Failed to retrieve all messages for chat ID ${chatId}.`, error as Error);
        }
    }
    async sharePostMessage(postId: string, chatId: string, userId: string) {
        try {
            const newMessage = {
                sender: userId,
                contentType: 'sharePost',
                shared_post: postId,
                chat: chatId
            };
            let message = await messageModel.create(newMessage);
            if (!message._id) {
                throw new Error("Message creation failed");
            }
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await message.populate('shared_post', 'imageUrl userId');
            message = await message.populate({ path: "chat.users", select: "name pic email" });

            await chatModel.findByIdAndUpdate(chatId, {
                $push: { latestMessages: message._id },
            });
            return message;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async shareVideoLink(chatId: string, shared_link: string, userId: string) {
        try {
            const newMessage = {
                sender: userId,
                contentType: 'videoCall',
                shared_link: shared_link,
                chat: chatId
            };
            let message = await messageModel.create(newMessage);
            if (!message._id) {
                throw new Error("Message creation failed");
            }
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await message.populate({ path: "chat.users", select: "name pic email" });

            await chatModel.findByIdAndUpdate(chatId, {
                $push: { latestMessages: message._id },
            });
            console.log(message); console.log('this isthe  new message......');
            return message;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default MessageRepository;