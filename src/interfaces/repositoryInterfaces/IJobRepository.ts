import { Document } from "mongoose";
import { JobBodyInterface } from "../../controllers/jobController";
import { JobInterface } from "../../controllers/recruiterController";

export interface IJobRepository {
    landingPageJobs(search: string | undefined): Promise<JobInterface[] | undefined | null>;
    getAllJobs(search: string | undefined, userId: string): Promise<{ jobs: (JobInterface & Document)[], alljobs: (JobInterface & Document)[] } | undefined>;
    getAllJobsByskills(): Promise<any>; // Return type is complex, leaving as any for now
    getSingleJobDetails(jobId: string): Promise<any | undefined>; // Return type is complex due to lookup, leaving as any for now
    applyJOb(jobId: string, userId: string, formData: JobBodyInterface): Promise<Document | undefined>;
    getJobsByDate(num: string): Promise<(JobInterface & Document)[] | undefined>;
    getJobsByExperience(start: string, end: string): Promise<(JobInterface & Document)[] | undefined>;
    changeReportStatus(jobId: string): Promise<(JobInterface & Document) | undefined>;
    getMonthlyJobPostCount(): Promise<any[] | undefined>;
    getDailyJobPostCount(): Promise<any[] | undefined>;
    getYearlyJobPostCount(): Promise<any[] | undefined>;
}