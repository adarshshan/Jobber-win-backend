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
const otpGenerator_1 = require("../utils/otpGenerator");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = httpStatusCodes_1.STATUS_CODES;
class userController {
    constructor(userServices) {
        this.userServices = userServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loginStatus = yield this.userServices.userLogin(email, password);
                console.log(loginStatus);
                if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object' && 'token' in loginStatus.data) {
                    if (!loginStatus.data.success) {
                        res.status(UNAUTHORIZED).json({ success: false, message: loginStatus.data.message });
                        return;
                    }
                    const time = this.milliseconds(23, 30, 0);
                    const access_token = loginStatus.data.token;
                    const refresh_token = loginStatus.data.refreshToken;
                    const accessTokenMaxAge = 5 * 60 * 1000;
                    const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                    res.status(loginStatus.status).cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).json(loginStatus);
                }
                else {
                    res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication error' });
                }
            }
            catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, googlePhotoUrl } = req.body;
            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
            try {
                const user = yield this.userServices.getUserByEmail(email);
                if (user) {
                    if (user.isBlocked) {
                        res.status(UNAUTHORIZED).json({ success: false, message: 'user has been blocked by admin.' });
                        // throw new Error('user has been blocked by admin...');
                    }
                    else {
                        const token = this.userServices.generateToken(user.id);
                        const refreshToken = this.userServices.generateRefreshToken(user.id);
                        const data = {
                            success: true,
                            message: 'Success',
                            userId: user.id,
                            token: token,
                            refreshToken,
                            data: user
                        };
                        // const time = this.milliseconds(23, 30, 0);
                        res.status(OK).cookie('access_token', token, {
                            maxAge: accessTokenMaxAge
                        }).cookie('refresh_token', refreshToken, {
                            maxAge: refreshTokenMaxAge
                        }).json(data);
                    }
                }
                else {
                    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                    const hashedPassword = yield this.userServices.hashPassword(generatedPassword);
                    const newUser = yield this.userServices.saveUser({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        profile_picture: googlePhotoUrl
                    });
                    if (newUser === null || newUser === void 0 ? void 0 : newUser.data.data) {
                        // const time = this.milliseconds(23, 30, 0);
                        res.status(OK).cookie('access_token', newUser.data.token, {
                            maxAge: accessTokenMaxAge
                        }).cookie('refresh_token', newUser.data.refreshToken, {
                            maxAge: refreshTokenMaxAge,
                        }).json(newUser.data);
                    }
                }
            }
            catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error......' });
            }
        });
    }
    userSingnup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.userData = req.body;
                const newUser = yield this.userServices.userSignup(req.app.locals.userData);
                if (!newUser) {
                    req.app.locals.newUser = true;
                    req.app.locals.userData = req.body;
                    req.app.locals.userEmail = req.body.email;
                    const otp = yield (0, otpGenerator_1.generateAndSendOTP)(req.body.email);
                    req.app.locals.userOtp = otp;
                    const expirationMinutes = 5;
                    setTimeout(() => {
                        delete req.app.locals.userOtp;
                    }, expirationMinutes * 60 * 1000);
                    res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.app.locals.userEmail;
                const otp = yield (0, otpGenerator_1.generateAndSendOTP)(email);
                req.app.locals.userOtp = otp;
                req.app.locals.resendOtp = otp;
                const expirationMinutes = 5;
                setTimeout(() => {
                    delete req.app.locals.userOtp;
                    delete req.app.locals.resendOtp;
                }, expirationMinutes * 60 * 1000);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ForgotresentOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                req.app.locals.userEmail = email;
                if (!email)
                    return res.status(BAD_REQUEST).json({ success: false, message: 'please enter the email' });
                const user = yield this.userServices.getUserByEmail(email);
                if (!user)
                    return res.status(BAD_REQUEST).json({ success: false, message: 'user with email is not exist!' });
                const otp = yield (0, otpGenerator_1.generateAndSendOTP)(email);
                req.app.locals.resendOtp = otp;
                const expirationMinutes = 5;
                setTimeout(() => {
                    delete req.app.locals.resendOtp;
                }, expirationMinutes * 60 * 1000);
                res.status(OK).json({ success: true, data: user, message: 'OTP sent for verification...' });
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
    VerifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = req.body.otp;
                if (!otp)
                    return res.json({ success: false, message: 'Please enter the otp!' });
                if (!req.app.locals.resendOtp)
                    return res.json({ success: false, message: 'Otp is expired!' });
                if (otp === req.app.locals.resendOtp)
                    res.json({ success: true, message: 'both otp are same.' });
                else
                    res.json({ success: false, message: 'Entered otp is not correct!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    updateNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, userId } = req.body;
                const result = yield this.userServices.updateNewPassword(password, userId);
                console.log(result);
                if (result)
                    res.json({ success: true, data: result, message: 'successful' });
                else
                    res.json({ success: false, message: 'somthing went wrong!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    veryfyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                const isNuewUser = req.app.locals.newUser;
                const savedUser = req.app.locals.userData;
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                if (otp === Number(req.app.locals.userOtp)) {
                    if (isNuewUser) {
                        const newUser = yield this.userServices.saveUser(savedUser);
                        req.app.locals = {};
                        // const time = this.milliseconds(23, 30, 0);
                        res.status(OK).cookie('access_token', newUser === null || newUser === void 0 ? void 0 : newUser.data.token, {
                            maxAge: accessTokenMaxAge
                        }).cookie('refresh_token', isNuewUser.data.refresh_token, {
                            maxAge: refreshTokenMaxAge
                        }).json(newUser);
                    }
                    else {
                        const time = this.milliseconds(23, 30, 0);
                        res.status(OK).cookie('access_token', isNuewUser.data.token, {
                            maxAge: accessTokenMaxAge
                        }).cookie('refresh_token', isNuewUser.data.refresh_token, {
                            maxAge: refreshTokenMaxAge
                        }).json({ success: true, message: 'old user verified' });
                    }
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield this.userServices.getProfile(req.userId);
                if (!currentUser)
                    res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed..!' });
                else if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isBlocked)
                    res.status(UNAUTHORIZED).json({ success: false, message: 'user has been blocked by the admin!' });
                else
                    res.status(OK).json(currentUser);
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    editUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { name, phoneNumber, gender, location, headLine, qualification } = req.body;
                const result = yield this.userServices.editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId);
                if (result)
                    res.json({ success: true, data: result, message: 'details successfully updated.' });
                else
                    res.json({ success: false, message: 'Failed to update the details' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Failed to update' });
            }
        });
    }
    changeAboutInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const text = req.body.aboutInfo;
                const id = req.params.id;
                const edited = yield this.userServices.changeAboutInfo(id, text);
                res.json({ success: true, about: edited, message: 'about information successfully updated.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Failed to update the about information!' });
            }
        });
    }
    setProfilePic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pic, id } = req.body;
                const result = yield this.userServices.setProfilePic(pic, id);
                res.json(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reportUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reason } = req.body;
                const { postId } = req.params;
                const userId = req.userId;
                if (userId) {
                    const result = yield this.userServices.reportUser(postId, reason, userId);
                    return res.json(result);
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured...' });
            }
        });
    }
    deleteProfilePic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const result = this.userServices.deleteProfilePic(userId);
                if (result)
                    res.json({ success: true, data: result, message: 'profile pic removed' });
                else
                    res.json({ success: false, message: "couldn't remove your profile pic" });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'somthing went wrong while removing the profile pic' });
            }
        });
    }
    addSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skill } = req.body;
                const { id } = req.params;
                const result = yield this.userServices.addSkill(id, skill);
                if (result)
                    res.json({ success: true, data: result, message: 'skill added successfully..' });
                else
                    res.json({ success: false, message: 'Something went wrong while adding the skill' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal error occured while adding the skill..' });
            }
        });
    }
    getAllSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userServices.getAllSkill(id);
                res.json({ success: true, data: result, message: 'success' });
                // else res.json({ success: false, message: 'somthing went wrong.' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'somthing went wrong.' });
            }
        });
    }
    removeSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skill, id } = req.params;
                return yield this.userServices.removeSkill(id, skill);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('forgot password password...');
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('change password...');
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('access_token', '', {
                    maxAge: 0
                }).cookie('refresh_token', '', {
                    maxAge: 0
                });
                res.status(200).json({ success: true, message: 'user logout - clearing cookie' });
            }
            catch (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = userController;
//# sourceMappingURL=userController.js.map