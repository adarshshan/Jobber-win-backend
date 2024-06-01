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
const express_1 = __importDefault(require("express"));
const userAuthMiddleware_1 = __importDefault(require("../middlewares/userAuthMiddleware"));
const recruiterRepository_1 = __importDefault(require("../repositories/recruiterRepository"));
const recruiterService_1 = __importDefault(require("../service/recruiterService"));
const recruiterController_1 = __importDefault(require("../controllers/recruiterController"));
const jobApplicationRepository_1 = __importDefault(require("../repositories/jobApplicationRepository"));
const subscriptionRepository_1 = __importDefault(require("../repositories/subscriptionRepository"));
const subscriptionService_1 = __importDefault(require("../service/subscriptionService"));
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const recruiterRouter = express_1.default.Router();
const jobApplicationRepository = new jobApplicationRepository_1.default();
const recruiterRepository = new recruiterRepository_1.default();
const subscriptionRepository = new subscriptionRepository_1.default();
const userRepository = new userRepository_1.default();
const recruiterService = new recruiterService_1.default(recruiterRepository, jobApplicationRepository, userRepository, subscriptionRepository);
const recruiterController = new recruiterController_1.default(recruiterService);
recruiterRouter.get('/get-alljobs', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.getAllJobs(req, res); }));
recruiterRouter.post('/post-new-job', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.postNewJob(req, res); }));
// recruiterRouter.delete('/delete-job', async (req: Request, res: Response) => recruiterController.deleteJob(req, res));
recruiterRouter.put('/edit-jobs', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.editJobs(req, res); }));
recruiterRouter.get('/get-all-applications', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.getAllApplications(req, res); }));
recruiterRouter.put('/change-application-states/:status/:applicationId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.changeStatus(req, res); }));
recruiterRouter.get('/change-application/graph', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return recruiterController.getGraphData(req, res); }));
// Subscription
const subscriptionService = new subscriptionService_1.default(subscriptionRepository, userRepository);
const subscriptionController = new subscriptionController_1.default(subscriptionService);
recruiterRouter.get('/get-subscriptions', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.getAllSubscriptions(req, res); }));
recruiterRouter.post('/payment-subscription', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.subscriptionPayment(req, res); }));
recruiterRouter.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.webHook(req, res); }));
recruiterRouter.get('/current-subscriptions', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return subscriptionController.getCurrentSubscription(req, res); }));
exports.default = recruiterRouter;
//# sourceMappingURL=recruiterRoute.js.map