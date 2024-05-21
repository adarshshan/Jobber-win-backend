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
    async updateSubPlan(userId: string, item: SubInterface) {
        await this.userRepository.updateSubPlan(userId, item);
    }
    async getCurrentSubscription(userId: string) {
        try {
            const user: any = await this.userRepository.getUserById(userId);
            if (user) {
                const subScr = await this.subscriptionRepository.getSubscriptionById(user.subscription.sub_Id);
                if (subScr) {
                    if (subScr.status !== 'active')
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
                        }
                    const date = new Date(user.subscription.purchased_At)
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
                    }
                } else return {
                    success: false,
                    message: 'plan is not exists!!!'
                }

            } return {
                success: false,
                message: 'user has not purchased subscription plan!'
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default SubscriptionService;