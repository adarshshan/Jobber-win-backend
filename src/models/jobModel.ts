import mongoose, { Schema, Document, ObjectId } from "mongoose";


export interface jobInterface extends Document {
    _id: ObjectId;
    title?: string;
    job_img?: string;
    industry?: string;
    description?: string;
    skills?: string[];
    total_vaccancy?: number;
    isActive?: boolean;
    type?: 'part-time' | 'full-time' | 'remote';
    salary?: number,
    benefits?: {
        title?: string;
        logo?: string;
        description?: string;
    }[];
    qualifications?: string[]
}

const adminSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    job_img: {
        type: String,
    },
    industry: {
        type: String,
    },
    description: {
        type: String
    },
    skills: [{ type: String }],
    total_vaccancy: {
        type: Number
    },
    isActive: {
        type: Boolean
    },
    job_type: { type: String },
    salary: { type: Number },
    benefits: [{
        title: { type: String },
        logo: { type: String },
        description: { type: String },
    }],
    qualifications: [{
        type: String
    }]
})

const jobModel = mongoose.model<jobInterface>('job', adminSchema);

export default jobModel;
