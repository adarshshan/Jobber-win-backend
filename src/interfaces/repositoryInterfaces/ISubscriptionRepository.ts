import { SubscriptionPlanInterface } from "../../models/SubscriptionModel"; // Assuming SubscriptionPlanInterface is defined here

export interface ISubscriptionRepository {
    createSubscription(data: SubscriptionPlanInterface): Promise<SubscriptionPlanInterface>;
    getSubscriptionList(): Promise<SubscriptionPlanInterface[]>;
    editSubscription(id: string, duration: number, amount: number, planName: string): Promise<SubscriptionPlanInterface>;
    deleteSubscription(id: string): Promise<SubscriptionPlanInterface>;
    activateSubscription(id: string): Promise<SubscriptionPlanInterface>;
    deactivateSubscription(id: string): Promise<SubscriptionPlanInterface>;
    getAllSubscriptions(): Promise<SubscriptionPlanInterface[]>;
    getSubscriptionById(id: string): Promise<SubscriptionPlanInterface>;
}