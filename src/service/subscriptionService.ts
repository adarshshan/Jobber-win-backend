import UserInterface from "../interfaces/entityInterface/Iuser";
import { SubInterface } from "../interfaces/serviceInterfaces/subscription";
import { SubscriptionPlanInterface } from "../models/SubscriptionModel";
import SubscriptionRepository from "../repositories/subscriptionRepository";
import Stripe from 'stripe';
import UserRepository from "../repositories/userRepository";
const stripe = new Stripe('sk_test_51PIV6BSA3RmngPpV4yT9yLFdmZibuFh1cwOt6zt3LFueRur6HoWoPQcnCz6TqjItVsFTXz96C8hFzdrnZHCL8ZnQ00eZOy6soo');


class SubscriptionService {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private userRepository: UserRepository) { }

    async createSubscription(data: SubscriptionPlanInterface) {
        try {
            return await this.subscriptionRepository.createSubscription(data);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getSubscriptionList() {
        try {
            return await this.subscriptionRepository.getSubscriptionList();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editSubscription(id: string, duration: number, amount: number, planName: string) {
        try {
            return await this.subscriptionRepository.editSubscription(id, duration, amount, planName);
        } catch (error) {

        }
    }
    async deleteSubscription(id: string) {
        try {
            return await this.subscriptionRepository.deleteSubscription(id);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async activateSubscription(id: string) {
        try {
            return await this.subscriptionRepository.activateSubscription(id);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deactivateSubscription(id: string) {
        try {
            return await this.subscriptionRepository.deactivateSubscription(id);
        } catch (error) {
            console.log(error as Error);
        }
    }

    //...............recruiter side ........................

    async getAllSubscriptions() {
        try {
            return await this.subscriptionRepository.getAllSubscriptions();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async subscriptionPayment(item: SubInterface, user: UserInterface) {
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
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [lineItem],
                mode: "payment",
                success_url: 'http://localhost:3000/recruiter/success',
                cancel_url: 'http://localhost:3000/recruiter/cancel',
            });
            return session.id;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async webHook(item: SubInterface, event: any, userId: string) {
        try {
            
            return null;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async updateSubPlan(userId:string, item:SubInterface){
        await this.userRepository.updateSubPlan(userId, item);
    }
}

export default SubscriptionService;