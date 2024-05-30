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
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
class AdminService {
    constructor(adminReopsitory, encrypt, createjwt, jobReportRepository, reportRepository, jobRepository, postRepository, jobApplicationRepository) {
        this.adminReopsitory = adminReopsitory;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
        this.jobReportRepository = jobReportRepository;
        this.reportRepository = reportRepository;
        this.jobRepository = jobRepository;
        this.postRepository = postRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminReopsitory.isAdminExist(email);
            if ((admin === null || admin === void 0 ? void 0 : admin.password) && password) {
                const passwordMatch = yield this.encrypt.compare(password, admin.password);
                if (passwordMatch) {
                    const token = this.createjwt.generateToken(admin.id);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        data: {
                            success: true,
                            message: 'Authentication Successful !',
                            data: admin,
                            adminId: admin.id,
                            token: token
                        }
                    };
                }
                else {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'Incorrect password!'
                        }
                    };
                }
            }
        });
    }
    adminSignup(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminReopsitory.isAdminExist(adminData.email);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    saveAdmin(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminReopsitory.saveAdmin(adminData);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        success: true,
                        message: 'Success',
                        adminId: admin === null || admin === void 0 ? void 0 : admin.id
                    }
                };
            }
            catch (error) {
                console.log(error);
                return { status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal Error.' } };
            }
        });
    }
    barChart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthly = yield this.jobApplicationRepository.getMonthlyApplicationCount();
                const dayly = yield this.jobApplicationRepository.getDailyApplicationCount();
                const yearly = yield this.jobApplicationRepository.getYearlyApplicationCount();
                return { day: dayly, month: monthly, year: yearly };
            }
            catch (error) {
                console.log(error);
                throw new Error('Something went wrong');
            }
        });
    }
    lineChart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthly = yield this.jobRepository.getMonthlyJobPostCount();
                const dayly = yield this.jobRepository.getDailyJobPostCount();
                const yearly = yield this.jobRepository.getYearlyJobPostCount();
                return { day: dayly, month: monthly, year: yearly };
            }
            catch (error) {
                console.log(error);
                throw new Error('Something went wrong');
            }
        });
    }
    pieChart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserList(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (isNaN(page))
                    page = 1;
                if (isNaN(limit))
                    limit = 10;
                if (!searchQuery)
                    searchQuery = '';
                const users = yield this.adminReopsitory.getUserList(page, limit, searchQuery);
                const usersCount = yield this.adminReopsitory.getUserCount(searchQuery);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: { users, usersCount },
                    message: 'success',
                };
            }
            catch (error) {
                console.log(error);
                throw new Error('Error occured.');
            }
        });
    }
    blockNunblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminReopsitory.blockNunblockUser(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllJobReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobReportRepository.getAllJobReports();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPostReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reportRepository.getAllPostReports();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeReportStatus(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.changeReportStatus(jobId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteJobReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobReportRepository.deleteJobReport(reportId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deletePostReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reportRepository.deletePostReport(reportId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePostReportStatus(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepository.changePostReportStatus(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = AdminService;
//# sourceMappingURL=adminService.js.map