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
const jobApplicationModel_1 = __importDefault(require("../models/jobApplicationModel"));
class JobApplicationRepository {
    getAllApplications(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, userSide = false) {
            try {
                const applications = yield jobApplicationModel_1.default.find(userSide ? { userId } : {})
                    .populate("userId", "-password")
                    .populate({
                    path: 'jobId',
                    populate: {
                        path: 'recruiterId'
                    }
                }).sort({ createdAt: -1 });
                if (userSide)
                    return applications;
                const result = applications.filter((item) => {
                    return item.jobId.recruiterId._id == userId;
                });
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMonthlyApplicationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyCount = yield jobApplicationModel_1.default.aggregate([
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
                return monthlyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getDailyApplicationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dailyCount = yield jobApplicationModel_1.default.aggregate([
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
                return dailyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getYearlyApplicationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const yearlyCount = yield jobApplicationModel_1.default.aggregate([
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
                return yearlyCount;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getGraphData(recruiterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ObjectId = mongoose_1.default.Types.ObjectId;
                const UserId = new ObjectId(recruiterId);
                const res = yield jobApplicationModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "jobId",
                            foreignField: "_id",
                            as: "jobDetails"
                        }
                    },
                    {
                        $unwind: "$jobDetails"
                    },
                    {
                        $match: {
                            "jobDetails.recruiterId": UserId
                        }
                    },
                    {
                        $group: {
                            _id: {
                                day: { $dayOfMonth: "$createdAt" },
                                month: { $month: "$createdAt" },
                                year: { $year: "$createdAt" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                    }
                ]);
                return res;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = JobApplicationRepository;
//# sourceMappingURL=jobApplicationRepository.js.map