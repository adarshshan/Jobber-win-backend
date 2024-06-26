import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface jobReportInterface extends Document {
    jobId: ObjectId;
    reason: string;
    reportedBy: ObjectId;
    status: string;
}
const jobReportSchema: Schema = new Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'job'
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

const jobReportModel = mongoose.model<jobReportInterface>('jobReport', jobReportSchema);

export default jobReportModel;
