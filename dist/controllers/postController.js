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
class PostController {
    constructor(postServices) {
        this.postServices = postServices;
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, imageUrl, caption } = req.body;
                const result = this.postServices.savePost(userId, imageUrl, caption);
                res.json({ success: true, data: result, message: 'post successfully added...' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Failed to upload the post!' });
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const result = yield this.postServices.getPosts(userId);
                res.json({ success: true, data: result, message: 'Data is Fetched successfully.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Somthing trouble when fetching the data.' });
            }
        });
    }
    getPostForHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getPostForHome();
                res.json({ success: true, data: result, message: 'successfully fetched the post details with user.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'failed to fetch the data' });
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.postServices.likePost(postId, userId);
                    if (result)
                        res.json(result);
                    else
                        res.json({ success: false, message: 'Something went wrong! please try again.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    unLikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.postServices.unLikePost(postId, userId);
                    if (result)
                        res.json(result);
                    else
                        res.json({ success: false, message: 'Something went wrong! please try again.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Inernal server Error occured!' });
            }
        });
    }
    getLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postServices.getLikes(postId);
                if (result)
                    res.json({ success: true, data: result, message: 'success' });
                else
                    res.json({ success: false, message: 'no likes found!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error!' });
            }
        });
    }
    sendComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.userId;
                const { comment } = req.body;
                if (userId) {
                    const result = yield this.postServices.sendComment(postId, userId, comment);
                    if (result)
                        res.json({ success: true, data: result, message: 'Message sent successfully' });
                    else
                        res.json({ success: false, message: 'Something went wrong.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Inernal server Error' });
            }
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postServices.getComment(postId);
                return res.json(result);
            }
            catch (error) {
                console.log(error);
                return res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    replyComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { reply } = req.body;
                const { commentId } = req.params;
                if (userId) {
                    const result = yield this.postServices.replyComment(reply, commentId, userId);
                    if (result)
                        res.json(result);
                    else
                        res.json({ success: false, message: 'something went wrong.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postServices.deletePost(postId);
                if (result)
                    res.json({ success: true, message: 'Post deleted successfully.' });
                else
                    res.json({ success: false, message: 'Something went wrong please try again.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: "Internal server Error occured." });
            }
        });
    }
    updateCaption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caption = req.body.caption;
                const postId = req.params.postId;
                const result = yield this.postServices.updateCaption(caption, postId);
                if (result)
                    res.json({ success: true, message: 'caption successfully updated' });
                else
                    res.json({ success: false, message: 'Something went wrong while updating the post captioin' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server Error occured' });
            }
        });
    }
    postShareSuggestedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.postServices.postShareSuggestedUsers(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Successful' });
                    else
                        res.json({ success: false, message: 'Something went wrong ' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    getSinglePostDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const post = yield this.postServices.getSinglePostDetails(postId);
                const comment = yield this.postServices.getCommentsByPostId(postId);
                const like = yield this.postServices.getLikes(postId);
                if (post)
                    res.json({ success: true, data: { post, comment, like }, message: 'Successful' });
                else
                    res.json({ success: false, message: 'Somethig went wront while fetching the postDetails' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=postController.js.map