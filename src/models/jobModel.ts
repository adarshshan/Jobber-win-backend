import mongoose, { Schema, Document, ObjectId } from "mongoose";


export interface jobInterface extends Document {
    _id: ObjectId;
    title: string;
    job_img: string;
    industry: string;
    description: string;
    skills: string[];
    total_vaccancy?: number;
    isActive: boolean;
    type: 'part-time' | 'full-time' | 'remote';
    salary: { from: number; upto: number };
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
    location: { type: String },
    isActive: {
        type: Boolean
    },
    job_type: { type: String },
    salary: {
        from: { type: Number },
        upto: { type: Number }
    }
})

const jobModel = mongoose.model<jobInterface>('job', adminSchema);

export default jobModel;
