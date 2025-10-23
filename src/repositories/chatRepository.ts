import mongoose from "mongoose";
import chatModel, { ChatInterface } from "../models/chatModel";


import { IChatRepository } from "../interfaces/repositoryInterfaces/IChatRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class ChatRepository implements IChatRepository {

    async accessChat(senderId: string, recieverId: string): Promise<ChatInterface> {
        try {
            let chat = await chatModel.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: senderId } } },
                    { users: { $elemMatch: { $eq: recieverId } } },
                ],
            })
                .populate("users", "-password")
                .populate({
                    path: "latestMessage",
                    populate: {
                        path: "sender",
                        select: "name profile_picture email",
                    },
                });

            if (chat.length > 0) {
                return chat[0] as ChatInterface;
            } else {
                const chatData = {
                    chatName: "sender",
                    isGroupChat: false,
                    users: [senderId, recieverId],
                };

                const createdChat = await chatModel.create(chatData);
                const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );
                if (!FullChat) {
                    throw new DatabaseError("Failed to retrieve full chat after creation.");
                }
                return FullChat as ChatInterface;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in accessChat:", error);
            throw new DatabaseError(`Failed to access chat between ${senderId} and ${recieverId}.`, error as Error);
        }
    }
    async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }): Promise<ChatInterface> {
        try {
            const createdChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            if (!FullChat) {
                throw new DatabaseError("Failed to retrieve full chat after creation.");
            }
            return FullChat as ChatInterface;
        } catch (error) {
            console.error("Error in saveChat:", error);
            throw new DatabaseError(`Failed to save chat "${chatData.chatName}".`, error as Error);
        }
    }
    async fetchChats(userId: string): Promise<ChatInterface[]> {
        try {
            let results = await chatModel.find({ users: { $elemMatch: { $eq: userId } } })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate({
                    path: "latestMessage",
                    populate: {
                        path: "sender",
                        select: "name profile_picture email",
                    },
                })
                .sort({ updatedAt: -1 });

            return results as ChatInterface[];
        } catch (error) {
            console.error("Error in fetchChats:", error);
            throw new DatabaseError(`Failed to fetch chats for user ID ${userId}.`, error as Error);
        }
    }
    async createGroupChat(users: string[], chatName: string, groupAdmin: string): Promise<ChatInterface> {
        try {
            const chatData = {
                chatName: chatName,
                isGroupChat: true,
                users: users,
                groupAdmin: groupAdmin,
            };
            const createdChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createdChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
            if (!FullChat) {
                throw new DatabaseError("Failed to retrieve full chat after creation.");
            }
            return FullChat as ChatInterface;
        } catch (error) {
            console.error("Error in createGroupChat:", error);
            throw new DatabaseError(`Failed to create group chat "${chatName}".`, error as Error);
        }
    }
    async renameGroup(chatId: string, chatName: string): Promise<ChatInterface> {
        try {
            const updatedChat = await chatModel.findByIdAndUpdate(
                chatId,
                {
                    chatName: chatName,
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!updatedChat) {
                throw new NotFoundError(`Chat with ID ${chatId} not found for renaming.`);
            }
            return updatedChat as ChatInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in renameGroup:", error);
            throw new DatabaseError(`Failed to rename group chat with ID ${chatId}.`, error as Error);
        }
    }
    async addToGroup(chatId: string, userId: string): Promise<ChatInterface> {
        try {
            const added = await chatModel.findByIdAndUpdate(
                chatId,
                {
                    $push: { users: userId },
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!added) {
                throw new NotFoundError(`Chat with ID ${chatId} not found for adding user.`);
            }
            return added as ChatInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in addToGroup:", error);
            throw new DatabaseError(`Failed to add user ${userId} to group chat ${chatId}.`, error as Error);
        }
    }
    async removeFromGroup(chatId: string, userId: string): Promise<ChatInterface> {
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

            if (!removed) {
                throw new NotFoundError(`Chat with ID ${chatId} not found for removing user.`);
            }
            return removed as ChatInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in removeFromGroup:", error);
            throw new DatabaseError(`Failed to remove user ${userId} from group chat ${chatId}.`, error as Error);
        }
    }
    async postShareSuggestedUsers(userId: string): Promise<any[]> {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const UserId = new ObjectId(userId);

            const users = await chatModel.aggregate([
                { $match: { isGroupChat: false } },
                { $match: { users: UserId } },
                { $project: { otherUserID: { $setDifference: ["$users", [UserId]] } } },
                {
                    $lookup: {
                        from: "users",
                        localField: "otherUserID",
                        foreignField: "_id",
                        as: "otherUserDetails"
                    }
                },
                {
                    $project: {
                        "_id": { $arrayElemAt: ["$otherUserDetails._id", 0] },
                        "name": { $arrayElemAt: ["$otherUserDetails.name", 0] },
                        "profile_picture": { $arrayElemAt: ["$otherUserDetails.profile_picture", 0] },
                        "headline": { $arrayElemAt: ["$otherUserDetails.headLine", 0] }
                    }
                }
            ]);
            return users;
        } catch (error) {
            console.error("Error in postShareSuggestedUsers:", error);
            throw new DatabaseError(`Failed to retrieve suggested users for post share for user ID ${userId}.`, error as Error);
        }
    }
}

export default ChatRepository;