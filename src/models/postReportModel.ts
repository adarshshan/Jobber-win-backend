import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface postReportInterface extends Document {
    postId: ObjectId;
    reason: string;
    reportedBy: ObjectId;
    status: string;
}
const postReportSchema: Schema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'post'
    },
    reason: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
    timestamps: true
});

const postReportModel = mongoose.model<postReportInterface>('postReport', postReportSchema);

export default postReportModel;
