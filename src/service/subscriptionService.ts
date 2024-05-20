import { SubscriptionPlanInterface } from "../models/SubscriptionModel";
import SubscriptionRepository from "../repositories/subscriptionRepository";


class SubscriptionService {
    constructor(private subscriptionRepository: SubscriptionRepository) { }

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
}

export default SubscriptionService;