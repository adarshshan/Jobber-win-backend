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
const otpGenerator_1 = require("../utils/otpGenerator");
const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
class adminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loginStatus = yield this.adminService.adminLogin(email, password);
                if (loginStatus && !loginStatus.data.success && loginStatus.data.message === 'Incorrect password!') {
                    res.status(UNAUTHORIZED).json({ success: false, message: loginStatus.data.message });
                }
                else {
                    if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object' && 'token' in loginStatus.data) {
                        const time = this.milliseconds(23, 30, 0);
                        res.status(loginStatus.status).cookie('admin_access_token', loginStatus.data.token, {
                            expires: new Date(Date.now() + time),
                            httpOnly: true
                        }).json(loginStatus);
                    }
                    else {
                        res.status(UNAUTHORIZED).json(loginStatus);
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    adminSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminService.adminSignup(req.body);
                if (!admin) {
                    req.app.locals.newAdmin = true;
                    req.app.locals.adminData = req.body;
                    req.app.locals.email = req.body.email;
                    const otp = yield (0, otpGenerator_1.generateAndSendOTP)(req.body.email);
                    req.app.locals.otp = otp;
                    const expirationMinutes = 2;
                    setTimeout(() => {
                        delete req.app.locals.otp;
                    }, expirationMinutes * 60 * 1000);
                    res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'Email is already exist !' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error' });
            }
        });
    }
    veryfyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                const isNewAdmin = req.app.locals.newAdmin;
                const savedAdmin = req.app.locals.adminData;
                if (otp === Number(req.app.locals.otp)) {
                    if (isNewAdmin) {
                        const newAdmin = yield this.adminService.saveAdmin(savedAdmin);
                        req.app.locals = {};
                        res.status(OK).json(newAdmin);
                    }
                    else {
                        res.status(OK).json();
                    }
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
            }
        });
    }
    //................dashboard................//
    barChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.barChart();
                if (result)
                    res.json({ success: true, data: result, message: 'Data fetched successfully' });
                else
                    res.json({ success: false, message: 'Something went wrong while fetching the barchart details' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error occured' });
            }
        });
    }
    lineChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.lineChart();
                if (result)
                    res.json({ success: true, data: result, message: 'Data fetched successfully' });
                else
                    res.json({ success: false, message: "Something went wrong while fetching the lineChart data" });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured' });
            }
        });
    }
    pieChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.pieChart();
                // if (result) res.json({ success: true, data: result, message: 'Data fetched successfully' });
                // else res.json({ success: false, message: 'Something went wrong while fetching the pieChart details!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    //users
    getUserList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const searchQuery = req.query.searchQuery;
                const data = yield this.adminService.getUserList(page, limit, searchQuery);
                res.status(OK).json(data);
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    getAllJobReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.getAllJobReports();
                if (result)
                    res.json({ success: true, data: result, message: 'Successful.' });
                else
                    res.json({ success: false, message: 'Something went wrong while fetching the job report details, please try again!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error Occured!' });
            }
        });
    }
    changeReportStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params.jobId);
                const result = yield this.adminService.changeReportStatus(req.params.jobId);
                if (result)
                    res.json({ success: true, message: 'successfully removed the reported job' });
                else
                    res.json({ success: false, message: 'Something went wrong while removing the reported job!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    deleteJobReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportId = req.params.reportId;
                const result = yield this.adminService.deleteJobReport(reportId);
                if (result)
                    res.json({ success: true, message: 'Job report closed' });
                else
                    res.json({ success: false, message: 'Something went wrong while close the job report' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    deletePostReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportId = req.params.reportId;
                const result = yield this.adminService.deletePostReport(reportId);
                if (result)
                    res.json({ success: true, message: 'Post report closed ' });
                else
                    res.json({ success: false, message: 'Something went wrong while close the post report' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error occured!' });
            }
        });
    }
    changePostReportStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const result = yield this.adminService.changePostReportStatus(postId);
                if (result)
                    res.json({ success: true, message: 'Post removed successfully' });
                else
                    res.json({ success: false, message: 'Something went wrong while removing the post!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    getAllPostReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.getAllPostReports();
                if (result)
                    res.json({ success: true, data: result, message: 'successful' });
                else
                    res.json({ success: false, message: 'Something went wrong while fetching the report details please try again.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    blockNunblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.blockNunblockUser(req.params.userId);
                if (result)
                    res.json({ success: true, message: 'block or unblocked the user' });
                else
                    res.json({ success: false, message: 'Something Went wrong please try again' });
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    adminLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('admin_access_token', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true, message: 'logout sucessfully' });
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    sentNotification(req, res) {
    }
}
exports.default = adminController;
//# sourceMappingURL=adminController.js.map