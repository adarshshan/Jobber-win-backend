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
class ChatService {
    constructor(chatRepository, userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
    accessChat(userId, current_userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.accessChat(userId, current_userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveChat(chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.chatRepository.saveChat(chatData);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatRepository.getChat(userId);
        });
    }
    createGroupChat(name, users, groupAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.createGroupChat(name, users, groupAdmin);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    renameGroup(chatId, chatName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.chatRepository.renameGroup(chatId, chatName);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addToGroup(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.addToGroup(chatId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeFromGroup(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.removeFromGroup(chatId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllUsers(search, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.userRepository.getAllUsers(search, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ChatService;
//# sourceMappingURL=chatService.js.map