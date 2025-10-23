import { JobBodyInterface } from "../controllers/jobController";
import { IJobApplicationRepository } from "../interfaces/repositoryInterfaces/IJobApplicationRepository";
import { IJobRepository } from "../interfaces/repositoryInterfaces/IJobRepository";
import { IJobReportRepository } from "../interfaces/repositoryInterfaces/IJobReportRepository";
import UserRepository from "../repositories/userRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';


class JobService {
    constructor(
        private jobRepository: IJobRepository,
        private userRepository: UserRepository,
        private jobApplicationRepository: IJobApplicationRepository,
        private jobReportRepository: IJobReportRepository
    ) { }

    async landingPageJobs(search: string): Promise<any[]> {
        try {
            return await this.jobRepository.landingPageJobs(search);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in landingPageJobs:", error);
            throw new Error("An unexpected error occurred while retrieving landing page jobs."); // Re-throw generic error
        }
    }
    async getAllJobs(search: string | undefined, userId: string): Promise<{ jobs: any[]; alljobs: any[] }> {
        try {
            return await this.jobRepository.getAllJobs(search, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllJobs:", error);
            throw new Error("An unexpected error occurred while retrieving all jobs."); // Re-throw generic error
        }
    }
    async getSingleJobDetails(jobId: string): Promise<any> {
        try {
            return await this.jobRepository.getSingleJobDetails(jobId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getSingleJobDetails:", error);
            throw new Error("An unexpected error occurred while retrieving single job details."); // Re-throw generic error
        }
    }
    async applyJOb(jobId: string, userId: string, formData: JobBodyInterface): Promise<any> {
        try {
            await this.userRepository.appliedJob(userId, jobId);
            await this.userRepository.unsaveJob(userId, jobId);
            return await this.jobRepository.applyJOb(jobId, userId, formData);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in applyJOb:", error);
            throw new Error("An unexpected error occurred while applying for job."); // Re-throw generic error
        }
    }
    async getApplied(userId: string): Promise<any[]> {
        try {
            const user = await this.userRepository.getApplied(userId);
            return user;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getApplied:", error);
            throw new Error("An unexpected error occurred while retrieving applied jobs."); // Re-throw generic error
        }
    }
    async getAllApplications(userId: string): Promise<any[]> {
        try {
            return await this.jobApplicationRepository.getAllApplications(userId, true);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllApplications:", error);
            throw new Error("An unexpected error occurred while retrieving all applications."); // Re-throw generic error
        }
    }
    async saveJobs(userId: string, jobId: string): Promise<any> {
        try {
            return await this.userRepository.saveJob(userId, jobId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in saveJobs:", error);
            throw new Error("An unexpected error occurred while saving job."); // Re-throw generic error
        }
    }
    async unSaveJobs(userId: string, jobId: string): Promise<any> {
        try {
            return await this.userRepository.unsaveJob(userId, jobId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in unSaveJobs:", error);
            throw new Error("An unexpected error occurred while unsaving job."); // Re-throw generic error
        }
    }
    async getAllSavedJobs(userId: string): Promise<any[]> {
        try {
            return await this.userRepository.getAllSavedJobs(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllSavedJobs:", error);
            throw new Error("An unexpected error occurred while retrieving all saved jobs."); // Re-throw generic error
        }
    }
    async reportJob(reason: string, jobId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            return await this.jobReportRepository.reportJob(reason, jobId, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in reportJob:", error);
            throw new Error("An unexpected error occurred while reporting job."); // Re-throw generic error
        }
    }
    async getJobsByDate(num: string): Promise<any[]> {
        try {
            return await this.jobRepository.getJobsByDate(num);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getJobsByDate:", error);
            throw new Error("An unexpected error occurred while retrieving jobs by date."); // Re-throw generic error
        }
    }
    async getJobsByExperience(start: string, end: string): Promise<any[]> {
        try {
            return await this.jobRepository.getJobsByExperience(start, end);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getJobsByExperience:", error);
            throw new Error("An unexpected error occurred while retrieving jobs by experience."); // Re-throw generic error
        }
    }
}

export default JobService;