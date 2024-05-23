import mongoose from "mongoose";
import jobApplicationModel from "../models/jobApplicationModel";



class JobApplicationRepository {

    async getAllApplications(userId: string, userSide = false) {
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
                return item.jobId.recruiterId._id == userId
            })
            return result;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getMonthlyApplicationCount() {
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
            ])
            return monthlyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getDailyApplicationCount() {
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
            ])
            return dailyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getYearlyApplicationCount() {
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
            ])
            return yearlyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default JobApplicationRepository;