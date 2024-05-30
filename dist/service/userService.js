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
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
class userService {
    constructor(userRepository, encrypt, createjwt, reportRepository) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
        this.reportRepository = reportRepository;
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.emailExistCheck(email);
                const token = this.createjwt.generateToken(user === null || user === void 0 ? void 0 : user.id);
                const refreshToken = this.createjwt.generateRefreshToken(user === null || user === void 0 ? void 0 : user.id);
                if (user && user.isBlocked) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'You have been blocked by the admin !',
                            token: token,
                            data: user,
                            refreshToken: refreshToken,
                        }
                    };
                }
                if ((user === null || user === void 0 ? void 0 : user.password) && password) {
                    const passwordMatch = yield this.encrypt.compare(password, user.password);
                    if (passwordMatch) {
                        const token = this.createjwt.generateToken(user.id);
                        const refreshToken = this.createjwt.generateRefreshToken(user.id);
                        return {
                            status: OK,
                            data: {
                                success: true,
                                message: 'Authentication Successful !',
                                data: user,
                                userId: user.id,
                                token: token,
                                refreshToken: refreshToken
                            }
                        };
                    }
                    else {
                        return {
                            status: UNAUTHORIZED,
                            data: {
                                success: false,
                                message: 'Authentication failed...',
                            }
                        };
                    }
                }
            }
            catch (error) {
                console.log(error);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server Error!',
                    }
                };
            }
        });
    }
    userSignup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.emailExistCheck(userData.email);
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
                const user = yield this.userRepository.saveUser(userData);
                if (user) {
                    const token = this.createjwt.generateToken(user === null || user === void 0 ? void 0 : user.id);
                    const refreshToken = this.createjwt.generateRefreshToken(user === null || user === void 0 ? void 0 : user.id);
                    return {
                        status: OK,
                        data: {
                            success: true,
                            message: 'Success',
                            userId: userData.id,
                            token: token,
                            data: user,
                            refreshToken
                        }
                    };
                }
            }
            catch (error) {
                console.log(error);
                return { status: INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal server error' } };
            }
        });
    }
    changeAboutInfo(id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const changed = yield this.userRepository.changeAboutInfo(id, text);
                return changed;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    setProfilePic(pic, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.setProfilePic(pic, id);
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reportUser(postId, reason, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reportRepository.reportUser(postId, reason, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteProfilePic(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.deleteProfilePic(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.emailExistCheck(email);
        });
    }
    generateToken(payload) {
        if (payload)
            return this.createjwt.generateToken(payload);
    }
    generateRefreshToken(payload) {
        if (payload)
            return this.createjwt.generateRefreshToken(payload);
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.encrypt.hashPassword(password);
        });
    }
    getProfile(id) {
        try {
            if (!id)
                return null;
            return this.userRepository.getUserById(id);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    addSkill(id, skill) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.addSkill(id, skill);
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllSkill(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllSkill(userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeSkill(id, skill) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.removeSkill(id, skill);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateNewPassword(password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateNewPassword(password, userId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = userService;
//# sourceMappingURL=userService.js.map