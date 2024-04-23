import mongoose, { ObjectId } from 'mongoose';
import IPostInterface from '../interfaces/entityInterface/Ipost';
import PostModel from '../models/postModel';


class PostRepository {
    async savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface | null> {
        try {
            console.log(userId, imageUrl, caption);
            console.log('The function is called from the PostRepository...');
            console.log(imageUrl);

            const newPost = new PostModel({
                userId,
                imageUrl,
                caption
            });

            await newPost.save();
            console.log('Data saved in repository', newPost);

            const postObject: IPostInterface = newPost.toObject(); // Convert Mongoose document to plain JavaScript object
            return postObject;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}

export default PostRepository;