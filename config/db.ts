import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const dbUri: string = process.env.DB_URI || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUri).then(() => console.log('mongodb Connected.'));
    } catch (error) {
        console.log(error);
        console.log('error from de.ts');
    }
}
export default connectDB;