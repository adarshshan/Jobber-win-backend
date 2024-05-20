import SubscriptionModel, { SubscriptionPlanInterface } from "../models/SubscriptionModel";


class SubscriptionRepository {

    async createSubscription(data: SubscriptionPlanInterface) {
        try {
            const newData = new SubscriptionModel(data);
            await newData.save()
            return newData;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getSubscriptionList() {
        try {
            const subscriptions = await SubscriptionModel.find();
            return subscriptions;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editSubscription(id: string, duration: number, amount: number, planName: string) {
        try {
            const subscription = await SubscriptionModel.findById(id);
            if (subscription) {
                subscription.planName = planName || subscription.planName;
                subscription.amount = amount || subscription.amount;
                subscription.duration = duration || subscription.duration;
                await subscription.save();
                return subscription;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteSubscription(id: string) {
        try {
            const data = await SubscriptionModel.findByIdAndDelete(id);
            return data;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async activateSubscription(id: string) {
        try {
            const data = await SubscriptionModel.findByIdAndUpdate(id, { $set: { status: 'active' } });
            return data;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deactivateSubscription(id: string) {
        try {
            const data = await SubscriptionModel.findByIdAndUpdate(id, { $set: { status: 'inactive' } });
            return data;
        } catch (error) {
            console.log(error as Error)
        }
    }
}

export default SubscriptionRepository;