import mongoose from 'mongoose';
import { config } from 'dotenv';

config()

const dbUri: string = process.env.DB_URI || '';
console.log(process.env);
console.log('this is the env datas...');
const connectDB = (): void => {
    try {
        mongoose.connect(dbUri).then(() => console.log(`mongodb is connected`));
    } catch (error) {
        console.log(error as Error);
        console.log('error from db.ts');
    }
}
export default connectDB;