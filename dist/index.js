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
const app_1 = require("../config/app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
const socket_1 = __importDefault(require("../config/socket"));
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
startServer();
//# sourceMappingURL=index.js.map