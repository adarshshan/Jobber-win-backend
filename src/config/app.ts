import express, { Application, Request, Response } from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "../routes/userRoute";
import adminRouter from "../routes/adminRoute";
import recruiterRouter from "../routes/recruiterRoute";
import chatRouter from "../routes/chatRoute";
import messageRouter from "../routes/messageRoute";



export const createServer = () => {
    try {
        const app: Application | undefined = express()
        const corsOptions = {
            origin: process.env.CORS_URL,
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
            optionsSuccessStatus: 200
        };
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors(corsOptions));
        app.use(cookieParser())

        app.options('*', cors(corsOptions));

        app.get('/', (req: Request, res: Response) => {
            console.log('its working ... ');
            res.send('Hello Wolrd ');
        })

        app.use('/api/user', userRouter);
        app.use('/api/admin', adminRouter);
        app.use('/api/recruiter', recruiterRouter);
        app.use('/api/chat', chatRouter);
        app.use('/api/messages', messageRouter);

        return app;

    } catch (error) {
        console.log(error);
        console.log('error caught from app.ts');
    }
}