import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

// const dbUri: string = process.env.DB_URI || '';
const dbUri: string = 'mongodb+srv://adarshshanu3:VxhaGlchhmB1EsHf@cluster0.prhw6yx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// console.log(dbUri);
const connectDB = async () => {
    try {
        mongoose.connect(dbUri).then(() => console.log('mongodb Connected.'));
    } catch (error) {
        console.log(error);
        console.log('error from db.ts');
    }
}
export default connectDB;