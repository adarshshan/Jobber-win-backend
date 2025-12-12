import { JobInterface } from "../controllers/recruiterController";
import { IJobApplicationRepository } from "../interfaces/repositoryInterfaces/IJobApplicationRepository";
import { IRecruiterRepository } from "../interfaces/repositoryInterfaces/IRecruiterRepository";
import { ISubscriptionRepository } from "../interfaces/repositoryInterfaces/ISubscriptionRepository";
import UserRepository from "../repositories/userRepository";
import { NotFoundError, DatabaseError } from "../utils/errors";

class RecruiterService {
  constructor(
    private recruiterRepository: IRecruiterRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private userRepository: UserRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async getAllJobs(userId: string): Promise<any[]> {
    try {
      return await this.recruiterRepository.getAllJobs(userId);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in getAllJobs:", error);
      throw new Error(
        "An unexpected error occurred while retrieving all jobs."
      ); // Re-throw generic error
    }
  }
  async isSubscribed(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.getUserById(userId); // This will now throw NotFoundError if user not found

      let subId = user.subscription?.sub_Id;
      let start = user.subscription?.purchased_At;

      if (!subId) {
        return {
          success: false,
          message:
            "You have not purchased any subscription plans. Please purchase a plan and continue.",
        };
      }

      const subscr = await this.subscriptionRepository.getSubscriptionById(
        subId
      ); // This will now throw NotFoundError if subscription not found

      let duration = subscr.duration;
      let status = subscr.status;

      if (status === "inactive") {
        return {
          success: false,
          message: "This plan is deactivated. Please purchase another one.",
        };
      }

      if (start) {
        const date = new Date(start);
        let expireDate = new Date(date);
        if (duration) {
          expireDate.setMonth(date.getMonth() + duration);
          if (new Date(expireDate).getTime() < Date.now()) {
            return {
              success: false,
              message:
                "Your Subscription plan is Expired! Please purchase another plan.",
            };
          }
        }
      }
      return { success: true, message: "User has a valid subscription plan." };
    } catch (error) {
      if (error instanceof NotFoundError) {
        return {
          success: false,
          message: error.message || "User or subscription not found.",
        };
      } else if (error instanceof DatabaseError) {
        console.error("Database error in isSubscribed:", error);
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in isSubscribed:", error);
      throw new Error(
        "An unexpected error occurred while checking subscription status."
      ); // Re-throw generic error
    }
  }
  async postNewJob(data: JobInterface, userId: string): Promise<any> {
    console.log("its reached here...");
    try {
      return await this.recruiterRepository.postNewJob(data, userId);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in postNewJob:", error);
      throw new Error("An unexpected error occurred while posting new job."); // Re-throw generic error
    }
  }
  async editJobs(data: JobInterface, jobId: string): Promise<any> {
    try {
      return await this.recruiterRepository.editJobs(data, jobId);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in editJobs:", error);
      throw new Error("An unexpected error occurred while editing job."); // Re-throw generic error
    }
  }
  async deleteJob(jobId: string): Promise<void> {
    try {
      await this.recruiterRepository.deleteJob(jobId);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in deleteJob:", error);
      throw new Error("An unexpected error occurred while deleting job."); // Re-throw generic error
    }
  }
  async getAllApplications(userId: string): Promise<any[]> {
    try {
      return await this.jobApplicationRepository.getAllApplications(userId);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in getAllApplications:", error);
      throw new Error(
        "An unexpected error occurred while retrieving all applications."
      ); // Re-throw generic error
    }
  }
  async changeStatus(status: string, applicationId: string): Promise<any> {
    try {
      return await this.recruiterRepository.changeStatus(status, applicationId);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in changeStatus:", error);
      throw new Error(
        "An unexpected error occurred while changing application status."
      ); // Re-throw generic error
    }
  }
  async getGraphData(userId: string): Promise<any> {
    try {
      return await this.jobApplicationRepository.getGraphData(userId);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error; // Re-throw specific errors
      }
      console.error("Unexpected error in getGraphData:", error);
      throw new Error(
        "An unexpected error occurred while retrieving graph data."
      ); // Re-throw generic error
    }
  }
}

export default RecruiterService;
