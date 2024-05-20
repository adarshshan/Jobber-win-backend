import jobModel from "../models/jobModel";
import jobReportModel from "../models/jobReportModel";
import postReportModel from "../models/postReportModel";
import userModel from "../models/userModel";


class ReportRepository {

    async reportUser(postId: string, reason: string, userId: string) {
        try {
            let postReport = await postReportModel.findOne({ $and: [{ reportedBy: userId }, { postId: postId }] });
            if (postReport) {
                return { success: false, message: 'you are already reported!' }
            } else {
                postReport = new postReportModel({
                    postId,
                    reportedBy: userId,
                    reason,
                })
                await postReport.save();
                return { success: true, data: postReport, message: 'Reported successfully!' }
            }
        } catch (error) {
            console.log(error as Error)
        }
    }
    async getAllPostReports() {
        try {
            let reports: any = await postReportModel.find({ status: 'open' })
                .populate('postId')
                .populate('reportedBy', 'name email profile_picture');
            reports = await userModel.populate(reports, {
                path: 'postId.userId',
                select: 'name profile_picture headLine email'
            })
            return reports;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deletePostReport(reportId: string) {
        try {
            let report = await postReportModel.findById(reportId);
            if (report) {
                report.status = 'closed'
                await report.save();
                return report;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default ReportRepository;

class JobReportRepository {

    async reportJob(reason: string, jobId: string, userId: string) {
        try {
            console.log(userId, jobId, reason);
            let jobReport = await jobReportModel.findOne({ $and: [{ reportedBy: userId }, { jobId: jobId }] });
            if (jobReport) {
                return { success: false, message: 'you are already reported!' }
            } else {
                jobReport = new jobReportModel({
                    jobId,
                    reportedBy: userId,
                    reason,
                })
                await jobReport.save();
                return { success: true, data: jobReport, message: 'Reported successfully!' }
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllJobReports() {
        try {
            let reports = await jobReportModel.find({ status: 'open' })
                .populate('jobId')
                .populate('reportedBy', 'name email profile_picture')
            reports = await jobReportModel.populate(reports, {
                path: 'jobId.recruiterId',
                select: 'name email headLine profile_picture'
            })
            return reports;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJobReport(reportId: string) {
        try {
            let report = await jobReportModel.findById(reportId);
            if (report) {
                report.status = 'closed'
                await report.save();
                return report;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }

}

export { JobReportRepository }