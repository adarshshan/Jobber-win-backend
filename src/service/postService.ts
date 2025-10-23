import { IPostRepository } from "../interfaces/repositoryInterfaces/IPostRepository";
import { ICommentRepository } from "../interfaces/repositoryInterfaces/ICommentRepository";
import ChatRepository from '../repositories/chatRepository';
import { NotFoundError, DatabaseError } from '../utils/errors';
import IPostInterface from "../interfaces/entityInterface/Ipost";

class PostServices {
    constructor(private PostRepository: IPostRepository,
        private commentRepository: ICommentRepository,
        private chatRepository: ChatRepository) { }

    async savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface> {
        try {
            const result = await this.PostRepository.savePost(userId, imageUrl, caption);
            return result;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in savePost:", error);
            throw new Error("An unexpected error occurred while saving post."); // Re-throw generic error
        }
    }
    async getPosts(userId: string): Promise<IPostInterface[]> {
        try {
            if (!userId) {
                throw new Error("User ID is required to fetch posts.");
            }
            return await this.PostRepository.getPosts(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getPosts:", error);
            throw new Error("An unexpected error occurred while retrieving posts."); // Re-throw generic error
        }
    }
    async getPostForHome(): Promise<any[]> {
        try {
            const result = await this.PostRepository.getPostForHome();
            return result;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getPostForHome:", error);
            throw new Error("An unexpected error occurred while retrieving posts for home feed."); // Re-throw generic error
        }
    }
    async likePost(postId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            return await this.PostRepository.likePost(postId, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in likePost:", error);
            throw new Error("An unexpected error occurred while liking post."); // Re-throw generic error
        }
    }
    async unLikePost(postId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            return await this.PostRepository.unLikePost(postId, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in unLikePost:", error);
            throw new Error("An unexpected error occurred while unliking post."); // Re-throw generic error
        }
    }
    async getLikes(postId: string): Promise<any> {
        try {
            return await this.PostRepository.getLikes(postId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getLikes:", error);
            throw new Error("An unexpected error occurred while retrieving like details."); // Re-throw generic error
        }
    }
    async sendComment(postId: string, userId: string, comment: string): Promise<any> {
        try {
            return await this.commentRepository.sendComment(postId, userId, comment);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in sendComment:", error);
            throw new Error("An unexpected error occurred while sending comment."); // Re-throw generic error
        }
    }
    async getComment(postId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            return await this.commentRepository.getComment(postId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getComment:", error);
            throw new Error("An unexpected error occurred while retrieving comments."); // Re-throw generic error
        }
    }
    async replyComment(reply: string, commentId: string, userId: string): Promise<any> {
        try {
            return await this.commentRepository.replyComment(reply, commentId, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in replyComment:", error);
            throw new Error("An unexpected error occurred while replying to comment."); // Re-throw generic error
        }
    }
    async deletePost(postId: string): Promise<IPostInterface> {
        try {
            return await this.PostRepository.deletePost(postId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deletePost:", error);
            throw new Error("An unexpected error occurred while deleting post."); // Re-throw generic error
        }
    }
    async updateCaption(caption: string, postId: string): Promise<IPostInterface> {
        try {
            return await this.PostRepository.updateCaption(caption, postId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in updateCaption:", error);
            throw new Error("An unexpected error occurred while updating caption."); // Re-throw generic error
        }
    }
    async postShareSuggestedUsers(userId: string): Promise<any[]> {
        try {
            return await this.chatRepository.postShareSuggestedUsers(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in postShareSuggestedUsers:", error);
            throw new Error("An unexpected error occurred while retrieving suggested users for post share."); // Re-throw generic error
        }
    }
    async getSinglePostDetails(postId: string): Promise<IPostInterface> {
        try {
            return await this.PostRepository.getSinglePostDetails(postId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getSinglePostDetails:", error);
            throw new Error("An unexpected error occurred while retrieving single post details."); // Re-throw generic error
        }
    }
    async getCommentsByPostId(postId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            return await this.commentRepository.getComment(postId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getCommentsByPostId:", error);
            throw new Error("An unexpected error occurred while retrieving comments by post ID."); // Re-throw generic error
        }
    }

}

export default PostServices;