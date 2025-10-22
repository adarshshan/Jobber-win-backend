import { Document } from "mongoose";
import { JobApplicationInterface } from "../../models/jobApplicationModel"; // Assuming JobApplicationInterface is defined here
import { JobModelInterface } from "../../models/jobModel"; // Assuming JobModelInterface is defined here
import { JobInterface } from "../../controllers/recruiterController";

export interface IRecruiterRepository {
    getAllJobs(recruiterId: string): Promise<(JobModelInterface & Document)[] | undefined>;
    postNewJob(data: JobInterface, userId: string): Promise<(JobModelInterface & Document) | undefined>;
    editJobs(data: JobInterface, jobId: string): Promise<(JobModelInterface & Document) | undefined>;
    deleteJob(): Promise<void>; // Based on the current implementation, it doesn't return anything meaningful
    changeStatus(status: string, applicationId: string): Promise<(JobApplicationInterface & Document) | undefined>;
}