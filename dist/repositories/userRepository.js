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
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository {
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield userModel_1.default.findOne({ email: email });
                return userFound;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(userData);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAllUsers(search, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyword = search ? {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ]
                } : {};
                const allUsers = yield userModel_1.default.find(keyword).find({ _id: { $ne: userId } });
                return allUsers;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findById(id);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getApplied(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const ObjectId = mongoose_1.default.Types.ObjectId;
                const UserId = new ObjectId(userId);
                const user = yield userModel_1.default.aggregate([
                    { $match: { _id: UserId } },
                    { $unwind: "$appliedJobs" },
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "appliedJobs.jobId",
                            foreignField: "_id",
                            as: "appliedJobs.jobDetails"
                        }
                    },
                    {
                        $addFields: {
                            "appliedJobs.jobDetails": { $arrayElemAt: ["$appliedJobs.jobDetails", 0] }
                        }
                    },
                    { $sort: { "appliedJobs.appliedAt": -1 } },
                    {
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            email: { $first: "$email" },
                            role: { $first: "$role" },
                            profile_picture: { $first: "$profile_picture" },
                            cover_image: { $first: "$cover_image" },
                            skills: { $first: "$skills" },
                            aboutInfo: { $first: "$aboutInfo" },
                            appliedJobs: { $push: "$appliedJobs" }
                        }
                    }
                ]);
                if (((_a = user[0]) === null || _a === void 0 ? void 0 : _a.appliedJobs) === undefined)
                    return [];
                else
                    return (_b = user[0]) === null || _b === void 0 ? void 0 : _b.appliedJobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeAboutInfo(id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield userModel_1.default.findByIdAndUpdate(id, { aboutInfo: text }, { new: true });
                if (updated)
                    return text;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    setProfilePic(pic, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield userModel_1.default.findByIdAndUpdate(id, { profile_picture: pic });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteProfilePic(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.default.updateOne({ _id: userId }, { $set: { profile_picture: "" } });
                return updatedUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addSkill(id, skill) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield userModel_1.default.findOneAndUpdate({ _id: id }, { $addToSet: { skills: skill } });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllSkill(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userModel_1.default.findOne({ _id: userId }, { _id: 0, skills: 1 });
                const skills = data === null || data === void 0 ? void 0 : data.skills;
                return skills;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeSkill(id, skill) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield userModel_1.default.updateOne({ _id: id }, { $pull: { skills: skill } });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (user) {
                    user.name = name || user.name;
                    user.phoneNumber = phoneNumber || user.phoneNumber;
                    user.gender = gender || user.gender;
                    user.location = location || user.location;
                    user.headLine = headLine || user.headLine;
                    user.qualification = qualification || user.qualification;
                }
                const updatedUser = yield (user === null || user === void 0 ? void 0 : user.save());
                return updatedUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateNewPassword(password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (user)
                    user.password = password;
                const updatedUser = yield (user === null || user === void 0 ? void 0 : user.save());
                return updatedUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const User = yield userModel_1.default.findById(userId);
                if (User) {
                    let savedJobs;
                    if ((_a = User.savedJobs) === null || _a === void 0 ? void 0 : _a.length) {
                        savedJobs = User === null || User === void 0 ? void 0 : User.savedJobs.some(user => user.jobId === jobId);
                    }
                    if (!savedJobs) {
                        const user = yield userModel_1.default.findByIdAndUpdate(userId, { $addToSet: { savedJobs: { jobId: jobId } } }, { new: true });
                        return { success: true, data: user, message: 'successfully saved the job' };
                    }
                    else
                        return { success: false, message: 'already saved the job' };
                }
                else
                    return { success: false, message: `unauthorized user, couldn't load the saved list` };
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    unsaveJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findByIdAndUpdate(userId, { $pull: { savedJobs: { jobId: jobId } } }, { new: true });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getAllSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const allData = yield userModel_1.default.findById(userId)
                    .populate('savedJobs.jobId');
                const savedJobs = (_a = allData === null || allData === void 0 ? void 0 : allData.savedJobs) === null || _a === void 0 ? void 0 : _a.map((item) => item.jobId);
                return savedJobs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    appliedJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findByIdAndUpdate(userId, { $push: { appliedJobs: { jobId: jobId } } }, { new: true });
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    //.............subscription//................
    updateSubPlan(userId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.default.findByIdAndUpdate(userId, { $set: { subscription: { sub_Id: item._id, purchased_At: Date.now() } } }, { new: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=userRepository.js.map