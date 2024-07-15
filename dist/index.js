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
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const app_1 = require("./config/app");
const socket_1 = __importDefault(require("./config/socket"));
const SERVER = process.env.SERVER || `https://jobber-win-backend.onrender.com`;
dotenv_1.default.config();
(0, db_1.default)();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = (0, app_1.createServer)();
        const server = http_1.default.createServer(app);
        if (server)
            (0, socket_1.default)(server);
        server.listen(5000, () => {
            console.log('connected to the server...');
        });
    }
    catch (error) {
        console.log(error);
    }
});
// Cron job to send request every 2 minutes
node_cron_1.default.schedule("*/.5 * * * *", () => {
    axios_1.default
        .get(SERVER)
        .then((response) => {
        console.log(`Request sent successfully at ${new Date()}`);
    })
        .catch((error) => {
        console.error(`Error sending request: ${error.message}`);
    });
});
startServer();
//# sourceMappingURL=index.js.map