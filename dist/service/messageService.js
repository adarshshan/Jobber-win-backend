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
class MessageService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    sendMessage(content, chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.sendMessage(content, chatId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    allMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.allMessages(chatId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sharePostMessage(postId, chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.sharePostMessage(postId, chatId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    shareVideoLink(chatId, shared_link, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.messageRepository.shareVideoLink(chatId, shared_link, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = MessageService;
//# sourceMappingURL=messageService.js.map