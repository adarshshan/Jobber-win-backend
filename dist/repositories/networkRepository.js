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
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = __importDefault(require("../models/postModel"));
const connectionModel_1 = __importDefault(require("../models/connectionModel"));
const ObjectId = mongoose_1.default.Types.ObjectId;
class NetworkRepository {
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ _id: userId });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserPostsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postModel_1.default.find({ userId });
                return posts;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendRequest(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(receiverId) || !mongoose_1.default.Types.ObjectId.isValid(senderId)) {
                    return { success: false, message: 'Receiver or sender id is not valid!' };
                }
                const receiverObjectId = new mongoose_1.default.Types.ObjectId(receiverId);
                const senderObjectId = new mongoose_1.default.Types.ObjectId(senderId);
                let receiver = yield connectionModel_1.default.findOne({ userId: receiverObjectId });
                if (!receiver) {
                    receiver = new connectionModel_1.default({
                        userId: receiverObjectId,
                        friends: [],
                        requestsSend: [],
                        requestsReceived: []
                    });
                    yield receiver.save();
                }
                let sender = yield connectionModel_1.default.findOne({ userId: senderObjectId });
                if (!sender) {
                    sender = new connectionModel_1.default({
                        userId: senderObjectId,
                        friends: [],
                        requestsSend: [],
                        requestsReceived: []
                    });
                    yield sender.save();
                }
                if (!receiver.requestsReceived.includes(senderObjectId))
                    receiver.requestsReceived.push(senderObjectId);
                if (!sender.requestsSend.includes(receiverObjectId))
                    sender.requestsSend.push(receiverObjectId);
                yield receiver.save();
                yield sender.save();
                return { success: true, receiver, sender };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'An error occurred while processing the request.' };
            }
        });
    }
    getAllRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionModel_1.default.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(userId) }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'requestsReceived',
                            foreignField: '_id',
                            as: 'receivedRequests'
                        }
                    },
                    {
                        $unwind: '$receivedRequests'
                    },
                    {
                        $project: {
                            '_id': 0,
                            'receivedRequests.name': 1,
                            'receivedRequests._id': 1,
                            'receivedRequests.profile_picture': 1,
                            'receivedRequests.headLine': 1
                        }
                    }
                ]);
                const receivedRequestsArray = result.map(item => item.receivedRequests);
                return receivedRequestsArray;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addToFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userAId = new mongoose_1.default.Types.ObjectId(userId);
                const userBId = new mongoose_1.default.Types.ObjectId(friendId);
                const user = yield connectionModel_1.default.updateOne({ userId: userAId }, {
                    $pull: { requestsReceived: userBId },
                    $push: { friends: userBId }
                });
                const friend = yield connectionModel_1.default.updateOne({ userId: userBId }, {
                    $pull: { requestsSend: userAId },
                    $push: { friends: userAId }
                });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(userId);
                const data = yield connectionModel_1.default.aggregate([
                    { $match: { userId: id } },
                    { $lookup: { from: 'users', localField: 'friends', foreignField: '_id', as: 'data' } }
                ]);
                if (data)
                    return data[0].data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unFriend(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedConnection = yield connectionModel_1.default.updateOne({ userId }, { $pull: { friends: id } });
                return updatedConnection;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield connectionModel_1.default.updateOne({ userId }, { $pull: { requestsReceived: id } });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllsendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield connectionModel_1.default.findOne({ userId });
                return connection === null || connection === void 0 ? void 0 : connection.requestsSend;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllsendReqDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(userId);
                const requestSendDetails = yield userModel_1.default.aggregate([
                    {
                        $match: { _id: id }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'requestsSend',
                            foreignField: '_id',
                            as: 'requestSendDetails'
                        }
                    }
                ]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    withdrawSentRequest(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield connectionModel_1.default.updateOne({ userId }, { $pull: { requestsSend: id } });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = NetworkRepository;
//# sourceMappingURL=networkRepository.js.map