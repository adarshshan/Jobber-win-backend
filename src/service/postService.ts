import { ObjectId } from 'mongoose';
import PostRepository from './../repositories/postRepository';

class PostServices {
    constructor(private PostRepository: PostRepository) { }

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
    async getLikes(postId: string) {
        try {
            return await this.PostRepository.getLikes(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default PostServices;