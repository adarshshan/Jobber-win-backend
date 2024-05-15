import { JobInterface } from "../controllers/recruiterController";
import JobApplicationRepository from "../repositories/jobApplicationRepository";
import RecruiterRepository from "../repositories/recruiterRepository";


class RecruiterService {
    constructor(private recruiterRepository: RecruiterRepository, private jobApplicationRepository: JobApplicationRepository) { }

    async getAllJobs(userId: string) {
        try {
            return await this.recruiterRepository.getAllJobs(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postNewJob(data: JobInterface, userId: string) {
        try {
            return await this.recruiterRepository.postNewJob(data, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editJobs(data: JobInterface, jobId: string) {
        try {
            return await this.recruiterRepository.editJobs(data, jobId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJob() {
        try {
            const result = await this.recruiterRepository.deleteJob();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllApplications(userId: string) {
        try {
            return await this.jobApplicationRepository.getAllApplications(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changeStatus(status: string, applicationId: string) {
        try {
            return await this.recruiterRepository.changeStatus(status, applicationId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterService;