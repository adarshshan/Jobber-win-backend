import { JobBodyInterface } from "../controllers/jobController";
import JobApplicationRepository from "../repositories/jobApplicationRepository";
import JobRepository from "../repositories/jobRepository";
import { JobReportRepository } from "../repositories/reportRepository";
import UserRepository from "../repositories/userRepository";


class JobService {
    constructor(
        private jobRepository: JobRepository,
        private userRepository: UserRepository,
        private jobApplicationRepository: JobApplicationRepository,
        private jobReportRepository: JobReportRepository
    ) { }

    async getAllJobs(search: string | undefined, userId: string) {
        try {
            return await this.jobRepository.getAllJobs(search, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getSingleJobDetails(jobId: string) {
        try {
            return await this.jobRepository.getSingleJobDetails(jobId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async applyJOb(jobId: string, userId: string, formData: JobBodyInterface) {
        try {
            await this.userRepository.appliedJob(userId, jobId);
            await this.userRepository.unsaveJob(userId, jobId);
            return await this.jobRepository.applyJOb(jobId, userId, formData);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getApplied(userId: string) {
        try {
            const user = await this.userRepository.getApplied(userId);
            return user;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllApplications(userId: string) {
        try {
            return this.jobApplicationRepository.getAllApplications(userId, true);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async saveJobs(userId: string, jobId: string) {
        try {
            return await this.userRepository.saveJob(userId, jobId)
        } catch (error) {
            console.log(error as Error);
        }
    }
    async unSaveJobs(userId: string, jobId: string) {
        try {
            return await this.userRepository.unsaveJob(userId, jobId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllSavedJobs(userId: string) {
        try {
            return await this.userRepository.getAllSavedJobs(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async reportJob(reason: string, jobId: string, userId: string) {
        try {
            return await this.jobReportRepository.reportJob(reason, jobId, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default JobService;