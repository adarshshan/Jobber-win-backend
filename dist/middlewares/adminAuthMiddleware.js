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
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const jwt = new generateToken_1.CreateJWT();
const adminRepository = new adminRepository_1.default();
dotenv_1.default.config();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.admin_access_token;
        if (!token)
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        const decoded = jwt.verifyToken(token);
        if (decoded) {
            let user = yield adminRepository.getAdminById(decoded.toString());
            req.adminId = decoded.toString();
            next();
        }
        else {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
        }
    }
    catch (err) {
        console.log(err);
        console.log('error is in the catch block!');
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
});
exports.default = adminAuth;
//# sourceMappingURL=adminAuthMiddleware.js.map