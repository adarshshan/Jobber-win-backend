import mongoose, { Document, Schema } from "mongoose";

interface CommentInterface extends Document {
    postId: Schema.Types.ObjectId;
    comments: Array<{
        text: string;
        userId: string;
        createdAt: Date;
        replies?: Array<{
            text?: string | undefined;
            userId?: string | undefined;
            createdAt?: Date | undefined;
        }> | undefined;
    }>;
    commentCount?: number | undefined;
    latestComments?: Array<{
        text: string | undefined;
        userId: string | undefined;
        createdAt?: Date | undefined;
    }> | undefined;
}

const commentSchema: Schema<CommentInterface> = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: [true, "Post ID is required"]
    },
    comments: [{
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
            type: mongoose.Schema.Types.ObjectId,
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


const commentModel = mongoose.model<CommentInterface>('comment', commentSchema)

export default commentModel;