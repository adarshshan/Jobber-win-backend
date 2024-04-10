
import { createServer } from '../config/app';
import dotenv from 'dotenv'
import connectDB from '../config/db';

dotenv.config();

connectDB();

const startServer = async () => {
    try {
        const app = createServer();
        app?.listen(5000, () => {
            console.log('connected to the server...');
        })
    } catch (error) {
        console.log(error);
    }
}
startServer();
