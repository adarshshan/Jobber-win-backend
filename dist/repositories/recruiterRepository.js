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
const jobApplicationModel_1 = __importDefault(require("../models/jobApplicationModel"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
class RecruiterRepository {
    getAllJobs(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel_1.default.find({ recruiterId });
                return jobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    postNewJob(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newJob = new jobModel_1.default(Object.assign(Object.assign({}, data), { recruiterId: userId }));
                return yield newJob.save();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editJobs(data, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield jobModel_1.default.findById(jobId);
                if (job) {
                    job.title = data.title || job.title;
                    job.company_name = data.company_name || job.company_name;
                    job.industry = data.industry || job.industry;
                    job.job_img = data.job_img || job.job_img;
                    job.description = data.description || job.description;
                    job.total_vaccancy = data.total_vaccancy || job.total_vaccancy;
                    job.job_type = data.job_type || job.job_type;
                }
                const updatedJob = yield (job === null || job === void 0 ? void 0 : job.save());
                return updatedJob;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('reached at the end of the line at deleteJob function');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeStatus(status, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = yield jobApplicationModel_1.default.findById(applicationId);
                if (application)
                    application.status = status;
                const updatedApplication = yield (application === null || application === void 0 ? void 0 : application.save());
                return updatedApplication;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = RecruiterRepository;
//# sourceMappingURL=recruiterRepository.js.map