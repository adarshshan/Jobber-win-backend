import { UserInterface } from "../../interfaces/entityInterface/Iuser"; // Assuming UserInterface is defined here
import { PostInterface } from "../../models/postModel"; // Assuming PostInterface is defined in postModel.ts
import mongoose from "mongoose";

export interface INetworkRepository {
    getUserProfile(userId: string): Promise<UserInterface>;
    getUserPostsById(userId: string): Promise<PostInterface[]>;
    sendRequest(senderId: string, recieverId: string): Promise<any>; // Updated to match implementation
    getAllRequests(userId: string): Promise<any[]>; // Complex return type due to aggregation
    addToFriend(userId: string, friendId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    getAllFriends(userId: string): Promise<any[]>; // Complex return type due to aggregation
    unFriend(id: string, userId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    removeRequest(id: string, userId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    getAllsendRequests(userId: string): Promise<mongoose.Types.ObjectId[]>;
    getAllsendReqDetails(userId: string): Promise<any[]>; // Complex return type due to aggregation
    withdrawSentRequest(userId: string, id: string): Promise<any>; // Mongoose UpdateWriteOpResult
}