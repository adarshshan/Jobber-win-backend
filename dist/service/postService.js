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
class PostServices {
    constructor(PostRepository, commentRepository, chatRepository) {
        this.PostRepository = PostRepository;
        this.commentRepository = commentRepository;
        this.chatRepository = chatRepository;
    }
    savePost(userId, imageUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRepository.savePost(userId, imageUrl, caption);
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userId)
                    return yield this.PostRepository.getPosts(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPostForHome() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.PostRepository.getPostForHome();
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.likePost(postId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unLikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.unLikePost(postId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.getLikes(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.commentRepository.sendComment(postId, userId, comment);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.commentRepository.getComment(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    replyComment(reply, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.commentRepository.replyComment(reply, commentId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.deletePost(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateCaption(caption, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.updateCaption(caption, postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    postShareSuggestedUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.postShareSuggestedUsers(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSinglePostDetails(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.PostRepository.getSinglePostDetails(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.commentRepository.getComment(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = PostServices;
//# sourceMappingURL=postService.js.map