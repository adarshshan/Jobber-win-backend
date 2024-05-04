import mongoose, { Model, ObjectId, Schema } from "mongoose";

interface ChatInterface {
    chatName: string;
    users: ObjectId[];
    latestMessage: ObjectId;
    groupAdmin: ObjectId;
}
const chatSchema: Schema<ChatInterface> = new Schema({
    chatName: { type: String, trim: true },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true
});

const chatModel: Model<ChatInterface> = mongoose.model<ChatInterface>('chat', chatSchema)

export default chatModel;