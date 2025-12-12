import { JobInterface } from "../controllers/recruiterController";
import jobApplicationModel from "../models/jobApplicationModel";
import jobModel from "../models/jobModel";

import { IRecruiterRepository } from "../interfaces/repositoryInterfaces/IRecruiterRepository";
import { NotFoundError, DatabaseError } from "../utils/errors";

class RecruiterRepository implements IRecruiterRepository {
  async getAllJobs(recruiterId: string): Promise<any[]> {
    try {
      const jobs = await jobModel.find({ recruiterId });
      return jobs;
    } catch (error) {
      console.error("Error in getAllJobs:", error);
      throw new DatabaseError(
        `Failed to retrieve jobs for recruiter ID ${recruiterId}.`,
        error as Error
      );
    }
  }
  async postNewJob(data: JobInterface, userId: string): Promise<any> {
    try {
      const newJob = new jobModel({
        ...data,
        recruiterId: userId,
      });
      return await newJob.save();
    } catch (error) {
      console.error("Error in postNewJob:", error);
      throw new DatabaseError(
        `Failed to post new job for recruiter ID ${userId}.`,
        error as Error
      );
    }
  }
  async editJobs(data: JobInterface, jobId: string): Promise<any> {
    try {
      const job = await jobModel.findById(jobId);
      if (!job) {
        throw new NotFoundError(`Job with ID ${jobId} not found for editing.`);
      }
      job.title = data.title || job.title;
      job.company_name = data.company_name || job.company_name;
      job.industry = data.industry || job.industry;
      job.job_img = data.job_img || job.job_img;
      job.description = data.description || job.description;
      job.total_vaccancy = data.total_vaccancy || job.total_vaccancy;
      job.job_type = data.job_type || job.job_type;
      const updatedJob = await job.save();
      return updatedJob;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in editJobs:", error);
      throw new DatabaseError(
        `Failed to edit job with ID ${jobId}.`,
        error as Error
      );
    }
  }
  async deleteJob(jobId: string): Promise<void> {
    // Assuming jobId is passed for deletion
    try {
      const result = await jobModel.findByIdAndDelete(jobId);
      if (!result) {
        throw new NotFoundError(`Job with ID ${jobId} not found for deletion.`);
      }
      console.log("Job deleted successfully");
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in deleteJob:", error);
      throw new DatabaseError(
        `Failed to delete job with ID ${jobId}.`,
        error as Error
      );
    }
  }
  async changeStatus(status: string, applicationId: string): Promise<any> {
    try {
      const application = await jobApplicationModel.findById(applicationId);
      if (!application) {
        throw new NotFoundError(
          `Job application with ID ${applicationId} not found.`
        );
      }
      application.status = status;
      const updatedApplication = await application.save();
      return updatedApplication;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error("Error in changeStatus:", error);
      throw new DatabaseError(
        `Failed to change status for application ID ${applicationId}.`,
        error as Error
      );
    }
  }
}

export default RecruiterRepository;
