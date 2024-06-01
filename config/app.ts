import express, { Application, Request, Response } from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "../src/routes/userRoute";
import adminRouter from "../src/routes/adminRoute";
import recruiterRouter from "../src/routes/recruiterRoute";
import chatRouter from "../src/routes/chatRoute";
import messageRouter from '../src/routes/messageRoute';



export const createServer = () => {
    try {
        const app: Application | undefined = express()
        const corsOptions = {
            origin: 'https://jobber-win-frontend-w2kd.vercel.app/',
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
            optionsSuccessStatus: 200
        };
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors());
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