import JobRepository from "../repositories/jobRepository";


class JobService {
    constructor(private jobRepository: JobRepository) { }

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
}

export default JobService;