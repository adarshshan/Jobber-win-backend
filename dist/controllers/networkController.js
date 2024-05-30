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
class NetworkController {
    constructor(networkService) {
        this.networkService = networkService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search;
                if (req.userId) {
                    const result = yield this.networkService.getAllUsers(search, req.userId);
                    res.json({ success: true, data: result, message: 'Data Fetched Successfully' });
                }
                else
                    res.json({ success: false, message: 'Failed to fetch the details' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'somthing went wrong while fetching data' });
            }
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const result = yield this.networkService.getUserProfile(userId);
                if (result)
                    res.json({ success: true, data: result, message: 'Data fetched successfully' });
                else
                    res.json({ success: false, message: 'somthing went wrong while fetching the profile details of the user' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    getUserPostsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.networkService.getUserPostsById(req.params.userId);
                if (result)
                    res.json({ success: true, data: result, message: 'postData fetched successfully' });
                else
                    res.json({ success: false, message: 'failed to fetch the posts' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    sendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId } = req.body;
                const senderId = req.userId;
                if (senderId) {
                    const result = yield this.networkService.sendRequest(receiverId, senderId);
                    if (result)
                        res.json({ success: true, data: result.sender, message: 'request has been sent.' });
                    else
                        res.json({ success: false, message: 'somthing went wrong while sending the send request.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getAllRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.getAllRequests(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'request data fetched successfully.' });
                    else
                        res.json({ success: false, message: 'Somthing went wrong while fetching data.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal Error' });
            }
        });
    }
    addToFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { friendId } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.addToFriend(userId, friendId);
                    if (result)
                        res.json({ success: true, data: result, message: 'user added to the friend list.' });
                    else
                        res.json({ success: false, message: 'Somthing went wrong while adding user to the friend list.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal Error occured' });
            }
        });
    }
    getAllFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.getAllFriends(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Friend list fetched.' });
                    else
                        res.json({ success: false, message: 'Failed To fetch the friend list!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal Error' });
            }
        });
    }
    unFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.unFriend(id, userId);
                    if (result)
                        res.json({ success: true, message: 'successfull' });
                    else
                        res.json({ success: false, message: 'somthing went wrong while unfriend' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: "Internal error" });
            }
        });
    }
    removeRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.removeRequest(id, userId);
                    if (result)
                        res.json({ success: true, message: 'user Removed from the request list.' });
                    else
                        res.json({ success: false, message: 'somthing went wrong while removing the user from the list!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getAllsendRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.networkService.getAllsendRequests(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'successful' });
                    else
                        res.json({ success: false, message: 'somthing went wrong while fetching the sendrequestes!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error!' });
            }
        });
    }
    withdrawSentRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { id } = req.params;
                if (userId) {
                    const result = yield this.networkService.withdrawSentRequest(userId, id);
                    if (result)
                        res.json({ success: true, message: 'successfully withdraw the request.' });
                    else
                        res.json({ success: false, message: 'somthing went while withdrawing the request!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal Error occured!' });
            }
        });
    }
}
exports.default = NetworkController;
//# sourceMappingURL=networkController.js.map