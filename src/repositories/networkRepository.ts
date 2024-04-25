import userModel from "../models/userModel";
import mongoose from 'mongoose'
import PostModel from "../models/postModel";


const ObjectId = mongoose.Types.ObjectId;


class NetworkRepository {

    async getAllUsers(userId: string) {
        try {
            const userObjectId = new ObjectId(userId);
            const allUsers = await userModel.aggregate([{ $match: { _id: { $ne: userObjectId } } }]);
            return allUsers;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getUserProfile(userId: string) {
        try {
            const user = await userModel.findOne({ _id: userId });
            return user;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getUserPostsById(userId: string) {
        try {
            const posts = await PostModel.find({ userId });
            console.log(posts); console.log('this is the posts of the user.');
            return posts;
        } catch (error) {
            console.log(error as Error);
        }
    }

}

export default NetworkRepository;