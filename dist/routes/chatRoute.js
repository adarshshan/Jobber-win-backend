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
const chatRepository_1 = __importDefault(require("../repositories/chatRepository"));
const chatService_1 = __importDefault(require("../service/chatService"));
const chatController_1 = __importDefault(require("../controllers/chatController"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const express_1 = __importDefault(require("express"));
const userAuthMiddleware_1 = __importDefault(require("../middlewares/userAuthMiddleware"));
const chatRouter = express_1.default.Router();
const chatRepository = new chatRepository_1.default();
const userRepository = new userRepository_1.default();
const chatService = new chatService_1.default(chatRepository, userRepository);
const controller = new chatController_1.default(chatService);
chatRouter.post('/', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.accessChat(req, res); }));
chatRouter.get('/', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.fetchChats(req, res); }));
chatRouter.post('/group', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.createGroupchat(req, res); }));
chatRouter.put('/rename', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.renameGroup(req, res); }));
chatRouter.put('/groupadd', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.addToGroup(req, res); }));
chatRouter.put('/groupremove', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.removeFromGroup(req, res); }));
exports.default = chatRouter;
//# sourceMappingURL=chatRoute.js.map