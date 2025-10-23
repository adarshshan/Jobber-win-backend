import mongoose, { Schema, Document } from "mongoose";

export interface ConnectionInterface extends Document {
    userId: mongoose.Types.ObjectId;
    friends: mongoose.Types.ObjectId[];
    requestsSend: mongoose.Types.ObjectId[];
    requestsReceived: mongoose.Types.ObjectId[];
}
const connectionsSchema: Schema<ConnectionInterface> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    requestsSend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    requestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
}, {
    timestamps: true,
});

export default mongoose.model<ConnectionInterface>('connection', connectionsSchema);