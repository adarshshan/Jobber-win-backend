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
}

export default JobApplicationRepository;