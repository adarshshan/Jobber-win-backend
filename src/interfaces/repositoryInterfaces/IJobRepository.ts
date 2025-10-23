import { JobBodyInterface } from "../../controllers/jobController";
import { JobModelInterface } from "../../models/jobModel"; // Assuming JobModelInterface is defined here

export interface IJobRepository {
    landingPageJobs(search: string | undefined): Promise<JobModelInterface[]>;
    getAllJobs(search: string | undefined, userId: string): Promise<{ jobs: any[]; alljobs: JobModelInterface[] }>;
    getAllJobsByskills(): Promise<any[]>; // Return type is complex, leaving as any for now
    getSingleJobDetails(jobId: string): Promise<any>; // Return type is complex due to lookup, leaving as any for now
    applyJOb(jobId: string, userId: string, formData: JobBodyInterface): Promise<any>;
    getJobsByDate(num: string): Promise<JobModelInterface[]>;
    getJobsByExperience(start: string, end: string): Promise<JobModelInterface[]>;
    changeReportStatus(jobId: string): Promise<JobModelInterface>;
    getMonthlyJobPostCount(): Promise<any[]>;
    getDailyJobPostCount(): Promise<any[]>;
    getYearlyJobPostCount(): Promise<any[]>;
}