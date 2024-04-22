import mongoose, { Schema, Document } from "mongoose";


export interface PostInterface extends Document {
    userId: mongoose.Types.ObjectId;
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

module.exports = mongoose.model('post', postSchema)