import userModel from "../models/userModel";
import mongoose, { Schema, ObjectId } from 'mongoose'
import PostModel from "../models/postModel";
import connectionModel from "../models/connectionModel";


const ObjectId = mongoose.Types.ObjectId;


class NetworkRepository {

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
            const id = new mongoose.Types.ObjectId(userId);
            const data = await connectionModel.aggregate([
                { $match: { userId: id } },
                { $lookup: { from: 'users', localField: 'friends', foreignField: '_id', as: 'data' } }]);
            if (data) return data[0].data;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async unFriend(id: string, userId: string) {
        try {
            const updatedConnection = await connectionModel.updateOne({ userId }, { $pull: { friends: id } });
            return updatedConnection;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeRequest(id: string, userId: string) {
        try {
            const updated = await connectionModel.updateOne({ userId }, { $pull: { requestsReceived: id } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllsendRequests(userId: string) {
        try {
            const connection = await connectionModel.findOne({ userId });
            return connection?.requestsSend;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllsendReqDetails(userId: string) {
        try {
            console.log(userId); console.log('userId is reached...');
            const id = new mongoose.Types.ObjectId(userId);
            const requestSendDetails = await userModel.aggregate([
                {
                    $match: { _id:id } 
                },
                {
                    $lookup: {
                        from: 'users', 
                        localField: 'requestsSend',
                        foreignField: '_id',
                        as: 'requestSendDetails'
                    }
                }
            ]);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async withdrawSentRequest(userId: string, id: string) {
        try {
            console.log(`this is the end of the line ${userId} and the id is ${id}`);
            const updated = await connectionModel.updateOne({ userId }, { $pull: { requestsSend: id } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }

}

export default NetworkRepository;