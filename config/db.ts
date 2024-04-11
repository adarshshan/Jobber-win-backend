import mongoose from 'mongoose';
import { config } from 'dotenv';

config()

const dbUri: string = process.env.DB_URI || '';
console.log(dbUri);
const connectDB = () => {
    try {
        mongoose.connect(dbUri).then(() => console.log(`mongodb is connected`));
    } catch (error) {
        console.log(error);
        console.log('error from db.ts');
    }
}
export default connectDB;