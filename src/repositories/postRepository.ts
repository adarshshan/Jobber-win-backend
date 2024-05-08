import mongoose, { ObjectId, mongo } from 'mongoose';
import IPostInterface from '../interfaces/entityInterface/Ipost';
import PostModel from '../models/postModel';
import LikeModel from '../models/likeModel';
import { pid } from 'process';



class PostRepository {
    async savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface | null> {
        try {

            const newPost = new PostModel({
                userId,
                imageUrl,
                caption
            });

            await newPost.save();

            const postObject: IPostInterface = newPost.toObject(); // Convert Mongoose document to plain JavaScript object
            return postObject;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getPosts(userId: string) {
        try {
            const data = await PostModel.find({ userId }).sort({ createdAt: -1 });
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
            ]).sort({ createdAt: -1 });
            return data;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async likePost(postId: string, userId: string) {
        try {
            const liked = await LikeModel.findOne({ postId: postId });

            if (!liked) {
                const newLike = new LikeModel({ postId: postId, likedUsers: [{ userId: userId }] });
                await newLike.save();
                return { success: true, data: newLike, message: 'successfully liked the post' };
            } else {
                const userIdExists = liked.likedUsers.some(user => user.userId === userId);

                if (!userIdExists) {
                    const likee = await LikeModel.findOneAndUpdate(
                        { postId: postId },
                        { $addToSet: { likedUsers: { userId: userId } } },
                        { new: true }
                    );
                    if (likee) {
                        likee.likeCount = likee.likedUsers.length;
                        await likee.save();
                        return { success: true, data: likee, message: 'user liked successfully!' };
                    }
                } else {
                    return { success: false, message: 'user liked already!' };
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async unLikePost(postId: string, userId: string) {
        try {
            const likee = await LikeModel.findOneAndUpdate(
                { postId: postId },
                { $pull: { likedUsers: { userId: userId } } },
                { new: true }
            );
            if (likee) {
                likee.likeCount = likee.likedUsers.length;
                await likee.save();
                return { success: true, data: likee, message: 'unlike success!' };
            } else return { success: false, message: 'somthing went wrong!' }
        } catch (error) {
            console.log(error as Error);
        }
    }

    async getLikes(postId: string) {
        try {
            const likeDetails = await LikeModel.findOne({ postId: postId });
            return likeDetails;
        } catch (error) {
            console.log(error as Error);
            console.log('The error is here...');
        }
    }
}

export default PostRepository;