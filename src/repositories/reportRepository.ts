import jobReportModel from "../models/jobReportModel";
import postReportModel from "../models/postReportModel";
import userModel from "../models/userModel";


import { IReportRepository } from "../interfaces/repositoryInterfaces/IReportRepository";
import { IJobReportRepository } from "../interfaces/repositoryInterfaces/IJobReportRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class ReportRepository implements IReportRepository {

    async reportUser(postId: string, reason: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            let postReport = await postReportModel.findOne({ $and: [{ reportedBy: userId }, { postId: postId }] });
            if (postReport) {
                return { success: false, message: 'You have already reported this post!' };
            } else {
                postReport = new postReportModel({
                    postId,
                    reportedBy: userId,
                    reason,
                });
                await postReport.save();
                return { success: true, data: postReport, message: 'Reported successfully!' };
            }
        } catch (error) {
            console.error("Error in reportUser:", error);
            throw new DatabaseError(`Failed to report post ${postId} by user ${userId}.`, error as Error);
        }
    }
    async getAllPostReports(): Promise<any[]> {
        try {
            let reports: any = await postReportModel.find({ status: 'open' })
                .populate('postId')
                .populate('reportedBy', 'name email profile_picture');
            reports = await userModel.populate(reports, {
                path: 'postId.userId',
                select: 'name profile_picture headLine email'
            });
            return reports;
        } catch (error) {
            console.error("Error in getAllPostReports:", error);
            throw new DatabaseError(`Failed to retrieve all post reports.`, error as Error);
        }
    }
    async deletePostReport(reportId: string): Promise<any> {
        try {
            let report = await postReportModel.findById(reportId);
            if (!report) {
                throw new NotFoundError(`Post report with ID ${reportId} not found for deletion.`);
            }
            report.status = 'closed';
            await report.save();
            return report;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deletePostReport:", error);
            throw new DatabaseError(`Failed to delete post report with ID ${reportId}.`, error as Error);
        }
    }
}

export default ReportRepository;

class JobReportRepository implements IJobReportRepository {

    async reportJob(reason: string, jobId: string, userId: string): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            let jobReport = await jobReportModel.findOne({ $and: [{ reportedBy: userId }, { jobId: jobId }] });
            if (jobReport) {
                return { success: false, message: 'You have already reported this job!' };
            } else {
                jobReport = new jobReportModel({
                    jobId,
                    reportedBy: userId,
                    reason,
                });
                await jobReport.save();
                return { success: true, data: jobReport, message: 'Reported successfully!' };
            }
        } catch (error) {
            console.error("Error in reportJob:", error);
            throw new DatabaseError(`Failed to report job ${jobId} by user ${userId}.`, error as Error);
        }
    }
    async getAllJobReports(): Promise<any[]> {
        try {
            let reports = await jobReportModel.find({ status: 'open' })
                .populate('jobId')
                .populate('reportedBy', 'name email profile_picture');
            reports = await jobReportModel.populate(reports, {
                path: 'jobId.recruiterId',
                select: 'name email headLine profile_picture'
            });
            return reports;
        } catch (error) {
            console.error("Error in getAllJobReports:", error);
            throw new DatabaseError(`Failed to retrieve all job reports.`, error as Error);
        }
    }
    async deleteJobReport(reportId: string): Promise<any> {
        try {
            let report = await jobReportModel.findById(reportId);
            if (!report) {
                throw new NotFoundError(`Job report with ID ${reportId} not found for deletion.`);
            }
            report.status = 'closed';
            await report.save();
            return report;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deleteJobReport:", error);
            throw new DatabaseError(`Failed to delete job report with ID ${reportId}.`, error as Error);
        }
    }

}

export { JobReportRepository }