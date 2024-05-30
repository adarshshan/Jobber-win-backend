"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    headLine: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    qualification: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    aboutInfo: {
        type: String,
    },
    gender: {
        type: String
    },
    role: {
        type: String
    },
    profile_picture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png"
    },
    cover_image: {
        type: String,
        default: "https://img.freepik.com/free-photo/grunge-black-concrete-textured-background_53876-124541.jpg"
    },
    location: {
        type: String
    },
    subscription: {
        sub_Id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'subscription' },
        purchased_At: { type: Date }
    },
    savedJobs: [
        {
            jobId: { type: String, ref: 'job' },
            savedAt: { type: Date, default: Date.now }
        }
    ],
    appliedJobs: [
        {
            jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'job' },
            appliedAt: { type: Date, default: Date.now }
        }
    ],
    skills: [{
            type: String
        }]
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        return next();
    });
});
userSchema.methods.matchPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enteredPassword, this.password);
    });
};
const userModel = mongoose_1.default.model('User', userSchema);
exports.default = userModel;
//# sourceMappingURL=userModel.js.map