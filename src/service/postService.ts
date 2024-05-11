import { ObjectId } from 'mongoose';
import PostRepository from './../repositories/postRepository';
import CommentRepository from '../repositories/CommentRepository';

class PostServices {
    constructor(private PostRepository: PostRepository, private commentRepository: CommentRepository) { }

    async savePost(userId: string, imageUrl: string, caption: string) {
        try {
            const result = await this.PostRepository.savePost(userId, imageUrl, caption);
            return result;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getPosts(userId: string) {
        try {
            if (userId) return await this.PostRepository.getPosts(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getPostForHome() {
        try {
            const result = await this.PostRepository.getPostForHome();
            return result;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async likePost(postId: string, userId: string) {
        try {
            return await this.PostRepository.likePost(postId, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async unLikePost(postId: string, userId: string) {
        try {
            return await this.PostRepository.unLikePost(postId, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getLikes(postId: string) {
        try {
            return await this.PostRepository.getLikes(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async sendComment(postId: string, userId: string, comment: string) {
        try {
            return await this.commentRepository.sendComment(postId, userId, comment)
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getComment(postId: string) {
        try {
            return await this.commentRepository.getComment(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async replyComment(reply: string, commentId: string, userId: string) {
        try {
            return await this.commentRepository.replyComment(reply, commentId, userId)
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default PostServices;