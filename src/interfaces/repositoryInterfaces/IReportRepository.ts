import { Document } from "mongoose";
import { postReportInterface } from "../../models/postReportModel"; // Assuming PostReportInterface is defined here

export interface IReportRepository {
    reportUser(postId: string, reason: string, userId: string): Promise<{ success: boolean; message: string; data?: (postReportInterface & Document) } | undefined>;
    getAllPostReports(): Promise<any[] | undefined>; // Complex return type due to populate
    deletePostReport(reportId: string): Promise<(postReportInterface & Document) | undefined>;
}