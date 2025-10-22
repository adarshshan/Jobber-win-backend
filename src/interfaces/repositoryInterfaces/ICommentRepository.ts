import { Document } from "mongoose";
import { CommentInterface } from "../../models/commentModel"; // Assuming CommentInterface is defined in commentModel.ts

export interface ICommentRepository {
    sendComment(postId: string, userId: string, comment: string): Promise<(CommentInterface & Document) | undefined>;
    getComment(postId: string): Promise<{ success: boolean; data?: (CommentInterface & Document); message: string } | undefined>;
    replyComment(reply: string, commentId: string, userId: string): Promise<{ success: boolean; data?: (CommentInterface & Document); message: string } | undefined>;
}