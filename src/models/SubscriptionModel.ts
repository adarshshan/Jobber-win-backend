import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface SubscriptionPlanInterface extends Document {
    _id: ObjectId,
    duration: number,
    amount: number,
    planName: string,
    status: string,
    description:string
}

const subscriptionSchema: Schema = new Schema({
    duration: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
})

const SubscriptionModel = mongoose.model<SubscriptionPlanInterface>('subscription', subscriptionSchema)
export default SubscriptionModel