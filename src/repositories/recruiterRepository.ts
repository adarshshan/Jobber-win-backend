import mongoose from "mongoose";
import { JobInterface } from "../controllers/recruiterController";
import jobApplicationModel from "../models/jobApplicationModel";
import jobModel from "../models/jobModel";


import { IRecruiterRepository } from "../interfaces/repositoryInterfaces/IRecruiterRepository";

class RecruiterRepository implements IRecruiterRepository {

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
    async editJobs(data: JobInterface, jobId: string) {
        try {
            const job = await jobModel.findById(jobId);
            if (job) {
                job.title = data.title || job.title;
                job.company_name = data.company_name || job.company_name;
                job.industry = data.industry || job.industry;
                job.job_img = data.job_img || job.job_img;
                job.description = data.description || job.description;
                job.total_vaccancy = data.total_vaccancy || job.total_vaccancy;
                job.job_type = data.job_type || job.job_type;
            }
            const updatedJob = await job?.save();
            return updatedJob;
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