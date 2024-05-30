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
const postModel_1 = __importDefault(require("../models/postModel"));
const likeModel_1 = __importDefault(require("../models/likeModel"));
class PostRepository {
    savePost(userId, imageUrl, caption) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = new postModel_1.default({
                    userId,
                    imageUrl,
                    caption
                });
                yield newPost.save();
                const postObject = newPost.toObject();
                return postObject;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield postModel_1.default.find({ userId }).sort({ createdAt: -1 });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPostForHome() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = postModel_1.default.aggregate([
                    { $match: { isReported: false } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: "userId",
                            foreignField: "_id",
                            as: "result"
                        }
                    }
                ]).sort({ createdAt: -1 });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const liked = yield likeModel_1.default.findOne({ postId: postId });
                if (!liked) {
                    const newLike = new likeModel_1.default({ postId: postId, likedUsers: [{ userId: userId }] });
                    yield newLike.save();
                    return { success: true, data: newLike, message: 'successfully liked the post' };
                }
                else {
                    const userIdExists = liked.likedUsers.some(user => user.userId === userId);
                    if (!userIdExists) {
                        const likee = yield likeModel_1.default.findOneAndUpdate({ postId: postId }, { $addToSet: { likedUsers: { userId: userId } } }, { new: true });
                        if (likee) {
                            likee.likeCount = likee.likedUsers.length;
                            yield likee.save();
                            return { success: true, data: likee, message: 'user liked successfully!' };
                        }
                    }
                    else {
                        return { success: false, message: 'user liked already!' };
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unLikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likee = yield likeModel_1.default.findOneAndUpdate({ postId: postId }, { $pull: { likedUsers: { userId: userId } } }, { new: true });
                if (likee) {
                    likee.likeCount = likee.likedUsers.length;
                    yield likee.save();
                    return { success: true, data: likee, message: 'unlike success!' };
                }
                else
                    return { success: false, message: 'somthing went wrong!' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likeDetails = yield likeModel_1.default.findOne({ postId: postId }).populate('likedUsers.userId');
                return likeDetails;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId);
                if (post) {
                    post.isDeleted = true;
                    yield post.save();
                    return post;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateCaption(caption, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId);
                if (post) {
                    post.caption = caption;
                    yield post.save();
                    return post;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSinglePostDetails(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId).populate('userId', 'name profile_picture headLine');
                return post;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePostReportStatus(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId);
                if (post) {
                    post.isReported = true;
                    yield post.save();
                    return post;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = PostRepository;
//# sourceMappingURL=postRepository.js.map