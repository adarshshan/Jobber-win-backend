import express, { Application, Response, Request } from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from "../src/routes/userRoute";
import adminRouter from "../src/routes/adminRoute";
import recruiterRouter from "../src/routes/recruiterRoute";
import chatRouter from "../src/routes/chatRoute";
import messageRouter from '../src/routes/messageRoute';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid'

const stripe = new Stripe('pk_test_51PIV6BSA3RmngPpVthkmR3p45HTyw0UADGi1Qx4Q0GA9U4SdnLVOmx7tMXuWkkjWlXzm7IOJ3N02v3Gj5J3Tpacn00PV6m7lNU');



export const createServer = () => {
    try {
        const app: Application | undefined = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
        app.use(cookieParser())


        app.use('/api/user', userRouter);
        app.use('/api/admin', adminRouter);
        app.use('/api/recruiter', recruiterRouter);
        app.use('/api/chat', chatRouter);
        app.use('/api/messages', messageRouter);

        app.post('/payment', async (req: Request, res: Response) => {
            const { product, token, email, id } = req.body;
            const idempotencyKey = uuid();

            return stripe.customers.create({
                email: email,
                source: id
            }).then(customer => {
                stripe.charges.create({
                    amount: 50 * 100,
                    currency: 'usd',
                    customer: customer.id,
                    receipt_email: 'adarshshanu3@gmail.com',
                    description: 'productName or anything',
                    shipping: {
                        name: 'adarsh c',
                        address: {
                            country: 'India'
                        }
                    }
                }, { idempotencyKey })
            })
                .then(result => res.status(200).json(result))
                .catch((err) => console.log(err as Error));
        })

        return app;

    } catch (error) {
        console.log(error);
        console.log('error caught from app.ts');
    }
}