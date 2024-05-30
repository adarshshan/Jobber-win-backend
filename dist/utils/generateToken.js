"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = require('jsonwebtoken');
dotenv_1.default.config();
class CreateJWT {
    generateToken(payload) {
        if (payload) {
            const token = jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: '5m' });
            return token;
        }
    }
    generateRefreshToken(payload) {
        return jwt.sign({ data: payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '48h' });
    }
    verifyToken(token) {
        try {
            let secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            return { success: true, decoded };
        }
        catch (err) {
            console.error('Error while verifying JWT token:', err);
            if ((err === null || err === void 0 ? void 0 : err.name) === 'TokenExpiredError')
                return { success: false, message: 'Token Expired!' };
            else
                return { success: false, message: 'Internal server error' };
        }
    }
    verifyRefreshToken(token) {
        try {
            let secret = process.env.JWT_REFRESH_SECRET;
            const decoded = jwt.verify(token, secret);
            return { success: true, decoded };
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.CreateJWT = CreateJWT;
//# sourceMappingURL=generateToken.js.map