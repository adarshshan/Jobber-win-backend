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
class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, chatId } = req.body;
                const userId = req.userId;
                if (!content || !chatId) {
                    console.log('Invalid data passed into request');
                    return res.sendStatus(400);
                }
                if (userId) {
                    const result = yield this.messageService.sendMessage(content, chatId, userId);
                    if (result)
                        res.json({ success: true, data: result, message: "successful" });
                    else
                        res.json({ success: false, message: 'somthing went wrong' });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    allMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                const result = yield this.messageService.allMessages(chatId);
                if (result)
                    res.json({ success: true, data: result, message: 'successful' });
                else
                    res.json({ success: false, message: 'Somthing went wrong while fetching the data' });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sharePostMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, chatId } = req.body;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.messageService.sharePostMessage(postId, chatId, userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'post shared success' });
                    else
                        res.json({ success: false, message: 'Something went wrong while sharing the post' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    shareVideoLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('hey reached here....');
                const { chatId, shared_link } = req.body;
                console.log(chatId, shared_link);
                const userId = req.userId;
                if (userId) {
                    const result = yield this.messageService.shareVideoLink(chatId, shared_link, userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Video link shared successfully' });
                    else
                        res.json({ success: false, message: 'Something went wrong while sending the video link' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
}
exports.default = MessageController;
//# sourceMappingURL=messageController.js.map