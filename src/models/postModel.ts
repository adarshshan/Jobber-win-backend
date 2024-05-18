import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";


export interface PostInterface extends Document {
    userId: ObjectId;
    caption?: string;
    imageUrl?: string;
    isDeleted: boolean;
    isReported: boolean;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema: Schema<PostInterface> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is Required!'],
        index: true
    },
    caption: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    isReported: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});


const PostModel: Model<PostInterface> = mongoose.model<PostInterface>('post', postSchema)
export default PostModel;