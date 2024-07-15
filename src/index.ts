import http from 'http'
import { createServer } from '../config/app';
import dotenv from 'dotenv'
import connectDB from '../config/db';
import socketServer from '../config/socket';
import axios from 'axios';
import cron from "node-cron";

const SERVER = process.env.SERVER || `https://jobber-win-backend.onrender.com`;

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
// Cron job to send request every 2 minutes
cron.schedule("*/.5 * * * *", () => {
    axios
        .get(SERVER)
        .then((response) => {
            console.log(`Request sent successfully at ${new Date()}`);
        })
        .catch((error) => {
            console.error(`Error sending request: ${error.message}`);
        });
});
startServer();
