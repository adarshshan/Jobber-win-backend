import chatModel from "../models/chatModel";
import messageModel from "../models/messageModel";


import { IMessageRepository } from "../interfaces/repositoryInterfaces/IMessageRepository";

class MessageRepository implements IMessageRepository {

    async sendMessage(content: string, chatId: string, userId: string) {
        const newMessage = {
            sender: userId,
            content: content,
            chat: chatId
        }
        try {
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
            return message;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async allMessages(chatId: string) {
        try {
            const messages = await messageModel.find({ chat: chatId })
                .populate('sender', 'name pic email')
                .populate('chat')
                .populate('shared_post', 'imageUrl userId')
            console.log(messages); console.log('this is the messages...');
            return messages
        } catch (error) {
            console.log(error as Error);
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