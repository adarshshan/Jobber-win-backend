import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';
import { Subscription } from "../interfaces/entityInterface/Iuser";


export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    aboutInfo: string;
    phoneNumber: number;
    isBlocked: boolean;
    headLine: string;
    qualification: string;
    gender: string;
    role: 'recruiter' | 'user';
    profile_picture: string;
    cover_image: string;
    location?: string | null;
    skills?: string[];
    savedJobs?: SavedJob[];
    subscription: Subscription;
    appliedJobs?: AppliedJob[];
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

interface SavedJob {
    jobId: string;
    savedAt: Date;
}

interface AppliedJob {
    jobId: mongoose.Types.ObjectId;
    appliedAt: Date;
}

const userSchema: Schema<UserInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    headLine: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    qualification: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    aboutInfo: {
        type: String,
    },
    gender: {
        type: String
    },
    role: {
        type: String
    },
    profile_picture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png"
    },
    cover_image: {
        type: String,
        default: "https://img.freepik.com/free-photo/grunge-black-concrete-textured-background_53876-124541.jpg"
    },
    location: {
        type: String
    },
    subscription: {
        sub_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'subscription' },
        purchased_At: { type: Date, required: true }
    },
    savedJobs: [
        {
            jobId: { type: String, ref: 'job' },
            savedAt: { type: Date, default: Date.now }
        }
    ],
    appliedJobs: [
        {
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'job' },
            appliedAt: { type: Date, default: Date.now }
        }
    ],
    skills: [{
        type: String
    }]
});

userSchema.pre('save', async function (this: UserInterface, next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

userSchema.methods.matchPassword = async function (this: UserInterface, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<UserInterface> = mongoose.model<UserInterface>('User', userSchema);
export default userModel;
