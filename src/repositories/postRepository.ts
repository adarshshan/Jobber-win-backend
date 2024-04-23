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
    async getPosts() {
        try {
            console.log('Yess, reached at the end and your id is ')
            const data = await PostModel.find();
            console.log(data); console.log('this is your all data..');
            return data;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getPostForHome() {
        try {
            const data = PostModel.aggregate([
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: "userId",
                        foreignField: "_id",
                        as: "result"
                    }
                }
            ])
            console.log(data);
            return data;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default PostRepository;