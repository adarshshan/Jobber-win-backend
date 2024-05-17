import chatModel from "../models/chatModel";
import messageModel from "../models/messageModel";
import userModel from "../models/userModel";


class MessageRepository {

    async sendMessage(content: string, chatId: string, userId: string) {
        try {
            const newMessage = {
                sender: userId,
                content: content,
                chat: chatId
            };
            let message = await messageModel.create(newMessage);
            console.log(message);
            if (!message._id) {
                throw new Error("Message creation failed");
            }
            message = await message
                .populate("sender", "name pic")
            message = await message
                .populate("chat")

            message = await userModel.populate(message, {
                path: "chat.users",
                select: "name pic email",
            });

            await chatModel.findByIdAndUpdate(chatId, {
                $push: { latestMessages: message._id },
            });

            // res.status(201).json({ message });
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
            console.log(message);
            if (!message._id) {
                throw new Error("Message creation failed");
            }
            message = await message
                .populate("sender", "name pic")
            message = await message
                .populate("chat")
            message = await message.populate('shared_post', 'imageUrl userId');

            message = await userModel.populate(message, {
                path: "chat.users",
                select: "name pic email",
            });

            await chatModel.findByIdAndUpdate(chatId, {
                $push: { latestMessages: message._id },
            });

            // res.status(201).json({ message });
            return message;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default MessageRepository;