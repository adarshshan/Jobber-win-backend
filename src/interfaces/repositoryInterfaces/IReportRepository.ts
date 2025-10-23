import { postReportInterface } from "../../models/postReportModel"; // Assuming PostReportInterface is defined here

export interface IReportRepository {
    reportUser(postId: string, reason: string, userId: string): Promise<{ success: boolean; message: string; data?: postReportInterface }>;
    getAllPostReports(): Promise<any[]>; // Complex return type due to populate
    deletePostReport(reportId: string): Promise<any>;
}