import mongoose from "mongoose";
import jobModel from "../models/jobModel";
import { JobBodyInterface } from "../controllers/jobController";
import jobApplicationModel from "../models/jobApplicationModel";
import userModel from "../models/userModel";


class JobRepository {

    async getAllJobs(search: string | undefined, userId: string) {
        try {
            console.log('the search query is '+search);
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {}
            const alljobs=await jobModel.find(keyword);
            // const alljobs = await jobModel.aggregate([
            //     { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
            //     { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
            // ]);

            var userSkills: string[] | any = await userModel.findOne({ _id: userId }, { skills: 1 });
            if (userSkills) userSkills = userSkills.skills;

            const jobs = await jobModel.aggregate([
                {
                    $addFields: {
                        matchedSkills: {
                            $size: {
                                $setIntersection: ["$skills", userSkills]
                            }
                        }
                    }
                },
                {
                    $match: {
                        matchedSkills: { $gte: 1 }
                    }
                }
            ]);
            return { jobs, alljobs }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllJobsByskills() {
        try {
            const jobs = await jobModel.aggregate([
                {
                    $match: {
                        skills: { $in: ['JavaScript', 'React', 'Node.js', 'sql', 'TypeScript', 'express', 'Mongodb'] }
                    }
                },
                {
                    $addFields: {
                        matchedSkills: { $setIntersection: ["$skills", ["Mongodb", "sql", "express", "Node.js"]] }
                    }
                },
                {
                    $match: {
                        $expr: { $gte: [{ $size: "$matchedSkills" }, 3] }
                    }
                }
            ]);

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