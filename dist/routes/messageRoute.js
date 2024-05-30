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
const messageRepository_1 = __importDefault(require("../repositories/messageRepository"));
const messageService_1 = __importDefault(require("../service/messageService"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const userAuthMiddleware_1 = __importDefault(require("../middlewares/userAuthMiddleware"));
const messageRouter = express_1.default.Router();
const messageRepository = new messageRepository_1.default();
const messageService = new messageService_1.default(messageRepository);
const controller = new messageController_1.default(messageService);
messageRouter.post('/', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.sendMessage(req, res); }));
messageRouter.get('/:chatId', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.allMessages(req, res); }));
messageRouter.post('/sharepost', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.sharePostMessage(req, res); }));
messageRouter.post('/share-video-link', userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.shareVideoLink(req, res); }));
exports.default = messageRouter;
//# sourceMappingURL=messageRoute.js.map