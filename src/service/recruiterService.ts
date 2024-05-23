import { JobInterface } from "../controllers/recruiterController";
import JobApplicationRepository from "../repositories/jobApplicationRepository";
import RecruiterRepository from "../repositories/recruiterRepository";
import SubscriptionRepository from "../repositories/subscriptionRepository";
import UserRepository from "../repositories/userRepository";


class RecruiterService {
    constructor(
        private recruiterRepository: RecruiterRepository,
        private jobApplicationRepository: JobApplicationRepository,
        private userRepository: UserRepository,
        private subscriptionRepository: SubscriptionRepository) { }

    async getAllJobs(userId: string) {
        try {
            return await this.recruiterRepository.getAllJobs(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async isSubscribed(userId: string) {
        try {
            const user = await this.userRepository.getUserById(userId);
            if (user) {
                let subId = user.subscription?.sub_Id;
                let start = user.subscription?.purchased_At;
                if (subId) {
                    let subscr = await this.subscriptionRepository.getSubscriptionById(subId);
                    let duration = subscr?.duration;
                    let status = subscr?.status;
                    if (status === 'inactive') return { success: false, message: 'This plan is deactivated. please purchase another one.' };
                    if (start) {
                        const date = new Date(start);
                        let expireDate = new Date(date);
                        if (duration) {
                            expireDate.setMonth(date.getMonth() + duration);
                            if (new Date(expireDate).getTime() < Date.now()) return { success: false, message: 'Your Subscription plan is Expired! Please purchase another plan.' };
                        }
                    }
                } else return { success: false, message: 'you are not purchased any subscription plans. please purchase a plan and continue' };
            } else return { success: false, message: 'user not found!' };
            return { success: true, message: 'user has the valid subscription plan.' };
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
    async getGraphData(userId: string) {
        try {
            return await this.jobApplicationRepository.getGraphData(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterService;