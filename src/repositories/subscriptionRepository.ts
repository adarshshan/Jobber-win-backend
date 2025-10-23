import SubscriptionModel, { SubscriptionPlanInterface } from "../models/SubscriptionModel";


import { ISubscriptionRepository } from "../interfaces/repositoryInterfaces/ISubscriptionRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class SubscriptionRepository implements ISubscriptionRepository {

    async createSubscription(data: SubscriptionPlanInterface): Promise<SubscriptionPlanInterface> {
        try {
            const newData = new SubscriptionModel(data);
            await newData.save();
            return newData;
        } catch (error) {
            console.error("Error in createSubscription:", error);
            throw new DatabaseError(`Failed to create subscription plan "${data.planName}".`, error as Error);
        }
    }
    async getSubscriptionList(): Promise<SubscriptionPlanInterface[]> {
        try {
            const subscriptions = await SubscriptionModel.find();
            return subscriptions;
        } catch (error) {
            console.error("Error in getSubscriptionList:", error);
            throw new DatabaseError(`Failed to retrieve subscription list.`, error as Error);
        }
    }
    async editSubscription(id: string, duration: number, amount: number, planName: string): Promise<SubscriptionPlanInterface> {
        try {
            const subscription = await SubscriptionModel.findById(id);
            if (!subscription) {
                throw new NotFoundError(`Subscription with ID ${id} not found for editing.`);
            }
            subscription.planName = planName || subscription.planName;
            subscription.amount = amount || subscription.amount;
            subscription.duration = duration || subscription.duration;
            await subscription.save();
            return subscription;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in editSubscription:", error);
            throw new DatabaseError(`Failed to edit subscription with ID ${id}.`, error as Error);
        }
    }
    async deleteSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            const data = await SubscriptionModel.findByIdAndDelete(id);
            if (!data) {
                throw new NotFoundError(`Subscription with ID ${id} not found for deletion.`);
            }
            return data;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deleteSubscription:", error);
            throw new DatabaseError(`Failed to delete subscription with ID ${id}.`, error as Error);
        }
    }
    async activateSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            const data = await SubscriptionModel.findByIdAndUpdate(id, { $set: { status: 'active' } }, { new: true });
            if (!data) {
                throw new NotFoundError(`Subscription with ID ${id} not found for activation.`);
            }
            return data;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in activateSubscription:", error);
            throw new DatabaseError(`Failed to activate subscription with ID ${id}.`, error as Error);
        }
    }
    async deactivateSubscription(id: string): Promise<SubscriptionPlanInterface> {
        try {
            const data = await SubscriptionModel.findByIdAndUpdate(id, { $set: { status: 'inactive' } }, { new: true });
            if (!data) {
                throw new NotFoundError(`Subscription with ID ${id} not found for deactivation.`);
            }
            return data;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deactivateSubscription:", error);
            throw new DatabaseError(`Failed to deactivate subscription with ID ${id}.`, error as Error);
        }
    }

    //...............Recruiter side .................\\
    async getAllSubscriptions(): Promise<SubscriptionPlanInterface[]> {
        try {
            const data = await SubscriptionModel.find({ status: 'active' }).sort({ createdAt: -1 });
            return data;
        } catch (error) {
            console.error("Error in getAllSubscriptions:", error);
            throw new DatabaseError(`Failed to retrieve all active subscriptions.`, error as Error);
        }
    }
    async getSubscriptionById(id: string): Promise<SubscriptionPlanInterface> {
        try {
            const sub = await SubscriptionModel.findById(id);
            if (!sub) {
                throw new NotFoundError(`Subscription with ID ${id} not found.`);
            }
            return sub;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getSubscriptionById:", error);
            throw new DatabaseError(`Failed to retrieve subscription with ID ${id}.`, error as Error);
        }
    }
}

export default SubscriptionRepository;