"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobReportRepository = void 0;
const jobReportModel_1 = __importDefault(require("../models/jobReportModel"));
const postReportModel_1 = __importDefault(require("../models/postReportModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class ReportRepository {
    reportUser(postId, reason, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postReport = yield postReportModel_1.default.findOne({ $and: [{ reportedBy: userId }, { postId: postId }] });
                if (postReport) {
                    return { success: false, message: 'you are already reported!' };
                }
                else {
                    postReport = new postReportModel_1.default({
                        postId,
                        reportedBy: userId,
                        reason,
                    });
                    yield postReport.save();
                    return { success: true, data: postReport, message: 'Reported successfully!' };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPostReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reports = yield postReportModel_1.default.find({ status: 'open' })
                    .populate('postId')
                    .populate('reportedBy', 'name email profile_picture');
                reports = yield userModel_1.default.populate(reports, {
                    path: 'postId.userId',
                    select: 'name profile_picture headLine email'
                });
                return reports;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deletePostReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let report = yield postReportModel_1.default.findById(reportId);
                if (report) {
                    report.status = 'closed';
                    yield report.save();
                    return report;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ReportRepository;
class JobReportRepository {
    reportJob(reason, jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobReport = yield jobReportModel_1.default.findOne({ $and: [{ reportedBy: userId }, { jobId: jobId }] });
                if (jobReport) {
                    return { success: false, message: 'you are already reported!' };
                }
                else {
                    jobReport = new jobReportModel_1.default({
                        jobId,
                        reportedBy: userId,
                        reason,
                    });
                    yield jobReport.save();
                    return { success: true, data: jobReport, message: 'Reported successfully!' };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllJobReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reports = yield jobReportModel_1.default.find({ status: 'open' })
                    .populate('jobId')
                    .populate('reportedBy', 'name email profile_picture');
                reports = yield jobReportModel_1.default.populate(reports, {
                    path: 'jobId.recruiterId',
                    select: 'name email headLine profile_picture'
                });
                return reports;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteJobReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let report = yield jobReportModel_1.default.findById(reportId);
                if (report) {
                    report.status = 'closed';
                    yield report.save();
                    return report;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.JobReportRepository = JobReportRepository;
//# sourceMappingURL=reportRepository.js.map