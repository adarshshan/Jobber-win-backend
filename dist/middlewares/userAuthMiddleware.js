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
const dotenv_1 = __importDefault(require("dotenv"));
const generateToken_1 = require("../utils/generateToken");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const { UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
const jwt = new generateToken_1.CreateJWT();
const userRepository = new userRepository_1.default();
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let token = req.cookies.access_token;
    let refresh_token = req.cookies.refresh_token;
    if (!refresh_token)
        return res.json({ success: false, message: 'Token expired or not available' });
    if (!token) {
        const newAccessToken = yield refreshAccessToken(refresh_token);
        const accessTokenMaxAge = 30 * 60 * 1000;
        res.cookie('access_token', newAccessToken, {
            maxAge: accessTokenMaxAge,
            sameSite: 'none',
            secure: true
        });
    }
    try {
        token = req.cookies.access_token;
        const decoded = jwt.verifyToken(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.success) {
            let user = yield userRepository.getUserById((_b = (_a = decoded.decoded) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString());
            if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                return res.json({ success: false, message: "User is blocked by admin!" });
            }
            else {
                req.userId = (_d = (_c = decoded.decoded) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.toString();
                req.user = user;
                next();
            }
        }
        else {
            return res.json({ success: false, message: decoded === null || decoded === void 0 ? void 0 : decoded.message });
        }
    }
    catch (err) {
        console.log('the error is here.');
        console.log(err);
        return res.send({ success: false, message: "Authentication failed!" });
    }
});
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!refreshToken)
            throw new Error('No refresh token found');
        const decoded = jwt.verifyRefreshToken(refreshToken);
        const newAccessToken = jwt.generateToken(decoded === null || decoded === void 0 ? void 0 : decoded.decoded.data);
        return newAccessToken;
    }
    catch (error) {
        console.log(error);
        throw new Error('Invalid refresh token');
    }
});
exports.default = userAuth;
//# sourceMappingURL=userAuthMiddleware.js.map