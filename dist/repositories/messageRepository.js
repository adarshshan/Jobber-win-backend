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
const chatModel_1 = __importDefault(require("../models/chatModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class MessageRepository {
    sendMessage(content, chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = {
                    sender: userId,
                    content: content,
                    chat: chatId
                };
                let message = yield messageModel_1.default.create(newMessage);
                if (!message._id) {
                    throw new Error("Message creation failed");
                }
                message = yield message
                    .populate("sender", "name pic");
                message = yield message
                    .populate("chat");
                message = yield userModel_1.default.populate(message, {
                    path: "chat.users",
                    select: "name pic email",
                });
                yield chatModel_1.default.findByIdAndUpdate(chatId, {
                    $push: { latestMessages: message._id },
                });
                return message;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    allMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messageModel_1.default.find({ chat: chatId })
                    .populate('sender', 'name pic email')
                    .populate('chat')
                    .populate('shared_post', 'imageUrl userId');
                console.log(messages);
                console.log('this is the messages...');
                return messages;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sharePostMessage(postId, chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = {
                    sender: userId,
                    contentType: 'sharePost',
                    shared_post: postId,
                    chat: chatId
                };
                let message = yield messageModel_1.default.create(newMessage);
                if (!message._id) {
                    throw new Error("Message creation failed");
                }
                message = yield message
                    .populate("sender", "name pic");
                message = yield message
                    .populate("chat");
                message = yield message.populate('shared_post', 'imageUrl userId');
                message = yield userModel_1.default.populate(message, {
                    path: "chat.users",
                    select: "name pic email",
                });
                yield chatModel_1.default.findByIdAndUpdate(chatId, {
                    $push: { latestMessages: message._id },
                });
                return message;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    shareVideoLink(chatId, shared_link, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = {
                    sender: userId,
                    contentType: 'videoCall',
                    shared_link: shared_link,
                    chat: chatId
                };
                let message = yield messageModel_1.default.create(newMessage);
                if (!message._id) {
                    throw new Error("Message creation failed");
                }
                message = yield message
                    .populate("sender", "name pic");
                message = yield message
                    .populate("chat");
                message = yield userModel_1.default.populate(message, {
                    path: "chat.users",
                    select: "name pic email",
                });
                yield chatModel_1.default.findByIdAndUpdate(chatId, {
                    $push: { latestMessages: message._id },
                });
                console.log(message);
                console.log('this isthe  new message......');
                return message;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = MessageRepository;
//# sourceMappingURL=messageRepository.js.map