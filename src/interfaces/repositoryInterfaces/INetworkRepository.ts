import { Document } from "mongoose";
import { UserInterface } from "../../interfaces/entityInterface/Iuser"; // Assuming UserInterface is defined here
import { ConnectionInterface } from "../../models/connectionModel"; // Assuming ConnectionInterface is defined in connectionModel.ts
import { PostInterface } from "../../models/postModel"; // Assuming PostInterface is defined in postModel.ts
import mongoose from "mongoose";

export interface INetworkRepository {
    getUserProfile(userId: string): Promise<(UserInterface & Document) | undefined | null>;
    getUserPostsById(userId: string): Promise<(PostInterface & Document)[] | undefined>;
    sendRequest(receiverId: string, senderId: string): Promise<{ success: boolean; message?: string; receiver?: (ConnectionInterface & Document); sender?: (ConnectionInterface & Document) }>;
    getAllRequests(userId: string): Promise<any[] | undefined>; // Complex return type due to aggregation
    addToFriend(userId: string, friendId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    getAllFriends(userId: string): Promise<any[] | undefined>; // Complex return type due to aggregation
    unFriend(id: string, userId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    removeRequest(id: string, userId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    getAllsendRequests(userId: string): Promise<mongoose.Types.ObjectId[] | undefined>;
    getAllsendReqDetails(userId: string): Promise<any>; // Complex return type due to aggregation
    withdrawSentRequest(userId: string, id: string): Promise<any>; // Mongoose UpdateWriteOpResult
}