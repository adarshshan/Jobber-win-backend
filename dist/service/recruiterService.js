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
class RecruiterService {
    constructor(recruiterRepository, jobApplicationRepository, userRepository, subscriptionRepository) {
        this.recruiterRepository = recruiterRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }
    getAllJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.recruiterRepository.getAllJobs(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isSubscribed(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = yield this.userRepository.getUserById(userId);
                if (user) {
                    let subId = (_a = user.subscription) === null || _a === void 0 ? void 0 : _a.sub_Id;
                    let start = (_b = user.subscription) === null || _b === void 0 ? void 0 : _b.purchased_At;
                    if (subId) {
                        let subscr = yield this.subscriptionRepository.getSubscriptionById(subId);
                        let duration = subscr === null || subscr === void 0 ? void 0 : subscr.duration;
                        let status = subscr === null || subscr === void 0 ? void 0 : subscr.status;
                        if (status === 'inactive')
                            return { success: false, message: 'This plan is deactivated. please purchase another one.' };
                        if (start) {
                            const date = new Date(start);
                            let expireDate = new Date(date);
                            if (duration) {
                                expireDate.setMonth(date.getMonth() + duration);
                                if (new Date(expireDate).getTime() < Date.now())
                                    return { success: false, message: 'Your Subscription plan is Expired! Please purchase another plan.' };
                            }
                        }
                    }
                    else
                        return { success: false, message: 'you are not purchased any subscription plans. please purchase a plan and continue' };
                }
                else
                    return { success: false, message: 'user not found!' };
                return { success: true, message: 'user has the valid subscription plan.' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    postNewJob(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.recruiterRepository.postNewJob(data, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editJobs(data, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.recruiterRepository.editJobs(data, jobId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.recruiterRepository.deleteJob();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllApplications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobApplicationRepository.getAllApplications(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeStatus(status, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.recruiterRepository.changeStatus(status, applicationId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getGraphData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobApplicationRepository.getGraphData(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = RecruiterService;
//# sourceMappingURL=recruiterService.js.map