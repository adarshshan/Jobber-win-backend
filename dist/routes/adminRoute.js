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
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminService_1 = __importDefault(require("../service/adminService"));
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const generateToken_1 = require("../utils/generateToken");
const adminAuthMiddleware_1 = __importDefault(require("../middlewares/adminAuthMiddleware"));
const reportRepository_1 = __importStar(require("../repositories/reportRepository"));
const jobRepository_1 = __importDefault(require("../repositories/jobRepository"));
const postRepository_1 = __importDefault(require("../repositories/postRepository"));
const subscriptionRepository_1 = __importDefault(require("../repositories/subscriptionRepository"));
const subscriptionService_1 = __importDefault(require("../service/subscriptionService"));
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const jobApplicationRepository_1 = __importDefault(require("../repositories/jobApplicationRepository"));
const adminRouter = express_1.default.Router();
const encrypt = new comparePassword_1.default();
const createjwt = new generateToken_1.CreateJWT();
const adminReopsitory = new adminRepository_1.default();
const jobRepository = new jobRepository_1.default();
const postRepository = new postRepository_1.default();
const jobReportRepository = new reportRepository_1.JobReportRepository();
const reportRepository = new reportRepository_1.default();
const jobApplicationRepository = new jobApplicationRepository_1.default();
const adminService = new adminService_1.default(adminReopsitory, encrypt, createjwt, jobReportRepository, reportRepository, jobRepository, postRepository, jobApplicationRepository);
const controller = new adminController_1.default(adminService);
//admin login
adminRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.adminLogin(req, res); }));
adminRouter.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.adminSignup(req, res); }));
adminRouter.post('/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.veryfyOtp(req, res); }));
adminRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.adminLogout(req, res); }));
// dashboard
adminRouter.get('/dashboard/bar', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.barChart(req, res); }));
adminRouter.get('/dashboard/line', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.lineChart(req, res); }));
adminRouter.get('/dashboard/pie', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.pieChart(req, res); }));
//users
adminRouter.get('/users', adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.getUserList(req, res); }));
adminRouter.put('/users/block/:userId', adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.blockNunblockUser(req, res); }));
adminRouter.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.sentNotification(req, res); }));
//jobs
adminRouter.get('/all-jobs', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.getUserList(req, res); }));
adminRouter.get('/get-all-jobreports', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.getAllJobReports(req, res); }));
adminRouter.put('/change-report-status/:jobId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.changeReportStatus(req, res); }));
adminRouter.put('/delete-job-report/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.deleteJobReport(req, res); }));
//posts
adminRouter.get('/get-all-postreports', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.getAllPostReports(req, res); }));
adminRouter.put('/change-status-post/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.changePostReportStatus(req, res); }));
adminRouter.put('/delete-post-report/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.deletePostReport(req, res); }));
///subscriptions
const subscriptionRepository = new subscriptionRepository_1.default();
const userRepository = new userRepository_1.default();
const subscriptionService = new subscriptionService_1.default(subscriptionRepository, userRepository);
const subscriptionController = new subscriptionController_1.default(subscriptionService);
adminRouter.get('/subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.getSubscriptionList(req, res); }));
adminRouter.post('/subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.createSubscription(req, res); }));
adminRouter.put('/subscription/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.editSubscription(req, res); }));
adminRouter.delete('/subscription/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.deleteSubscription(req, res); }));
adminRouter.put('/subscription/activate/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.activateSubscription(req, res); }));
adminRouter.put('/subscription/deactivate/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.deactivateSubscription(req, res); }));
exports.default = adminRouter;
//# sourceMappingURL=adminRoute.js.map