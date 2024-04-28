import RecruiterRepository from "../repositories/recruiterRepository";


class RecruiterService {
    constructor(private recruiterRepository: RecruiterRepository) { }

    async getAllJobs() {
        try {
            return await this.recruiterRepository.getAllJobs();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postNewJob() {
        try {
            return await this.recruiterRepository.postNewJob();
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
    async editJobs() {
        try {
            return await this.recruiterRepository.editJobs();
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterService;