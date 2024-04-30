import mongoose from "mongoose";
import jobModel from "../models/jobModel";
import { JobBodyInterface } from "../controllers/jobController";
import jobApplicationModel from "../models/jobApplicationModel";


class JobRepository {

    async getAllJobs() {
        try {
            const jobs = await jobModel.aggregate([
                { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
                { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
            ]);
            return jobs;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getSingleJobDetails(jobId: string) {
        try {
            const job = await jobModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
                { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
                { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
            ])
            console.log(job[0]);
            return job[0];
        } catch (error) {
            console.log(error as Error);
        }
    }
    async applyJOb(jobId: string, userId: string, formData: JobBodyInterface) {
        try {
            const jobApplication = new jobApplicationModel({
                ...formData,
                userId,
                jobId
            })
            await jobApplication.save();
            return jobApplication;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default JobRepository;