import { Request, Response } from 'express';
import PostServices from './../service/postService';


class PostController {
    constructor(private postServices: PostServices) { }

    async savePost(req: Request, res: Response) {
        try {
            const { userId, imageUrl, caption } = req.body;
            const result = this.postServices.savePost(userId, imageUrl, caption);
            res.json({ success: true, data: result, message: 'post successfully added...' });
        } catch (error) {
            console.log(error as Error)
            res.json({ success: false, message: 'Failed to upload the post!' });
        }
    }
    async getPosts(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const result = await this.postServices.getPosts(userId);
            res.json({ success: true, data: result, message: 'Data is Fetched successfully.' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Somthing trouble when fetching the data.' });
        }
    }
    async getPostForHome(req: Request, res: Response) {
        try {
            const result = await this.postServices.getPostForHome();
            res.json({ success: true, data: result, message: 'successfully fetched the post details with user.' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'failed to fetch the data' });
        }
    }
    async likePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.userId;
            if (userId) {
                const result = await this.postServices.likePost(postId, userId);
                if (result) res.json(result);
                else res.json({ success: false, message: 'Something went wrong! please try again.' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async unLikePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.userId;
            if (userId) {
                const result = await this.postServices.unLikePost(postId, userId);
                if (result) res.json(result);
                else res.json({ success: false, message: 'Something went wrong! please try again.' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Inernal server Error occured!' });
        }
    }
    async getLikes(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const result = await this.postServices.getLikes(postId);
            if (result) res.json({ success: true, data: result, message: 'success' });
            else res.json({ success: false, message: 'no likes found!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal server error!' });
        }
    }
}

export default PostController;