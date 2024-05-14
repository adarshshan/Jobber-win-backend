import chatModel from "../models/chatModel";
import userModel from "../models/userModel";


class ChatRepository {

    async accessChat(userId: string, current_userId: string) {
        try {
            var isChat: any = await chatModel.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: current_userId } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            })
                .populate("users", "-password")
                .populate("latestMessage");

            isChat = await userModel.populate(isChat, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            return isChat;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }) {
        try {
            const createdChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            return FullChat;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getChat(userId: string) {
        try {
            let result;
            const chat = await chatModel.find({ users: { $elemMatch: { $eq: userId } } })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                .sort({ updatedAt: -1 })
            if (chat) {
                result = await userModel.populate(chat, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                })
                return result;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async createGroupChat(name: string, users: any, groupAdmin: any) {
        try {
            const groupChat = await chatModel.create({
                chatName: name,
                users,
                isGroupChat: true,
                groupAdmin
            });

            const fullGroupChat = await chatModel.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            return fullGroupChat;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async renameGroup(chatId: string, chatName: string) {
        try {
            const updatedchat = await chatModel.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            return updatedchat;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addToGroup(chatId: string, userId: string) {
        try {
            const added = await chatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            return added;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeFromGroup(chatId: string, userId: string) {
        try {
            const removed = await chatModel.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: userId },
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            return removed;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default ChatRepository;