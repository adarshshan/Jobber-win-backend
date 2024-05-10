import { Date } from "mongoose";
import commentModel from "../models/commentModel";

class CommentRepository {

    async sendComment(postId: string, userId: string, comment: string) {
        try {
            let comments = await commentModel.findOne({ postId: postId });
            if (comments) {
                if (postId && userId && comment) {
                    comments.comments.push({ text: comment, userId: userId, replies: [], createdAt: new Date() })
                    await comments.save();
                    return comments;
                }
            } else {
                comments = new commentModel({
                    postId,
                    comments: [{
                        text: comment,
                        userId,
                        replies: []
                    }]
                })
                await comments.save();
                return comments;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default CommentRepository;