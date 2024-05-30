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
class RecruiterController {
    constructor(recruiterService) {
        this.recruiterService = recruiterService;
    }
    getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.recruiterService.getAllJobs(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'All jobs fetched successfully' });
                    else
                        res.json({ success: false, message: 'Somthing went wrong while fetching the jobs!' });
                }
                else
                    res.json({ success: false, message: 'Authentication Error occurred' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    postNewJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { data } = req.body;
                if (userId) {
                    const isSubscribed = yield this.recruiterService.isSubscribed(userId);
                    console.log(isSubscribed);
                    console.log('this is the isSubscribed anwer..');
                    if (isSubscribed === null || isSubscribed === void 0 ? void 0 : isSubscribed.success) {
                        const result = yield this.recruiterService.postNewJob(data, userId);
                        if (result)
                            res.json({ success: true, data: result, message: 'Job posted successfully' });
                        else
                            res.json({ success: false, message: 'Somthing went wrong while posting the job!' });
                    }
                    else
                        res.json(isSubscribed);
                }
                else
                    res.json({ success: false, message: 'Authentication Error!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal Server error occured' });
            }
        });
    }
    editJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { data, jobId } = req.body;
                if (userId) {
                    const result = yield this.recruiterService.editJobs(data, jobId);
                    if (result)
                        res.json({ success: true, data: result, message: 'job details updated' });
                    else
                        res.json({ success: false, message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error!' });
            }
        });
    }
    getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.recruiterService.getAllApplications(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'success' });
                    else
                        res.json({ success: false, message: 'Something went wrong while fetching the applications' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal SErver error occured!' });
            }
        });
    }
    changeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, applicationId } = req.params;
                const result = yield this.recruiterService.changeStatus(status, applicationId);
                if (result)
                    res.json({ success: true, data: result, message: 'success' });
                else
                    res.json({ success: false, message: 'Something went wrong while approve/remove' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Inernal Server Error occured!' });
            }
        });
    }
    getGraphData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.recruiterService.getGraphData(userId);
                    if (result)
                        res.json({ success: true, data: result, message: 'Graph data Fetched successfully' });
                    else
                        res.json({ success: false, message: 'Something went wrong!' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
}
exports.default = RecruiterController;
//# sourceMappingURL=recruiterController.js.map