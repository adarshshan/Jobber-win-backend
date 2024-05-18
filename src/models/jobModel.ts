import mongoose, { Schema, Document, ObjectId } from "mongoose";


export interface jobInterface extends Document {
    _id: ObjectId;
    title: string;
    recruiterId: ObjectId;
    company_name: string;
    job_img: string;
    industry: string;
    description: string;
    skills: string[];
    total_vaccancy?: number;
    isActive: boolean;
    isReported: boolean;
    experience: number;
    job_type: 'part-time' | 'full-time' | 'remote';
    max_salary: number;
    min_salary: number;
    qualifications?: string[]
}

const adminSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is Required!'],
    },
    company_name: {
        type: String,
        required: true
    },
    job_img: {
        type: String,
    },
    industry: {
        type: String,
    },
    isReported: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String
    },
    skills: [{ type: String }],
    total_vaccancy: {
        type: Number
    },
    experience: { type: Number },
    location: { type: String },
    isActive: {
        type: Boolean
    },
    job_type: { type: String },
    max_salary: { type: Number },
    min_salary: { type: Number },
}, {
    timestamps: true,
})

const jobModel = mongoose.model<jobInterface>('job', adminSchema);

export default jobModel;
