import mongoose, { Model, Schema, Types } from "mongoose";

interface IlikedUsers {
    userId: string;
}
interface LikeDocument extends Document {
    postId: string;
    likedUsers: IlikedUsers[];
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema: Schema<LikeDocument> = new Schema({
    postId: {
        type: String,
        ref: 'post',
        required: [true, "Post ID is required"],
    },
    likedUsers: [{
        userId: {
            type: String,
            ref: 'User',
            required: [true, "User ID is required"],
        }
    }],
    likeCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
});

likeSchema.pre('save', async function (next) {
    try {
        this.likeCount = this.likedUsers.length;
        next();
    } catch (error) {
        console.log(error as Error);
        next(error as Error);
        console.log('here is the error')
    }
})




const LikeModel: Model<LikeDocument> = mongoose.model<LikeDocument>('like', likeSchema)
export default LikeModel;