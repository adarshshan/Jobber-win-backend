import { Response, Request } from "express";
import SubscriptionService from "../service/subscriptionService";


class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) { }

    async createSubscription(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await this.subscriptionService.createSubscription(data);
            if (result) res.json({ success: true, data: result, message: 'Subscription plan created Successfully!' });
            else res.json({ success: false, message: 'Failed to create the subscription plan!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error' });
        }
    }
    async getSubscriptionList(req: Request, res: Response) {
        try {
            const result = await this.subscriptionService.getSubscriptionList();
            if (result) res.json({ success: true, data: result, message: 'Data fetched successfully' });
            else res.json({ success: false, message: 'Something went wrong while fetching the subscription plans' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured...' });
        }
    }
    async editSubscription(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { duration, amount, planName } = req.body;
            const result = await this.subscriptionService.editSubscription(id, duration, amount, planName);
            if (result) res.json({ success: true, data: result, message: 'Edited successfully' });
            else res.json({ success: false, message: 'Something went wrong while updating the subscriptioni plan!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async deleteSubscription(req: Request, res: Response) {
        try {
            const id = req.params.id
            const result = await this.subscriptionService.deleteSubscription(id);
            if (result) res.json({ success: true, message: 'Subscription deleted successfully' });
            else res.json({ success: false, message: 'something went wrong while deleting the subscription' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async activateSubscription(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.subscriptionService.activateSubscription(id);
            if (result) res.json({ success: true, message: 'Subscription Activated successfully!' });
            else res.json({ success: false, message: 'Something went wrong while activating the subscription plan!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async deactivateSubscription(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.subscriptionService.deactivateSubscription(id); console.log(result); console.log('tis isthe ist h data ...');
            if (result) res.json({ success: true, message: 'Subscription plan deactivated!' });
            else res.json({ success: false, message: 'Something went wrong while deactivating the Subscription plan!' })
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server ERror occured!' });
        }
    }

    //recuriter side 

    async getAllSubscriptions(req: Request, res: Response) {
        try {
            const result = await this.subscriptionService.getAllSubscriptions();
            if (result) res.json({ success: true, data: result, message: 'Success' });
            else res.json({ success: false, message: 'Something went wrong while fetching the subscriptioin details. please try again!' })
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal server error occured!' })
        }
    }
    async subscriptionPayment(req: Request, res: Response) {
        try {
            const { item } = req.body;
            const user = req.user;
            req.app.locals.subItem = item;
            req.app.locals.userId = req.userId;
            const expirationMinutes = 5;
            setTimeout(() => {
                delete req.app.locals.subItem;
            }, expirationMinutes * 60 * 60 * 1000);

            if (user) {
                const id = await this.subscriptionService.subscriptionPayment(item, user);
                res.json({ id: id });
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async webHook(req: Request, res: Response) {
        try {
            const userId = req.app.locals.userId
            const event = req.body;
            const item = req.app.locals.subItem
            switch (event.type) {
                case 'charge.updated':
                    console.log('charge.updated....');
                    const paymentDetails = event.data.object;
                    await this.subscriptionService.updateSubPlan(userId, item);
                    break;
                case 'checkout.session.completed':
                    const paymentIntent = event.data.object;
                    console.log('checkout.session.completed ...');
                    break;
                case 'payment_intent.succeeded':
                    console.log('payment_intent.succeeded...');
                    break;
                case 'payment_intent.payment_failed':
                    console.log('payment_intent.payment_failed');
                    break;
                case 'charge.succeeded':
                    console.log('charge.succeeded...');
                    break;
                case 'payment_intent.requires_action':
                    console.log('payment_intent.requires_action....')
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
                    break;
            }
            res.json({ success: true });
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default SubscriptionController;