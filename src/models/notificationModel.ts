import mongoose, { Model, ObjectId, Schema } from "mongoose";

interface NotificationInterface {
}
const notificationSchema: Schema<NotificationInterface> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: [{
        type: String,
        required: true,
    }],
    Notifications: [{
        title: { type: String },
        body: { type: String }
    }],
}, {
    timestamps: true
});

const notificationModel: Model<NotificationInterface> = mongoose.model<NotificationInterface>('notification', notificationSchema)

export default notificationModel;