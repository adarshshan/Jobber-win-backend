import { ObjectId } from 'mongoose';
import { IPostRepository } from "../interfaces/repositoryInterfaces/IPostRepository";
import PostRepository from './../repositories/postRepository';
import { ICommentRepository } from "../interfaces/repositoryInterfaces/ICommentRepository";
import CommentRepository from '../repositories/CommentRepository';
import ChatRepository from '../repositories/chatRepository';
import { IMessageRepository } from "../interfaces/repositoryInterfaces/IMessageRepository";
import MessageRepository from '../repositories/messageRepository';

class PostServices {
    constructor(private PostRepository: IPostRepository,
        private commentRepository: ICommentRepository,
        private chatRepository: ChatRepository) { }

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
    async deletePost(postId: string) {
        try {
            return await this.PostRepository.deletePost(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async updateCaption(caption: string, postId: string) {
        try {
            return await this.PostRepository.updateCaption(caption, postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postShareSuggestedUsers(userId: string) {
        try {
            return await this.chatRepository.postShareSuggestedUsers(userId);
        } catch (error) {
            console.log(error as Error)
        }
    }
    async getSinglePostDetails(postId: string) {
        try {
            return await this.PostRepository.getSinglePostDetails(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getCommentsByPostId(postId: string) {
        try {
            return await this.commentRepository.getComment(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }

}

export default PostServices;