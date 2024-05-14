import mongoose, { Model, ObjectId, Schema } from "mongoose";

interface ChatInterface {
    chatName: string;
    isGroupChat: boolean;
    users: ObjectId[];
    latestMessage: ObjectId;
    groupAdmin: ObjectId;
}
const chatSchema: Schema<ChatInterface> = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

const chatModel: Model<ChatInterface> = mongoose.model<ChatInterface>('chat', chatSchema)

export default chatModel;