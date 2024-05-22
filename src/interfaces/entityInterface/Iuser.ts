import mongoose, { ObjectId } from "mongoose";

export interface Subscription {
    sub_Id: string;
    purchased_At: Date;
}
interface UserInterface {
    id?: string | undefined;
    name: string;
    email: string;
    phone?: number;
    password: string | Promise<string>;
    designation?: string;
    about?: string;
    profile_picture?: string;
    skills?: string[];
    isBlocked?: boolean;
    following?: ObjectId[];
    followers?: ObjectId[];
    appliedJobs?: AppliedJob[];
    savedJobs?: SavedJob[];
    subscription?: Subscription;
}

export default UserInterface;

export interface SavedJob {
    jobId: ObjectId;
    savedAt: Date;
}
export interface AppliedJob {
    jobId: ObjectId;
    appliedAt: Date;
}
export interface Followers {
    userId: ObjectId;
    followedAt: Date;
}
export interface Following {
    userId: ObjectId;
    followedAt: Date;
}