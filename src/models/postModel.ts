import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";


export interface PostInterface extends Document {
    userId: ObjectId;
    caption?: string;
    imageUrl?: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema: Schema<PostInterface> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User id is Required!'],
        index: true
    },
    caption: {
        type: String,
    },
    imageUrl: {
        type: String
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