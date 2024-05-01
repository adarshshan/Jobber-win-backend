import { JobBodyInterface } from "../controllers/jobController";
import JobRepository from "../repositories/jobRepository";
import UserRepository from "../repositories/userRepository";


class JobService {
    constructor(private jobRepository: JobRepository, private userRepository: UserRepository) { }

    async getAllJobs() {
        try {
            return await this.jobRepository.getAllJobs();
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
}

export default JobService;