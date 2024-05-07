import mongoose from "mongoose";
import { JobInterface } from "../controllers/recruiterController";
import jobApplicationModel from "../models/jobApplicationModel";
import jobModel from "../models/jobModel";


class RecruiterRepository {

    async getAllJobs(recruiterId: string) {
        try {
            const jobs = await jobModel.find({ recruiterId });
            return jobs;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postNewJob(data: JobInterface, userId: string) {
        try {
            console.log(data);
            const newJob = new jobModel({
                ...data,
                recruiterId: userId
            })
            return await newJob.save();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJob() {
        try {
            console.log('reached at the end of the line at deleteJob function');
        } catch (error) {
            console.log(error as Error)
        }
    }
    async editJobs() {
        try {
            console.log('reached at the end of the line at editJobs function');
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllApplications(userId: string) {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const Id = new ObjectId(userId)
            const applications: any = await jobApplicationModel.find()
                .populate("userId", "-password")
                .populate({
                    path: 'jobId',
                    populate: {
                        path: 'recruiterId'
                    }
                })
            const result: any = applications.filter((item: any) => {
                return item.jobId.recruiterId._id == userId
            })
            return result;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changeStatus(status: string, applicationId: string) {
        try {
            console.log('this is teh received Id' + applicationId);
            const application = await jobApplicationModel.findById(applicationId);
            if (application) application.status = status;
            const updatedApplication = await application?.save();
            return updatedApplication;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterRepository;