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
const mongoose_1 = __importDefault(require("mongoose"));
const jobModel_1 = __importDefault(require("../models/jobModel"));
const jobApplicationModel_1 = __importDefault(require("../models/jobApplicationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class JobRepository {
    landingPageJobs(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyword = search ? {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { company_name: { $regex: search, $options: 'i' } },
                        { industry: { $regex: search, $options: 'i' } },
                        { location: { $regex: search, $options: 'i' } },
                        { job_type: { $regex: search, $options: 'i' } }
                    ]
                } : {};
                const alljobs = yield jobModel_1.default.find(keyword).sort({ createdAt: -1 }).limit(6);
                return alljobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllJobs(search, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyword = search ? {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { company_name: { $regex: search, $options: 'i' } },
                        { industry: { $regex: search, $options: 'i' } },
                        { location: { $regex: search, $options: 'i' } },
                        { job_type: { $regex: search, $options: 'i' } }
                    ]
                } : {};
                // const alljobs = await jobModel.find(keyword).sort({ createdAt: -1 })
                const alljobs = yield jobModel_1.default.find({ $and: [{ isReported: false }, keyword] }).sort({ createdAt: -1 });
                var userSkills = yield userModel_1.default.findOne({ _id: userId }, { skills: 1 });
                if (userSkills)
                    userSkills = userSkills.skills;
                const jobs = yield jobModel_1.default.aggregate([
                    { $match: { isReported: false } },
                    {
                        $addFields: {
                            matchedSkills: {
                                $size: {
                                    $setIntersection: ["$skills", userSkills]
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            matchedSkills: { $gte: 1 }
                        }
                    }
                ]);
                return { jobs, alljobs };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllJobsByskills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel_1.default.aggregate([
                    {
                        $match: {
                            skills: { $in: ['JavaScript', 'React', 'Node.js', 'sql', 'TypeScript', 'express', 'Mongodb'] }
                        }
                    },
                    {
                        $addFields: {
                            matchedSkills: { $setIntersection: ["$skills", ["Mongodb", "sql", "express", "Node.js"]] }
                        }
                    },
                    {
                        $match: {
                            $expr: { $gte: [{ $size: "$matchedSkills" }, 3] }
                        }
                    }
                ]);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSingleJobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield jobModel_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(jobId) } },
                    { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
                    { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
                ]);
                return job[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    applyJOb(jobId, userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobApplication = new jobApplicationModel_1.default(Object.assign(Object.assign({}, formData), { userId,
                    jobId }));
                yield jobApplication.save();
                return jobApplication;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getJobsByDate(num) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel_1.default.find({ updatedAt: { $gte: new Date(Date.now() - parseInt(num) * 24 * 60 * 60 * 1000) } });
                return jobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getJobsByExperience(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobs;
                if (start === '0' && end === '0')
                    jobs = yield jobModel_1.default.find({ experience: 0 });
                else if (end === '0')
                    jobs = yield jobModel_1.default.find({ experience: { $gt: start } });
                else
                    jobs = yield jobModel_1.default.find({ experience: { $gt: start, $lt: end } });
                return jobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeReportStatus(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield jobModel_1.default.findById(jobId);
                if (job) {
                    job.isReported = true;
                    yield job.save();
                    return job;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMonthlyJobPostCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyCount = yield jobModel_1.default.aggregate([
                    {
                        $group: {
                            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1 }
                    }
                ]);
                console.log('Monthly Job Post Count:', monthlyCount);
                return monthlyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getDailyJobPostCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dailyCount = yield jobModel_1.default.aggregate([
                    {
                        $group: {
                            _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                    }
                ]);
                console.log('Daily Job Post Count:', dailyCount);
                return dailyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getYearlyJobPostCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const yearlyCount = yield jobModel_1.default.aggregate([
                    {
                        $group: {
                            _id: { year: { $year: "$createdAt" } },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.year": 1 }
                    }
                ]);
                console.log('Yearly Job Post Count:', yearlyCount);
                return yearlyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = JobRepository;
//# sourceMappingURL=jobRepository.js.map