import jobReportModel from "../models/jobReportModel";
import postReportModel from "../models/postReportModel";


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
}

export { JobReportRepository }