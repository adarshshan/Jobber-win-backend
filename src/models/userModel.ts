import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';

export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: string;
    isBlocked: boolean;
    gender?: "male" | "female" | "custom";
    role: 'recruiter' | 'user';
    image?: string | null;
    resume?: string | undefined;
    location?: string | null;
    skills?: string[];
    savedJobs?: SavedJob[];
    appliedJobs?: AppliedJob[];
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

interface SavedJob {
    jobId: mongoose.Types.ObjectId;
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
