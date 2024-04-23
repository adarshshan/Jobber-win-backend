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
            const result = await this.postServices.getPosts();
            res.json({ success: true, data: result, message: 'Data is Fetched successfully.' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Somthing trouble when fetching the data.' });
        }
    }
}

export default PostController;