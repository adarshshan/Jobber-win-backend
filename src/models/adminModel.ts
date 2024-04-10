import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";


export interface adminInterface extends Document {
    _id?: ObjectId;
    username: string;
    password: string;
    email?: string;
}

const adminSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    }
})

const adminModel = mongoose.model<adminInterface>('admin', adminSchema);
export default adminModel;