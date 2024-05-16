import mongoose from "mongoose";
import jobModel from "../models/jobModel";
import { JobBodyInterface } from "../controllers/jobController";
import jobApplicationModel from "../models/jobApplicationModel";
import userModel from "../models/userModel";


class JobRepository {

    async getAllJobs(search: string | undefined, userId: string) {
        try {
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {}
            const alljobs = await jobModel.find(keyword);

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
            // console.log(job[0]);
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
    async getJobsByDate(num: string) {
        try {
            const jobs = await jobModel.find({ updatedAt: { $gte: new Date(Date.now() - parseInt(num) * 24 * 60 * 60 * 1000) } });
            return jobs;
        } catch (error) {
            console.log(error as Error)
        }
    }
    async getJobsByExperience(start: string, end: string) {
        try {
            let jobs;
            if (start === '0' && end === '0') jobs = await jobModel.find({ experience: 0 });
            else if (end === '0') jobs = await jobModel.find({ experience: { $gt: start } });
            else jobs = await jobModel.find({ experience: { $gt: start, $lt: end } });
            return jobs;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default JobRepository;