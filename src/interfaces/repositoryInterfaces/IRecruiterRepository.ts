import { JobApplicationInterface } from "../../models/jobApplicationModel"; // Assuming JobApplicationInterface is defined here
import { JobModelInterface } from "../../models/jobModel"; // Assuming JobModelInterface is defined here
import { JobInterface } from "../../controllers/recruiterController";

export interface IRecruiterRepository {
    getAllJobs(recruiterId: string): Promise<JobModelInterface[]>;
    postNewJob(data: JobInterface, userId: string): Promise<JobModelInterface>;
    editJobs(data: JobInterface, jobId: string): Promise<JobModelInterface>;
    deleteJob(jobId: string): Promise<void>;
    changeStatus(status: string, applicationId: string): Promise<JobApplicationInterface>;
}