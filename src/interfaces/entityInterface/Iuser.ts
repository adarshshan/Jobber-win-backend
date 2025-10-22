import mongoose, { ObjectId, Document } from "mongoose";

export interface Subscription {
    sub_Id: string;
    purchased_At: Date;
}

// New interface for user creation data
export interface IUserCreateData {
    name: string;
    email: string;
    password: string | Promise<string>;
    profile_picture?: string;
    phone?: number;
    designation?: string;
    about?: string;
    skills?: string[];
    isBlocked?: boolean;
    following?: ObjectId[];
    followers?: ObjectId[];
    appliedJobs?: AppliedJob[];
    savedJobs?: SavedJob[];
    subscription?: Subscription;
}

export interface UserInterface extends Document {
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
    jobId: mongoose.Types.ObjectId;
    savedAt: Date;
}
export interface AppliedJob {
    jobId: mongoose.Types.ObjectId;
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