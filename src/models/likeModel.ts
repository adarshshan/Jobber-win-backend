import mongoose, { Model, Schema, Types } from "mongoose";

interface LikeDocument extends Document {
    postId: Types.ObjectId;
    likedUsers: Types.ObjectId[];
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}
const likeSchema: Schema<LikeDocument> = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Post ID is required"],
        index: true,
        unique: true
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
        unique: true
    }],
    likeCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
});

likeSchema.pre('save', async function (next) {
    this.likeCount = this.likedUsers.length;
    next();
})

const LikeModel: Model<LikeDocument> = mongoose.model<LikeDocument>('like', likeSchema)
export default LikeModel;