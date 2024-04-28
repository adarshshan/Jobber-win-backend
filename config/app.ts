import express, { Request, Response, Application } from "express";
import http from 'http';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "../src/routes/userRoute";
import adminRouter from "../src/routes/adminRoute";
import recruiterRouter from "../src/routes/recruiterRoute";


export const createServer = () => {
    try {
        const app: Application = express()
        http.createServer(app);
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
        app.use(cookieParser())

        app.use('/api/user', userRouter);
        app.use('/api/admin', adminRouter);
        app.use('/api/recuriter', recruiterRouter);

        return app

    } catch (error) {
        console.log(error);
        console.log('error caught from app.ts');
    }
}