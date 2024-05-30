"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("../dist/routes/userRoute"));
const adminRoute_1 = __importDefault(require("../dist/routes/adminRoute"));
const recruiterRoute_1 = __importDefault(require("../dist/routes/recruiterRoute"));
const chatRoute_1 = __importDefault(require("../dist/routes/chatRoute"));
const messageRoute_1 = __importDefault(require("../dist/routes/messageRoute"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cors_1.default)({ origin: process.env.CORS_URL, credentials: true }));
        app.use((0, cookie_parser_1.default)());
        app.get('/testing', (req, res) => res.send('Hello Wolrd '));
        app.use('/api/user', userRoute_1.default);
        app.use('/api/admin', adminRoute_1.default);
        app.use('/api/recruiter', recruiterRoute_1.default);
        app.use('/api/chat', chatRoute_1.default);
        app.use('/api/messages', messageRoute_1.default);
        return app;
    }
    catch (error) {
        console.log(error);
        console.log('error caught from app.ts');
    }
};
exports.createServer = createServer;
//# sourceMappingURL=app.js.map