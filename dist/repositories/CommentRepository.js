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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const uuid_1 = require("uuid");
class CommentRepository {
    sendComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comments = yield commentModel_1.default.findOne({ postId: postId });
                if (comments) {
                    if (postId && userId && comment) {
                        comments.comments.push({ _id: (0, uuid_1.v4)(), text: comment, userId: userId, replies: [], createdAt: new Date() });
                        yield comments.save();
                        return comments;
                    }
                }
                else {
                    comments = new commentModel_1.default({
                        postId,
                        comments: [{
                                text: comment,
                                userId,
                                replies: []
                            }]
                    });
                    yield comments.save();
                    return comments;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield commentModel_1.default.findOne({ postId: postId })
                    .populate('comments.userId', 'name profile_picture _id')
                    .populate('comments.replies.userId', 'name profile_picture _id');
                if (comments)
                    return { success: true, data: comments, message: 'successful' };
                else
                    return { success: false, message: 'Comments is Empty!' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    replyComment(reply, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield commentModel_1.default.findOne({ 'comments._id': commentId });
                if (!comment)
                    return { success: false, message: 'Comment not found!' };
                const commentIndex = comment.comments.findIndex(comment => comment._id.toString() === commentId);
                if (commentIndex !== -1) {
                    comment === null || comment === void 0 ? void 0 : comment.comments[commentIndex].replies.push({ text: reply, userId: userId });
                    yield comment.save();
                    return { success: true, data: comment, message: 'successful' };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'Internal server error while fetching the data.' };
            }
        });
    }
}
exports.default = CommentRepository;
//# sourceMappingURL=CommentRepository.js.map