import { Document } from "mongoose";
import { jobReportInterface } from "../../models/jobReportModel"; // Assuming JobReportInterface is defined here

export interface IJobReportRepository {
    reportJob(reason: string, jobId: string, userId: string): Promise<{ success: boolean; message: string; data?: (jobReportInterface & Document) } | undefined>;
    getAllJobReports(): Promise<any[] | undefined>; // Complex return type due to populate
    deleteJobReport(reportId: string): Promise<(jobReportInterface & Document) | undefined>;
}