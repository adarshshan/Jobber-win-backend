import { ObjectId } from "mongoose";

interface UserInterface {
    id?: string | undefined;
    name?: string;
    email: string;
    phone?: number;
    password?: string | Promise<string>;
    designation?: string;
    about?: string;
    profile_picture?: string;
    skills?: string[];
    isBlocked?: boolean;
    following?: ObjectId[];
    followers?: ObjectId[];
    applied_jobs?: AppliedJob[];
    saved_jobs?: SavedJob[];
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