import commentModel from "../models/commentModel";
import { v4 as uuidV4 } from 'uuid'

class CommentRepository {

    async sendComment(postId: string, userId: string, comment: string) {
        try {
            let comments = await commentModel.findOne({ postId: postId });
            if (comments) {
                if (postId && userId && comment) {

                    comments.comments.push({ _id: uuidV4(), text: comment, userId: userId, replies: [], createdAt: new Date() })
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
    async getComment(postId: string) {
        try {
            const comments = await commentModel.findOne({ postId: postId })
                .populate('comments.userId', 'name profile_picture _id')
                .populate('comments.replies.userId', 'name profile_picture _id')
            if (comments) return { success: true, data: comments, message: 'successful' };
            else return { success: false, message: 'Comments is Empty!' }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async replyComment(reply: string, commentId: string, userId: string) {
        try {
            const comment = await commentModel.findOne({ 'comments._id': commentId });
            if (!comment) return { success: false, message: 'Comment not found!' }

            const commentIndex = comment.comments.findIndex(comment => comment._id.toString() === commentId);
            if (commentIndex !== -1) {
                comment?.comments[commentIndex].replies.push({ text: reply, userId: userId });
                await comment.save();
                return { success: true, data: comment, message: 'successful' }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: 'Internal server error while fetching the data.' }
        }
    }
}

export default CommentRepository;