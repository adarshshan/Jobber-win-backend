import commentModel from "../models/commentModel";
import { v4 as uuidV4 } from 'uuid'

import { ICommentRepository } from "../interfaces/repositoryInterfaces/ICommentRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class CommentRepository implements ICommentRepository {

    async sendComment(postId: string, userId: string, comment: string): Promise<any> {
        try {
            let comments = await commentModel.findOne({ postId: postId });
            if (comments) {
                if (postId && userId && comment) {
                    comments.comments.push({ _id: uuidV4(), text: comment, userId: userId, replies: [], createdAt: new Date() });
                    await comments.save();
                    return comments;
                } else {
                    throw new Error("Missing postId, userId, or comment data.");
                }
            } else {
                comments = new commentModel({
                    postId,
                    comments: [{
                        text: comment,
                        userId,
                        replies: []
                    }]
                });
                await comments.save();
                return comments;
            }
        } catch (error) {
            console.error("Error in sendComment:", error);
            throw new DatabaseError(`Failed to send comment for post ID ${postId} by user ${userId}.`, error as Error);
        }
    }
    async getComment(postId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const comments = await commentModel.findOne({ postId: postId })
                .populate('comments.userId', 'name profile_picture _id')
                .populate('comments.replies.userId', 'name profile_picture _id');
            if (!comments) {
                throw new NotFoundError(`No comments found for post ID ${postId}.`);
            }
            return { success: true, data: comments, message: 'Comments fetched successfully!' };
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getComment:", error);
            throw new DatabaseError(`Failed to retrieve comments for post ID ${postId}.`, error as Error);
        }
    }
    async replyComment(reply: string, commentId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const comment = await commentModel.findOne({ 'comments._id': commentId });
            if (!comment) {
                throw new NotFoundError(`Comment with ID ${commentId} not found.`);
            }

            const commentIndex = comment.comments.findIndex(c => c._id.toString() === commentId);
            if (commentIndex !== -1) {
                comment.comments[commentIndex].replies.push({ text: reply, userId: userId });
                await comment.save();
                return { success: true, data: comment, message: 'Reply added successfully!' };
            } else {
                throw new NotFoundError(`Comment with ID ${commentId} not found within the post.`);
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in replyComment:", error);
            throw new DatabaseError(`Failed to reply to comment ${commentId} by user ${userId}.`, error as Error);
        }
    }

}

export default CommentRepository;