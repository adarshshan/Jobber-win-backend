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
class JobController {
    constructor(jobService) {
        this.jobService = jobService;
    }
    landingPageJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let search = req.query.search;
                const jobs = yield this.jobService.landingPageJobs(search);
                if (jobs)
                    res.json({ success: true, data: jobs, message: 'messages fetched successfully' });
                else
                    res.json({ success: false, message: 'Something went wrong!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const search = req.query.search;
                if (userId) {
                    const result = yield this.jobService.getAllJobs(search, userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Successfully fetched all job details' });
                    else
                        res.json({ success: false, message: "somthing went wrong while fetching the job details!" });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    getSingleJobDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const result = yield this.jobService.getSingleJobDetails(jobId);
                if (result)
                    res.json({ success: true, data: result, message: 'success' });
                else
                    res.json({ success: false, message: 'somthing trouble while fetching the job details' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    applyJOb(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const userId = req.userId;
                const formData = req.body;
                if (userId && jobId) {
                    const result = yield this.jobService.applyJOb(jobId, userId, formData);
                    if (result)
                        res.json({ success: true, data: result, message: 'Job application has send' });
                    else
                        res.json({ success: false, message: 'Somthing went wrong while applying the job!' });
                }
                else
                    res.json({ success: false, message: 'userId or jobId is not available!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getApplied(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.jobService.getApplied(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Successful' });
                    else
                        res.json({ success: false, message: 'Sorry there is not any applied jobs!' });
                }
                else
                    res.json({ success: false, message: 'userId is not available!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.jobService.getAllApplications(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'success' });
                    else
                        res.json({ success: false, message: 'Something went wrong while fetching the details!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error!' });
            }
        });
    }
    saveJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { jobId } = req.params;
                if (userId) {
                    const result = yield this.jobService.saveJobs(userId, jobId);
                    return res.json(result);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unSaveJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { jobId } = req.params;
                if (userId) {
                    const result = yield this.jobService.unSaveJobs(userId, jobId);
                    if (result)
                        res.json({ success: true, data: result, message: 'job removed from the list.' });
                    else
                        res.json({ success: false, message: 'something went wrong while removing the saved job!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal Server error occured!' });
            }
        });
    }
    getAllSavedJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.jobService.getAllSavedJobs(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Data fetched successfully' });
                    else
                        res.json({ success: false, message: 'something went wrong!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error' });
            }
        });
    }
    reportJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reason } = req.body;
                const { jobId } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.jobService.reportJob(reason, jobId, userId);
                    res.json(result);
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server Error' });
            }
        });
    }
    getJobsByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { num } = req.params;
                if (num) {
                    const result = yield this.jobService.getJobsByDate(num);
                    if (result)
                        res.json({ success: true, data: result, message: 'successful' });
                    else
                        res.json({ success: false, message: 'Something went wrong!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Inernal server Error!' });
            }
        });
    }
    getJobsByExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { start, end } = req.params;
                const result = yield this.jobService.getJobsByExperience(start, end);
                if (result)
                    res.json({ success: true, data: result, message: 'successful' });
                else
                    res.json({ success: false, message: 'Something went wrong...' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
}
exports.default = JobController;
//# sourceMappingURL=jobController.js.map