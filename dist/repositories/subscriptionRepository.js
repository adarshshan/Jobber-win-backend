"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionModel_1 = __importDefault(require("../models/SubscriptionModel"));
class SubscriptionRepository {
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = new SubscriptionModel_1.default(data);
                yield newData.save();
                return newData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSubscriptionList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield SubscriptionModel_1.default.find();
                return subscriptions;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editSubscription(id, duration, amount, planName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield SubscriptionModel_1.default.findById(id);
                if (subscription) {
                    subscription.planName = planName || subscription.planName;
                    subscription.amount = amount || subscription.amount;
                    subscription.duration = duration || subscription.duration;
                    yield subscription.save();
                    return subscription;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield SubscriptionModel_1.default.findByIdAndDelete(id);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    activateSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield SubscriptionModel_1.default.findByIdAndUpdate(id, { $set: { status: 'active' } });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deactivateSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield SubscriptionModel_1.default.findByIdAndUpdate(id, { $set: { status: 'inactive' } });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //...............Recruiter side .................\\
    getAllSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield SubscriptionModel_1.default.find({ status: 'active' }).sort({ createdAt: -1 });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSubscriptionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sub = yield SubscriptionModel_1.default.findById(id);
                return sub;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = SubscriptionRepository;
//# sourceMappingURL=subscriptionRepository.js.map