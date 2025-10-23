import mongoose from "mongoose";
import jobApplicationModel from "../models/jobApplicationModel";



import { IJobApplicationRepository } from "../interfaces/repositoryInterfaces/IJobApplicationRepository";
import { DatabaseError } from '../utils/errors';

class JobApplicationRepository implements IJobApplicationRepository {

    async getAllApplications(userId: string, userSide = false): Promise<any[]> {
        try {
            const applications: any = await jobApplicationModel.find(userSide ? { userId } : {})
                .populate("userId", "-password")
                .populate({
                    path: 'jobId',
                    populate: {
                        path: 'recruiterId'
                    }
                }).sort({ createdAt: -1 });

            if (userSide) return applications;
            const result: any = applications.filter((item: any) => {
                return item.jobId.recruiterId._id == userId;
            });
            return result;
        } catch (error) {
            console.error("Error in getAllApplications:", error);
            throw new DatabaseError(`Failed to retrieve all applications for user ID ${userId}.`, error as Error);
        }
    }
    async getMonthlyApplicationCount(): Promise<any[]> {
        try {
            const monthlyCount = await jobApplicationModel.aggregate([
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
            return monthlyCount;
        } catch (error) {
            console.error("Error in getMonthlyApplicationCount:", error);
            throw new DatabaseError(`Failed to retrieve monthly application count.`, error as Error);
        }
    }
    async getDailyApplicationCount(): Promise<any[]> {
        try {
            const dailyCount = await jobApplicationModel.aggregate([
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
            return dailyCount;
        } catch (error) {
            console.error("Error in getDailyApplicationCount:", error);
            throw new DatabaseError(`Failed to retrieve daily application count.`, error as Error);
        }
    }
    async getYearlyApplicationCount(): Promise<any[]> {
        try {
            const yearlyCount = await jobApplicationModel.aggregate([
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
            return yearlyCount;
        } catch (error) {
            console.error("Error in getYearlyApplicationCount:", error);
            throw new DatabaseError(`Failed to retrieve yearly application count.`, error as Error);
        }
    }
    async getGraphData(recruiterId: string): Promise<any[]> {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const UserId = new ObjectId(recruiterId);
            const res = await jobApplicationModel.aggregate([
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "jobDetails"
                    }
                },
                {
                    $unwind: "$jobDetails"
                },
                {
                    $match: {
                        "jobDetails.recruiterId": UserId
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: "$createdAt" },
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ]);
            return res;
        } catch (error) {
            console.error("Error in getGraphData:", error);
            throw new DatabaseError(`Failed to retrieve graph data for recruiter ID ${recruiterId}.`, error as Error);
        }
    }
}

export default JobApplicationRepository;