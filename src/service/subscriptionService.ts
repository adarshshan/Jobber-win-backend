import UserInterface from "../interfaces/entityInterface/Iuser";
import { SubInterface } from "../interfaces/serviceInterfaces/subscription";
import { ISubscriptionRepository } from "../interfaces/repositoryInterfaces/ISubscriptionRepository";
import { SubscriptionPlanInterface } from "../models/SubscriptionModel";
import { NotFoundError, DatabaseError } from '../utils/errors';
import Stripe from 'stripe';
import UserRepository from "../repositories/userRepository";
import { config } from "dotenv";

config();

const STRIPE_SECRET_KEY: any = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(STRIPE_SECRET_KEY);


class SubscriptionService {
    constructor(
        private subscriptionRepository: ISubscriptionRepository,
        private userRepository: UserRepository) { }

    async createSubscription(data: SubscriptionPlanInterface): Promise<SubscriptionPlanInterface> {
        try {
            return await this.subscriptionRepository.createSubscription(data);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in createSubscription:", error);
            throw new Error("An unexpected error occurred while creating subscription."); // Re-throw generic error
        }
    }
    async getSubscriptionList(): Promise<SubscriptionPlanInterface[]> {
        try {
            return await this.subscriptionRepository.getSubscriptionList();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getSubscriptionList:", error);
            throw new Error("An unexpected error occurred while retrieving subscription list."); // Re-throw generic error
        }
    }
    async editSubscription(id: string, duration: number, amount: number, planName: string): Promise<SubscriptionPlanInterface> {
        try {
            return await this.subscriptionRepository.editSubscription(id, duration, amount, planName);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in editSubscription:", error);
            throw new Error("An unexpected error occurred while editing subscription."); // Re-throw generic error
        }
    }
    async deleteSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            return await this.subscriptionRepository.deleteSubscription(id);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deleteSubscription:", error);
            throw new Error("An unexpected error occurred while deleting subscription."); // Re-throw generic error
        }
    }
    async activateSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            return await this.subscriptionRepository.activateSubscription(id);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in activateSubscription:", error);
            throw new Error("An unexpected error occurred while activating subscription."); // Re-throw generic error
        }
    }
    async deactivateSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            return await this.subscriptionRepository.deactivateSubscription(id);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deactivateSubscription:", error);
            throw new Error("An unexpected error occurred while deactivating subscription."); // Re-throw generic error
        }
    }

    //...............recruiter side ........................

    async getAllSubscriptions(): Promise<SubscriptionPlanInterface[]> {
        try {
            return await this.subscriptionRepository.getAllSubscriptions();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllSubscriptions:", error);
            throw new Error("An unexpected error occurred while retrieving all subscriptions."); // Re-throw generic error
        }
    }
    async subscriptionPayment(item: SubInterface, user: UserInterface): Promise<string> {
        try {
            const lineItem = {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.planName
                    },
                    unit_amount: item.amount * 100,
                },
                quantity: 1
            };

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [lineItem],
                mode: "payment",
                success_url: `${process.env.CORS_URL}/recruiter/success`,
                cancel_url: `${process.env.CORS_URL}/recruiter/cancel`,
            });
            return session.id;
        } catch (error) {
            // Assuming Stripe errors might be caught here, or if any repository calls are added later
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Error in subscriptionPayment:", error);
            throw new Error("An unexpected error occurred during subscription payment processing."); // Re-throw generic error
        }
    }
    async webHook(item: SubInterface, event: any, userId: string): Promise<any> {
        try {
            // Add actual webhook logic here
            return null; // Placeholder
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Error in webHook:", error);
            throw new Error("An unexpected error occurred during webhook processing."); // Re-throw generic error
        }
    }
    async updateSubPlan(userId: string, item: SubInterface): Promise<void> {
        try {
            await this.userRepository.updateSubPlan(userId, item);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in updateSubPlan:", error);
            throw new Error("An unexpected error occurred while updating subscription plan."); // Re-throw generic error
        }
    }
    async getCurrentSubscription(userId: string): Promise<any> { // Consider a specific DTO for return type
        try {
            const user: any = await this.userRepository.getUserById(userId); // This will now throw NotFoundError if user not found

            const subScr = await this.subscriptionRepository.getSubscriptionById(user.subscription.sub_Id); // This will now throw NotFoundError if subscription not found

            if (subScr.status !== 'active') {
                return {
                    success: true,
                    planData: {
                        planName: subScr.planName,
                        description: subScr.description,
                        duration: subScr.duration,
                        amount: subScr.amount,
                        status: 'inactive'
                    },
                    message: 'success'
                };
            }
            const date = new Date(user.subscription.purchased_At);
            let expireDate = new Date(date);
            expireDate.setMonth(date.getMonth() + subScr.duration);

            return {
                success: true,
                planData: {
                    planName: subScr.planName,
                    description: subScr.description,
                    duration: subScr.duration,
                    amount: subScr.amount,
                    status: 'active',
                    expire_at: expireDate
                },
                message: 'success'
            };
        } catch (error) {
            if (error instanceof NotFoundError) {
                // User or Subscription not found
                return {
                    success: false,
                    message: error.message
                };
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getCurrentSubscription:", error);
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getCurrentSubscription:", error);
            throw new Error("An unexpected error occurred while retrieving current subscription."); // Re-throw generic error
        }
    }
}

export default SubscriptionService;