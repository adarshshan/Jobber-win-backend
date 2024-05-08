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
    async changeStatus(status: string, applicationId: string) {
        try {
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