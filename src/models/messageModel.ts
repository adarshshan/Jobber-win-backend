import mongoose, { Model, Schema } from "mongoose";


interface MessageInterface {

}
const messageSchema: Schema<MessageInterface> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    contentType: {
        type: String,
        enum: ['sharePost', 'image', 'text'],
        default: 'text'
    },
    shared_post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    content: {
        type: String, trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},
    { timestamps: true }
);

const messageModel: Model<MessageInterface> = mongoose.model("message", messageSchema);

export default messageModel;