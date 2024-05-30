"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const userService_1 = __importDefault(require("../service/userService"));
const userAuthMiddleware_1 = __importDefault(require("../middlewares/userAuthMiddleware"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const generateToken_1 = require("../utils/generateToken");
const postRepository_1 = __importDefault(require("../repositories/postRepository"));
const postService_1 = __importDefault(require("../service/postService"));
const postController_1 = __importDefault(require("../controllers/postController"));
const networkController_1 = __importDefault(require("../controllers/networkController"));
const networkService_1 = __importDefault(require("../service/networkService"));
const networkRepository_1 = __importDefault(require("../repositories/networkRepository"));
const jobRepository_1 = __importDefault(require("../repositories/jobRepository"));
const jobService_1 = __importDefault(require("../service/jobService"));
const jobController_1 = __importDefault(require("../controllers/jobController"));
const jobApplicationRepository_1 = __importDefault(require("../repositories/jobApplicationRepository"));
const reportRepository_1 = __importStar(require("../repositories/reportRepository"));
const CommentRepository_1 = __importDefault(require("../repositories/CommentRepository"));
const chatRepository_1 = __importDefault(require("../repositories/chatRepository"));
const userRouter = express_1.default.Router();
const encrypt = new comparePassword_1.default();
const createjwt = new generateToken_1.CreateJWT();
const reportRepository = new reportRepository_1.default();
const userRepository = new userRepository_1.default();
const userServices = new userService_1.default(userRepository, encrypt, createjwt, reportRepository);
const controller = new userController_1.default(userServices);
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.userLogin(req, res); }));
userRouter.post('/google-login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.googleLogin(req, res, next); }));
userRouter.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.userSingnup(req, res); }));
userRouter.get('/resend-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.resendOtp(req, res); }));
userRouter.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.ForgotresentOtp(req, res); }));
userRouter.post('/verify-forgot-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.VerifyForgotOtp(req, res); }));
userRouter.put('/update-newpassword', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.updateNewPassword(req, res); }));
userRouter.post('/veryfy-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.veryfyOtp(req, res); }));
userRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.logout(req, res); }));
userRouter.get('/profile', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.getProfile(req, res); }));
userRouter.put('/edit-user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.editUserDetails(req, res); }));
userRouter.put('/edit-about/:id', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.changeAboutInfo(req, res); }));
userRouter.put('/set-profile', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.setProfilePic(req, res); }));
userRouter.delete('/delete-profile/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.deleteProfilePic(req, res); }));
userRouter.patch('/add-skill/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.addSkill(req, res); }));
userRouter.get('/get-skills/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.getAllSkill(req, res); }));
userRouter.delete('/remove-skill/:skill/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.removeSkill(req, res); }));
userRouter.patch('/set-profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.setProfilePic(req, res); }));
userRouter.post('/report-user/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield controller.reportUser(req, res); }));
//postController
const postRepository = new postRepository_1.default();
const commentRepository = new CommentRepository_1.default();
const chatRepository = new chatRepository_1.default();
const postService = new postService_1.default(postRepository, commentRepository, chatRepository);
const postController = new postController_1.default(postService);
userRouter.post('/new-post', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.savePost(req, res); }));
userRouter.get('/getposts/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getPosts(req, res); }));
userRouter.get('/get-posts-home', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getPostForHome(req, res); }));
userRouter.put('/like-post/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.likePost(req, res); }));
userRouter.delete('/like-post/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.unLikePost(req, res); }));
userRouter.get('/like-post/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getLikes(req, res); }));
userRouter.post('/comment/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.sendComment(req, res); }));
userRouter.get('/comment/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getComment(req, res); }));
userRouter.put('/reply-comment/:commentId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.replyComment(req, res); }));
userRouter.delete('/delete-post/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.deletePost(req, res); }));
userRouter.put('/postcaption-edit/:postId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.updateCaption(req, res); }));
userRouter.get('/share-post-suggession', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.postShareSuggestedUsers(req, res); }));
userRouter.get('/get-post-details/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getSinglePostDetails(req, res); }));
//netWorkcontroller
const networkRepository = new networkRepository_1.default();
const networkService = new networkService_1.default(networkRepository, userRepository);
const networkController = new networkController_1.default(networkService);
userRouter.get('/get-alluser', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getAllUsers(req, res); }));
userRouter.get('/get-user-profile/:userId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getUserProfile(req, res); }));
userRouter.get('/get-user-posts/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getUserPostsById(req, res); }));
userRouter.post('/sendrequest', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.sendRequest(req, res); }));
userRouter.delete('/withdraw-request/:id', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.withdrawSentRequest(req, res); }));
userRouter.get('/getsend-requests', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getAllsendRequests(req, res); }));
userRouter.get('/getallrequests', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getAllRequests(req, res); }));
userRouter.put('/add-tofriend/:friendId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.addToFriend(req, res); }));
userRouter.put('/remove-request/:id', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.removeRequest(req, res); }));
userRouter.get('/get-friends', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.getAllFriends(req, res); }));
userRouter.delete('/unfriend/:id', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield networkController.unFriend(req, res); }));
//JobController
const jobApplicationRepository = new jobApplicationRepository_1.default();
const jobReportRepository = new reportRepository_1.JobReportRepository();
const jobRepository = new jobRepository_1.default();
const jobService = new jobService_1.default(jobRepository, userRepository, jobApplicationRepository, jobReportRepository);
const jobController = new jobController_1.default(jobService);
userRouter.get('/get-jobs', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.landingPageJobs(req, res); }));
userRouter.get('/get-all-jobs', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getAllJobs(req, res); }));
userRouter.get('/get-single-jobs/:jobId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getSingleJobDetails(req, res); }));
userRouter.post('/apply-job/:jobId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.applyJOb(req, res); }));
userRouter.get('/get-saved-applied-jobs', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getApplied(req, res); }));
userRouter.get('/get-all-application', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getAllApplications(req, res); }));
userRouter.put('/save-job/:jobId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.saveJobs(req, res); }));
userRouter.delete('/save-job/:jobId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.unSaveJobs(req, res); }));
userRouter.get('/savedjobs', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getAllSavedJobs(req, res); }));
userRouter.post('/report-job/:jobId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.reportJob(req, res); }));
userRouter.get('/getjobs/:num', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getJobsByDate(req, res); }));
userRouter.get('/getjobs-by-experience/:start/:end', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobController.getJobsByExperience(req, res); }));
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map