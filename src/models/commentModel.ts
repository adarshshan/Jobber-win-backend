import { Schema } from "mongoose";

const mongoose = require("mongoose");
interface CommentInterface extends Document {
    postId: Schema.Types.ObjectId;
    comments: Array<{
        text: string;
        userId: Schema.Types.ObjectId;
        createdAt: Date;
        replies: Array<{
            text: string;
            userId: Schema.Types.ObjectId;
            createdAt: Date;
        }>;
    }>;
    commentCount: number;
    latestComments: Array<{
        text: string;
        userId: Schema.Types.ObjectId;
        createdAt?: Date;
    }>;
}

const commentSchema: Schema<CommentInterface> = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: [true, "Post ID is required"],
        index: true
    },
    comments: [{
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            text: {
                type: String,
                trim: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        createdAt: {
            type: Date
        }
    }]
}, {
    timestamps: true,
});

commentSchema.pre('save', function (next) {
    let commentCount = 0;
    this.comments.forEach(comment => {
        commentCount++;
        commentCount += comment.replies.length;
    });
    this.commentCount = commentCount;
    this.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this.latestComments = this.comments.slice(0, 2);
    next();
});

module.exports = mongoose.model('Comment', commentSchema);