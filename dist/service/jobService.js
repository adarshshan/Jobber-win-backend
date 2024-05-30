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
class JobService {
    constructor(jobRepository, userRepository, jobApplicationRepository, jobReportRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobReportRepository = jobReportRepository;
    }
    landingPageJobs(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.landingPageJobs(search);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllJobs(search, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.getAllJobs(search, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSingleJobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.getSingleJobDetails(jobId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    applyJOb(jobId, userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.appliedJob(userId, jobId);
                yield this.userRepository.unsaveJob(userId, jobId);
                return yield this.jobRepository.applyJOb(jobId, userId, formData);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getApplied(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getApplied(userId);
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllApplications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.jobApplicationRepository.getAllApplications(userId, true);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveJobs(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.saveJob(userId, jobId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unSaveJobs(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.unsaveJob(userId, jobId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllSavedJobs(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reportJob(reason, jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobReportRepository.reportJob(reason, jobId, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getJobsByDate(num) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.getJobsByDate(num);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getJobsByExperience(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRepository.getJobsByExperience(start, end);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = JobService;
//# sourceMappingURL=jobService.js.map