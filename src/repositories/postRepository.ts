import IPostInterface from '../interfaces/entityInterface/Ipost';
import PostModel from '../models/postModel';
import LikeModel from '../models/likeModel';




import { IPostRepository } from "../interfaces/repositoryInterfaces/IPostRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class PostRepository implements IPostRepository {
    async savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface> {
        try {
            const newPost = new PostModel({
                userId,
                imageUrl,
                caption
            });

            await newPost.save();

            const postObject: IPostInterface = newPost.toObject();
            return postObject;
        } catch (error) {
            console.error("Error in savePost:", error);
            throw new DatabaseError(`Failed to save post for user ID ${userId}.`, error as Error);
        }
    }
    async getPosts(userId: string): Promise<IPostInterface[]> {
        try {
            const data = await PostModel.find({ userId }).sort({ createdAt: -1 });
            return data;
        } catch (error) {
            console.error("Error in getPosts:", error);
            throw new DatabaseError(`Failed to retrieve posts for user ID ${userId}.`, error as Error);
        }
    }
    async getPostForHome(): Promise<any[]> {
        try {
            const data = await PostModel.aggregate([
                { $match: { isReported: false } },
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
            console.error("Error in getPostForHome:", error);
            throw new DatabaseError(`Failed to retrieve posts for home feed.`, error as Error);
        }
    }
    async likePost(postId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const liked = await LikeModel.findOne({ postId: postId });

            if (!liked) {
                const newLike = new LikeModel({ postId: postId, likedUsers: [{ userId: userId }] });
                await newLike.save();
                return { success: true, data: newLike, message: 'Successfully liked the post.' };
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
                        return { success: true, data: likee, message: 'User liked successfully!' };
                    } else {
                        throw new DatabaseError(`Failed to update like for post ${postId}.`);
                    }
                } else {
                    return { success: false, message: 'User already liked this post!' };
                }
            }
        } catch (error) {
            console.error("Error in likePost:", error);
            throw new DatabaseError(`Failed to like post ${postId} by user ${userId}.`, error as Error);
        }
    }

    async unLikePost(postId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            const likee = await LikeModel.findOneAndUpdate(
                { postId: postId },
                { $pull: { likedUsers: { userId: userId } } },
                { new: true }
            );
            if (likee) {
                likee.likeCount = likee.likedUsers.length;
                await likee.save();
                return { success: true, data: likee, message: 'Unlike successful!' };
            } else {
                throw new DatabaseError(`Failed to unlike post ${postId}.`);
            }
        } catch (error) {
            console.error("Error in unLikePost:", error);
            throw new DatabaseError(`Failed to unlike post ${postId} by user ${userId}.`, error as Error);
        }
    }

    async getLikes(postId: string): Promise<any> {
        try {
            const likeDetails = await LikeModel.findOne({ postId: postId }).populate('likedUsers.userId');
            return likeDetails;
        } catch (error) {
            console.error("Error in getLikes:", error);
            throw new DatabaseError(`Failed to retrieve like details for post ID ${postId}.`, error as Error);
        }
    }
    async deletePost(postId: string): Promise<IPostInterface> {
        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new NotFoundError(`Post with ID ${postId} not found for deletion.`);
            }
            post.isDeleted = true;
            await post.save();
            return post;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deletePost:", error);
            throw new DatabaseError(`Failed to delete post with ID ${postId}.`, error as Error);
        }
    }
    async updateCaption(caption: string, postId: string): Promise<IPostInterface> {
        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new NotFoundError(`Post with ID ${postId} not found for updating caption.`);
            }
            post.caption = caption;
            await post.save();
            return post;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in updateCaption:", error);
            throw new DatabaseError(`Failed to update caption for post with ID ${postId}.`, error as Error);
        }
    }
    async getSinglePostDetails(postId: string): Promise<IPostInterface> {
        try {
            const post = await PostModel.findById(postId).populate('userId', 'name profile_picture headLine');
            if (!post) {
                throw new NotFoundError(`Post with ID ${postId} not found.`);
            }
            return post;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getSinglePostDetails:", error);
            throw new DatabaseError(`Failed to retrieve single post details for post ID ${postId}.`, error as Error);
        }
    }
    async changePostReportStatus(postId: string): Promise<IPostInterface> {
        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new NotFoundError(`Post with ID ${postId} not found for changing report status.`);
            }
            post.isReported = true;
            await post.save();
            return post;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in changePostReportStatus:", error);
            throw new DatabaseError(`Failed to change report status for post with ID ${postId}.`, error as Error);
        }
    }

}

export default PostRepository;