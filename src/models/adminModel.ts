import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export interface AdminInterface extends Document {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
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
});

adminSchema.pre<AdminInterface>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const AdminModel = mongoose.model<AdminInterface>('Admin', adminSchema);
export default AdminModel;
