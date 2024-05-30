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
class NetworkService {
    constructor(networkRepository, userRepository) {
        this.networkRepository = networkRepository;
        this.userRepository = userRepository;
    }
    getAllUsers(search, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllUsers(search, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.getUserProfile(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserPostsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.getUserPostsById(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendRequest(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.sendRequest(receiverId, senderId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.getAllRequests(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addToFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.addToFriend(userId, friendId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.getAllFriends(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unFriend(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.unFriend(id, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.removeRequest(id, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllsendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.getAllsendRequests(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    withdrawSentRequest(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.networkRepository.withdrawSentRequest(userId, id);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = NetworkService;
//# sourceMappingURL=networkService.js.map