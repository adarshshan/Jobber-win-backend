"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dbUri = process.env.DB_URI || '';
const connectDB = () => {
    try {
        mongoose_1.default.connect(dbUri).then(() => console.log(`mongodb is connected`));
    }
    catch (error) {
        console.log(error);
        console.log('error from db.ts');
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map