import { Document } from "mongoose";
import { SubscriptionPlanInterface } from "../../models/SubscriptionModel"; // Assuming SubscriptionPlanInterface is defined here

export interface ISubscriptionRepository {
    createSubscription(data: SubscriptionPlanInterface): Promise<(SubscriptionPlanInterface & Document) | undefined>;
    getSubscriptionList(): Promise<(SubscriptionPlanInterface & Document)[] | undefined>;
    editSubscription(id: string, duration: number, amount: number, planName: string): Promise<(SubscriptionPlanInterface & Document) | undefined>;
    deleteSubscription(id: string): Promise<(SubscriptionPlanInterface & Document) | undefined | null>;
    activateSubscription(id: string): Promise<(SubscriptionPlanInterface & Document) | undefined | null>;
    deactivateSubscription(id: string): Promise<(SubscriptionPlanInterface & Document) | undefined | null>;
    getAllSubscriptions(): Promise<(SubscriptionPlanInterface & Document)[] | undefined>;
    getSubscriptionById(id: string): Promise<(SubscriptionPlanInterface & Document) | undefined | null>;
}