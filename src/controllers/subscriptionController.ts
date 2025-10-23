import { Response, Request } from "express";
import stripe from 'stripe';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { NotFoundError, DatabaseError } from '../utils/errors';
import SubscriptionService from "../service/subscriptionService";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED, } = STATUS_CODES

class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) { }

    async createSubscription(req: Request, res: Response) {
        try {
            const data = await this.subscriptionService.createSubscription(req.body);
            res.json({ success: true, data: data, message: 'Subscription created successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in createSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while creating subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in createSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while creating subscription.' });
            } else {
                console.error("Unexpected error in createSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while creating subscription.' });
            }
        }
    }
    async getSubscriptionList(req: Request, res: Response) {
        try {
            const data = await this.subscriptionService.getSubscriptionList();
            res.json({ success: true, data: data, message: 'Subscription list fetched successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getSubscriptionList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching subscription list.' });
            } else if (error instanceof Error) {
                console.error("Error in getSubscriptionList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching subscription list.' });
            } else {
                console.error("Unexpected error in getSubscriptionList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching subscription list.' });
            }
        }
    }
    async editSubscription(req: Request, res: Response) {
        try {
            const { id, duration, amount, planName } = req.body;
            const data = await this.subscriptionService.editSubscription(id, duration, amount, planName);
            res.json({ success: true, data: data, message: 'Subscription updated successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Subscription not found for editing.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in editSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while updating subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in editSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while updating subscription.' });
            } else {
                console.error("Unexpected error in editSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while updating subscription.' });
            }
        }
    }
    async deleteSubscription(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await this.subscriptionService.deleteSubscription(id);
            res.json({ success: true, data: data, message: 'Subscription deleted successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Subscription not found for deletion.' });
            }
            else if (error instanceof DatabaseError) {
                console.error("Database error in deleteSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while deleting subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in deleteSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while deleting subscription.' });
            } else {
                console.error("Unexpected error in deleteSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while deleting subscription.' });
            }
        }
    }
    async activateSubscription(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await this.subscriptionService.activateSubscription(id);
            res.json({ success: true, data: data, message: 'Subscription activated successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Subscription not found for activation.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in activateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while activating subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in activateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while activating subscription.' });
            } else {
                console.error("Unexpected error in activateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while activating subscription.' });
            }
        }
    }
    async deactivateSubscription(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await this.subscriptionService.deactivateSubscription(id);
            res.json({ success: true, data: data, message: 'Subscription deactivated successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Subscription not found for deactivation.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in deactivateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while deactivating subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in deactivateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while deactivating subscription.' });
            } else {
                console.error("Unexpected error in deactivateSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while deactivating subscription.' });
            }
        }
    }

    //recuriter side 

    async getAllSubscriptions(req: Request, res: Response) {
        try {
            const data = await this.subscriptionService.getAllSubscriptions();
            res.json({ success: true, data: data, message: 'Subscriptions fetched successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllSubscriptions controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching subscriptions.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllSubscriptions controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching subscriptions.' });
            } else {
                console.error("Unexpected error in getAllSubscriptions controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching subscriptions.' });
            }
        }
    }
    async subscriptionPayment(req: Request, res: Response) {
        try {
            const { item } = req.body;
            const user = req.user; // Assuming req.user is populated by middleware
            if (!user) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User not authenticated.' });
            }
            const sessionId = await this.subscriptionService.subscriptionPayment(item, user);
            res.json({ success: true, id: sessionId, message: 'Payment session created successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in subscriptionPayment controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during subscription payment.' });
            } else if (error instanceof Error) {
                console.error("Error in subscriptionPayment controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during subscription payment.' });
            } else {
                console.error("Unexpected error in subscriptionPayment controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during subscription payment.' });
            }
        }
    }
    async webHook(req: Request, res: Response) {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) {
                return res.status(BAD_REQUEST).send('Webhook Error: Missing stripe-signature header');
            }
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
            } catch (err: any) {
                console.error(`Webhook Error: ${err.message}`);
                return res.status(BAD_REQUEST).send(`Webhook Error: ${err.message}`);
            }
            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    const item = {
                        planName: 'Premium',
                        amount: 100,
                        duration: 1
                    };
                    const userId = '654321'; // Replace with actual user ID from session
                    await this.subscriptionService.webHook(item, event, userId);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            res.json({ received: true });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in webHook controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during webhook processing.' });
            } else if (error instanceof Error) {
                console.error("Error in webHook controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during webhook processing.' });
            } else {
                console.error("Unexpected error in webHook controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during webhook processing.' });
            }
        }
    }
    async getCurrentSubscription(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User not authenticated.' });
            }
            const data = await this.subscriptionService.getCurrentSubscription(userId);
            res.json({ success: true, data: data, message: 'Current subscription fetched successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: error.message || 'Subscription or user not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getCurrentSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching current subscription.' });
            } else if (error instanceof Error) {
                console.error("Error in getCurrentSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching current subscription.' });
            } else {
                console.error("Unexpected error in getCurrentSubscription controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching current subscription.' });
            }
        }
    }
}

export default SubscriptionController;