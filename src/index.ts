import http from 'http'
import { createServer } from '../config/app';
import dotenv from 'dotenv'
import connectDB from '../config/db';
import socketServer from '../config/socket';

dotenv.config();

connectDB();

const startServer = async () => {
    try {
        const app = createServer();
        const server: any | undefined = http.createServer(app);
        if (server) socketServer(server);
        server.listen(5000, () => {
            console.log('connected to the server...');
        })
    } catch (error) {
        console.log(error);
    }
}
startServer();
