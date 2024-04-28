import { JobInterface } from "../controllers/recruiterController";
import jobModel from "../models/jobModel";


class RecruiterRepository {

    async getAllJobs() {
        try {
            console.log('reached at the end of the line at getAllJobs function...');
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
}

export default RecruiterRepository;