"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class ChatRepository {
    accessChat(userId, current_userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var isChat = yield chatModel_1.default.find({
                    isGroupChat: false,
                    $and: [
                        { users: { $elemMatch: { $eq: current_userId } } },
                        { users: { $elemMatch: { $eq: userId } } },
                    ],
                })
                    .populate("users", "-password")
                    .populate("latestMessage");
                isChat = yield userModel_1.default.populate(isChat, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                return isChat;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveChat(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdChat = yield chatModel_1.default.create(chatData);
                const FullChat = yield chatModel_1.default.findOne({ _id: createdChat._id }).populate("users", "-password");
                return FullChat;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const chat = yield chatModel_1.default.find({ users: { $elemMatch: { $eq: userId } } })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                if (chat) {
                    result = yield userModel_1.default.populate(chat, {
                        path: "latestMessage.sender",
                        select: "name pic email",
                    });
                    return result;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createGroupChat(name, users, groupAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groupChat = yield chatModel_1.default.create({
                    chatName: name,
                    users,
                    isGroupChat: true,
                    groupAdmin
                });
                const fullGroupChat = yield chatModel_1.default.findOne({ _id: groupChat._id })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                return fullGroupChat;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    renameGroup(chatId, chatName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedchat = yield chatModel_1.default.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
                    .populate('users', '-password')
                    .populate('groupAdmin', '-password');
                return updatedchat;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addToGroup(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const added = yield chatModel_1.default.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                return added;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeFromGroup(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removed = yield chatModel_1.default.findByIdAndUpdate(chatId, {
                    $pull: { users: userId },
                }, {
                    new: true,
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                return removed;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    postShareSuggestedUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ObjectId = mongoose_1.default.Types.ObjectId;
                const UserId = new ObjectId(userId);
                const users = yield chatModel_1.default.aggregate([
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
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ChatRepository;
//# sourceMappingURL=chatRepository.js.map