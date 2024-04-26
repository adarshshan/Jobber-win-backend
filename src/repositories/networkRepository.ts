import userModel from "../models/userModel";
import mongoose, { Schema, ObjectId } from 'mongoose'
import PostModel from "../models/postModel";
import connectionModel from "../models/connectionModel";


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
            return posts;
        } catch (error) {
            console.log(error as Error);
        }
    }

    async sendRequest(receiverId: string, senderId: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
                return { success: false, message: 'Receiver or sender id is not valid!' };
            }
            const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
            const senderObjectId = new mongoose.Types.ObjectId(senderId);

            let receiver = await connectionModel.findOne({ userId: receiverObjectId });
            if (!receiver) {
                receiver = new connectionModel({
                    userId: receiverObjectId,
                    friends: [],
                    requestsSend: [],
                    requestsReceived: []
                });
                await receiver.save();
            }

            let sender = await connectionModel.findOne({ userId: senderObjectId });
            if (!sender) {
                sender = new connectionModel({
                    userId: senderObjectId,
                    friends: [],
                    requestsSend: [],
                    requestsReceived: []
                });
                await sender.save();
            }
            if (!receiver.requestsReceived.includes(senderObjectId)) receiver.requestsReceived.push(senderObjectId);
            if (!sender.requestsSend.includes(receiverObjectId)) sender.requestsSend.push(receiverObjectId);

            await receiver.save();
            await sender.save();

            console.log(receiver, 'this is the receiver details');
            console.log(sender, 'this is the sender details');

            return { success: true, receiver, sender };
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: 'An error occurred while processing the request.' };
        }
    }
    async getAllRequests(userId: string) {
        try {
            const result = await connectionModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'requestsReceived',
                        foreignField: '_id',
                        as: 'receivedRequests'
                    }
                },
                {
                    $unwind: '$receivedRequests'
                },
                {
                    $project: {
                        '_id': 0,
                        'receivedRequests.name': 1,
                        'receivedRequests._id': 1,
                        'receivedRequests.profile_picture': 1,
                        'receivedRequests.headLine': 1
                    }
                }
            ]);
            const receivedRequestsArray = result.map(item => item.receivedRequests);
            return receivedRequestsArray;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addToFriend(userId: string, friendId: string) {
        try {
            const userAId = new mongoose.Types.ObjectId(userId);
            const userBId = new mongoose.Types.ObjectId(friendId);
            const user = await connectionModel.updateOne(
                { userId: userAId },
                {
                    $pull: { requestsReceived: userBId },
                    $push: { friends: userBId }
                }
            );
            const friend = await connectionModel.updateOne(
                { userId: userBId },
                {
                    $pull: { requestsSend: userAId },
                    $push: { friends: userAId }
                }
            );
            return user;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllFriends(userId: string) {
        try {
            const connection = await connectionModel.findOne({ userId });
            if (connection) return connection.friends;
        } catch (error) {
            console.log(error as Error);
        }
    }

}

export default NetworkRepository;