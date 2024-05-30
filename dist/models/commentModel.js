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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const commentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'post',
        required: [true, "Post ID is required"]
    },
    comments: [{
            _id: {
                type: String,
                default: (0, uuid_1.v4)()
            },
            text: {
                type: String,
                required: [true, "Comment text is required"],
                trim: true
            },
            userId: {
                type: String,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
            replies: [{
                    text: {
                        type: String,
                        trim: true
                    },
                    userId: {
                        type: String,
                        ref: 'User'
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now
                    }
                }]
        }],
    commentCount: {
        type: Number,
        default: 0
    },
    latestComments: [{
            text: {
                type: String,
                trim: true
            },
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date
            }
        }]
}, {
    timestamps: true,
});
commentSchema.pre('save', function (next) {
    this.commentCount = this.comments.length;
    this.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this.latestComments = this.comments.slice(0, 2);
    next();
});
const commentModel = mongoose_1.default.model('comment', commentSchema);
exports.default = commentModel;
//# sourceMappingURL=commentModel.js.map