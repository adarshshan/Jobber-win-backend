import userModel from "../models/userModel";
import mongoose from 'mongoose'
import PostModel from "../models/postModel";
import connectionModel from "../models/connectionModel";




import { INetworkRepository } from "../interfaces/repositoryInterfaces/INetworkRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class NetworkRepository implements INetworkRepository {

    async getUserProfile(userId: string): Promise<any> {
        try {
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                throw new NotFoundError(`User profile with ID ${userId} not found.`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getUserProfile:", error);
            throw new DatabaseError(`Failed to retrieve user profile for ID ${userId}.`, error as Error);
        }
    }
    async getUserPostsById(userId: string): Promise<any[]> {
        try {
            const posts = await PostModel.find({ userId });
            return posts;
        } catch (error) {
            console.error("Error in getUserPostsById:", error);
            throw new DatabaseError(`Failed to retrieve user posts for ID ${userId}.`, error as Error);
        }
    }

    async sendRequest(senderId: string, recieverId: string): Promise<any> {
        try {
            const result = await userModel.findByIdAndUpdate(recieverId, { $push: { connectionRequests: senderId } }, { new: true });
            if (!result) {
                throw new NotFoundError(`Receiver with ID ${recieverId} not found for sending connection request.`);
            }
            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in sendRequest:", error);
            throw new DatabaseError(`Failed to send connection request from ${senderId} to ${recieverId}.`, error as Error);
        }
    }
    async getAllRequests(userId: string): Promise<any[]> {
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
            console.error("Error in getAllRequests:", error);
            throw new DatabaseError(`Failed to retrieve all connection requests for user ID ${userId}.`, error as Error);
        }
    }
    async addToFriend(userId: string, friendId: string): Promise<any> {
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
            if (user.modifiedCount === 0 && friend.modifiedCount === 0) {
                throw new NotFoundError(`Could not add friend. User ${userId} or friend ${friendId} not found or no changes made.`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in addToFriend:", error);
            throw new DatabaseError(`Failed to add friend ${friendId} to user ${userId}.`, error as Error);
        }
    }
    async getAllFriends(userId: string): Promise<any[]> {
        try {
            const id = new mongoose.Types.ObjectId(userId);
            const data = await connectionModel.aggregate([
                { $match: { userId: id } },
                { $lookup: { from: 'users', localField: 'friends', foreignField: '_id', as: 'data' } }]);
            if (data && data[0] && data[0].data) {
                return data[0].data;
            } else {
                return []; // Return empty array if no friends found
            }
        } catch (error) {
            console.error("Error in getAllFriends:", error);
            throw new DatabaseError(`Failed to retrieve all friends for user ID ${userId}.`, error as Error);
        }
    }
    async unFriend(id: string, userId: string): Promise<any> {
        try {
            const updatedConnection = await connectionModel.updateOne({ userId }, { $pull: { friends: id } });
            if (updatedConnection.modifiedCount === 0) {
                throw new NotFoundError(`Connection for user ${userId} with friend ${id} not found or no changes made.`);
            }
            return updatedConnection;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in unFriend:", error);
            throw new DatabaseError(`Failed to unfriend user ${id} from user ${userId}.`, error as Error);
        }
    }
    async removeRequest(id: string, userId: string): Promise<any> {
        try {
            const updated = await connectionModel.updateOne({ userId }, { $pull: { requestsReceived: id } });
            if (updated.modifiedCount === 0) {
                throw new NotFoundError(`Connection request from ${id} to user ${userId} not found or no changes made.`);
            }
            return updated;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in removeRequest:", error);
            throw new DatabaseError(`Failed to remove connection request from ${id} to user ${userId}.`, error as Error);
        }
    }
    async getAllsendRequests(userId: string): Promise<any[]> {
        try {
            const connection = await connectionModel.findOne({ userId });
            return connection?.requestsSend || [];
        } catch (error) {
            console.error("Error in getAllsendRequests:", error);
            throw new DatabaseError(`Failed to retrieve all sent requests for user ID ${userId}.`, error as Error);
        }
    }
    async getAllsendReqDetails(userId: string): Promise<any[]> {
        try {
            const id = new mongoose.Types.ObjectId(userId);
            const requestSendDetails = await userModel.aggregate([
                {
                    $match: { _id: id }
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
            return requestSendDetails;
        } catch (error) {
            console.error("Error in getAllsendReqDetails:", error);
            throw new DatabaseError(`Failed to retrieve all sent request details for user ID ${userId}.`, error as Error);
        }
    }
    async withdrawSentRequest(userId: string, id: string): Promise<any> {
        try {
            const updated = await connectionModel.updateOne({ userId }, { $pull: { requestsSend: id } });
            if (updated.modifiedCount === 0) {
                throw new NotFoundError(`Sent request from user ${userId} to ${id} not found or no changes made.`);
            }
            return updated;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in withdrawSentRequest:", error);
            throw new DatabaseError(`Failed to withdraw sent request from user ${userId} to ${id}.`, error as Error);
        }
    }

}

export default NetworkRepository;