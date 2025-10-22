import mongoose, { Document, Model, Schema } from "mongoose";

export interface MessageInterface extends Document {
    sender: mongoose.Types.ObjectId;
    contentType: 'sharePost' | 'image' | 'text' | 'videoCall';
    shared_post?: mongoose.Types.ObjectId;
    shared_link?: string;
    content?: string;
    chat: mongoose.Types.ObjectId;
    readBy: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const messageSchema = new Schema<MessageInterface>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        contentType: {
            type: String,
            enum: ['sharePost', 'image', 'text', 'videoCall'],
            default: 'text',
        },
        shared_post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
        shared_link: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chat",
            required: true,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const messageModel: Model<MessageInterface> =
    mongoose.models.message || mongoose.model<MessageInterface>("message", messageSchema);

export default messageModel;