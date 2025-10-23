
export interface ICommentRepository {
    sendComment(postId: string, userId: string, comment: string): Promise<any>;
    getComment(postId: string): Promise<{ success: boolean; data?: any; message: string }>;
    replyComment(reply: string, commentId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }>;
}