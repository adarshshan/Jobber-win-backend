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
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class AdminRepository {
    isAdminExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield adminModel_1.default.findOne({ email: email });
            if (admin)
                return admin;
            else
                return null;
        });
    }
    saveAdmin(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newAdmin = new adminModel_1.default(adminData);
                yield newAdmin.save();
                return newAdmin;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getUserList(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, 'i');
                const result = yield userModel_1.default.find({
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .select('-password')
                    .exec();
                return result;
            }
            catch (error) {
                console.log(error);
                throw new Error('Error occured');
            }
        });
    }
    getUserCount(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, 'i');
                return yield userModel_1.default.find({
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }).countDocuments();
            }
            catch (error) {
                console.log(error);
                throw new Error('Error occured');
            }
        });
    }
    blockNunblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (user) {
                    user.isBlocked = !(user === null || user === void 0 ? void 0 : user.isBlocked);
                    yield user.save();
                    return user;
                }
                else {
                    throw new Error('Somthing went wrong!!!');
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield adminModel_1.default.findById(id);
                return admin;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = AdminRepository;
//# sourceMappingURL=adminRepository.js.map