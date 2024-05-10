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