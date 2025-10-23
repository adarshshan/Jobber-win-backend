import mongoose from "mongoose";
import jobModel, { JobModelInterface } from "../models/jobModel";
import { JobBodyInterface } from "../controllers/jobController";
import jobApplicationModel from "../models/jobApplicationModel";
import userModel from "../models/userModel";


import { IJobRepository } from "../interfaces/repositoryInterfaces/IJobRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class JobRepository implements IJobRepository {

    async landingPageJobs(search: string | undefined): Promise<JobModelInterface[]> {
        try {
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {};
            const alljobs = await jobModel.find(keyword).sort({ createdAt: -1 }).limit(6);
            return alljobs;
        } catch (error) {
            console.error("Error in landingPageJobs:", error);
            throw new DatabaseError(`Failed to retrieve landing page jobs with search query "${search}".`, error as Error);
        }
    }

    async getAllJobs(search: string | undefined, userId: string): Promise<{ jobs: any[]; alljobs: JobModelInterface[] }> {
        try {
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {};
            const alljobs = await jobModel.find({ $and: [{ isReported: false }, keyword] }).sort({ createdAt: -1 });

            var userSkills: string[] | any = await userModel.findOne({ _id: userId }, { skills: 1 });
            if (userSkills) userSkills = userSkills.skills;

            const jobs = await jobModel.aggregate([
                { $match: { isReported: false } },
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
            return { jobs, alljobs };
        } catch (error) {
            console.error("Error in getAllJobs:", error);
            throw new DatabaseError(`Failed to retrieve all jobs for user ID ${userId} with search query "${search}".`, error as Error);
        }
    }
    async getAllJobsByskills(): Promise<any[]> {
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
            return jobs;
        } catch (error) {
            console.error("Error in getAllJobsByskills:", error);
            throw new DatabaseError(`Failed to retrieve jobs by skills.`, error as Error);
        }
    }
    async getSingleJobDetails(jobId: string): Promise<any> {
        try {
            const job = await jobModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
                { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
                { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
            ]);
            if (!job || job.length === 0) {
                throw new NotFoundError(`Job with ID ${jobId} not found.`);
            }
            return job[0];
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getSingleJobDetails:", error);
            throw new DatabaseError(`Failed to retrieve single job details for job ID ${jobId}.`, error as Error);
        }
    }
    async applyJOb(jobId: string, userId: string, formData: JobBodyInterface): Promise<any> {
        try {
            const jobApplication = new jobApplicationModel({
                ...formData,
                userId,
                jobId
            });
            await jobApplication.save();
            return jobApplication;
        } catch (error) {
            console.error("Error in applyJOb:", error);
            throw new DatabaseError(`Failed to apply for job ${jobId} by user ${userId}.`, error as Error);
        }
    }
    async getJobsByDate(num: string): Promise<JobModelInterface[]> {
        try {
            const jobs = await jobModel.find({ updatedAt: { $gte: new Date(Date.now() - parseInt(num) * 24 * 60 * 60 * 1000) } });
            return jobs;
        } catch (error) {
            console.error("Error in getJobsByDate:", error);
            throw new DatabaseError(`Failed to retrieve jobs by date for ${num} days.`, error as Error);
        }
    }
    async getJobsByExperience(start: string, end: string): Promise<JobModelInterface[]> {
        try {
            let jobs;
            if (start === '0' && end === '0') jobs = await jobModel.find({ experience: 0 });
            else if (end === '0') jobs = await jobModel.find({ experience: { $gt: start } });
            else jobs = await jobModel.find({ experience: { $gt: start, $lt: end } });
            return jobs;
        } catch (error) {
            console.error("Error in getJobsByExperience:", error);
            throw new DatabaseError(`Failed to retrieve jobs by experience range ${start}-${end}.`, error as Error);
        }
    }
    async changeReportStatus(jobId: string): Promise<JobModelInterface> {
        try {
            const job = await jobModel.findById(jobId);
            if (!job) {
                throw new NotFoundError(`Job with ID ${jobId} not found for changing report status.`);
            }
            job.isReported = true;
            await job.save();
            return job;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in changeReportStatus:", error);
            throw new DatabaseError(`Failed to change report status for job with ID ${jobId}.`, error as Error);
        }
    }
    async getMonthlyJobPostCount(): Promise<any[]> {
        try {
            const monthlyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);

            console.log('Monthly Job Post Count:', monthlyCount);
            return monthlyCount;
        } catch (error) {
            console.error("Error in getMonthlyJobPostCount:", error);
            throw new DatabaseError(`Failed to retrieve monthly job post count.`, error as Error);
        }
    }
    async getDailyJobPostCount(): Promise<any[]> {
        try {
            const dailyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ]);

            console.log('Daily Job Post Count:', dailyCount);
            return dailyCount;
        } catch (error) {
            console.error("Error in getDailyJobPostCount:", error);
            throw new DatabaseError(`Failed to retrieve daily job post count.`, error as Error);
        }
    }
    async getYearlyJobPostCount(): Promise<any[]> {
        try {
            const yearlyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1 }
                }
            ]);

            console.log('Yearly Job Post Count:', yearlyCount);
            return yearlyCount;
        } catch (error) {
            console.error("Error in getYearlyJobPostCount:", error);
            throw new DatabaseError(`Failed to retrieve yearly job post count.`, error as Error);
        }
    }
}

export default JobRepository;