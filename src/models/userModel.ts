import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { AppliedJob, SavedJob } from "../interfaces/entityInterface/Iuser";

export interface userInterface extends Document {
    _id: ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: string;
    isBlocked?: boolean;
    gender?: "male" | "female" | "custom";
    role: 'recruiter' | 'user';
    image?: string | null;
    resume?: string | undefined;
    location?: string | null;
    skills?: string[];
    savedJobs?: SavedJob[];
    appliedJobs?: AppliedJob[];
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String
    },
    role: {
        type: String
    },
    image: {
        type: String
    },
    resume: {
        type: String
    },
    location: {
        type: String
    },
    savedJobs: [
        {
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            savedAt: { type: Date, default: Date.now }
        }
    ],
    appliedJobs: [
        {
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            appliedAt: { type: Date, default: Date.now }
        }
    ], skills: [{
        type: String
    }]
})

const userModel = mongoose.model<userInterface>('user', userSchema)
export default userModel;