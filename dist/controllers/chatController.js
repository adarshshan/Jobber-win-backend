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
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    accessChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const current_userId = req.userId;
                if (!userId)
                    return res.json({ success: false, message: 'userId is undefined' });
                if (!current_userId)
                    return res.json({ success: false, message: 'user is not logined' });
                const chat = yield this.chatService.accessChat(userId, current_userId);
                // console.log(chat);
                if (chat.length > 0) {
                    console.log(chat[0]);
                    res.send({ success: true, data: chat[0], message: 'Success' });
                }
                else {
                    var chatData = {
                        chatName: "sender",
                        isGroupChat: false,
                        users: [current_userId, userId]
                    };
                    const FullChat = yield this.chatService.saveChat(chatData);
                    res.json({ success: true, data: FullChat, message: 'Success' });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const chat = yield this.chatService.getChat(userId);
                    if (chat)
                        res.json({ success: true, data: chat, message: 'successful' });
                    else
                        res.json({ success: false, message: 'Somthing went wrong!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'INternal server Error' });
            }
        });
    }
    createGroupchat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, users } = req.body;
                if (!name || !users)
                    return res.json({ success: false, message: 'Please enter the fields' });
                let user = JSON.parse(users);
                if (user.length < 2)
                    return res.json({ success: false, message: 'More than 2 users are required to form a group chat' });
                user.push(req.user);
                const newGroupchat = yield this.chatService.createGroupChat(name, user, req.user);
                if (newGroupchat)
                    res.json({ success: true, data: newGroupchat, message: 'successful' });
                else
                    res.json({ success: false, message: 'Something went  wrong' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error' });
            }
        });
    }
    renameGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, chatName } = req.body;
                const result = this.chatService.renameGroup(chatId, chatName);
                if (!result)
                    res.json({ success: false, message: 'Chat not found!' });
                else
                    res.json({ success: true, data: result, message: 'successful' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error' });
            }
        });
    }
    addToGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, userId } = req.body;
                if (!chatId || !userId)
                    return res.json({ success: false, message: 'please enter the input fields!' });
                const result = yield this.chatService.addToGroup(chatId, userId);
                if (result)
                    res.json({ success: true, data: result, message: 'successful' });
                else
                    res.json({ success: false, message: 'Something went wrong while adding a new user.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server Error' });
            }
        });
    }
    removeFromGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, userId } = req.body;
                const result = yield this.chatService.removeFromGroup(chatId, userId);
                if (result)
                    res.json({ success: true, data: result, message: 'Successful' });
                else
                    res.json({ success: false, message: 'Something went wrong..' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error' });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const search = req.query.search;
                    console.log(search);
                    const result = yield this.chatService.getAllUsers(search, userId);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ChatController;
//# sourceMappingURL=chatController.js.map