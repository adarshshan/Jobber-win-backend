import mongoose, { Model, Schema } from "mongoose";


interface MessageInterface {

}
const messageSchema: Schema<MessageInterface> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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
        ref: "user"
    }],
},
    { timestamps: true }
);

const messageModel: Model<MessageInterface> = mongoose.model("message", messageSchema);

export default messageModel;