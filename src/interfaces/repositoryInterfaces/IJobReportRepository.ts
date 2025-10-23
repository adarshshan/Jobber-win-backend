import { jobReportInterface } from "../../models/jobReportModel"; // Assuming JobReportInterface is defined here

export interface IJobReportRepository {
    reportJob(reason: string, jobId: string, userId: string): Promise<{ success: boolean; message: string; data?: jobReportInterface }>;
    getAllJobReports(): Promise<any[]>; // Complex return type due to populate
    deleteJobReport(reportId: string): Promise<any>;
}