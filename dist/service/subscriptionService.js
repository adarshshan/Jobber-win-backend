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
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY || '';
const stripe = new stripe_1.default(PUBLISHABLE_KEY);
class SubscriptionService {
    constructor(subscriptionRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.createSubscription(data);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSubscriptionList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.getSubscriptionList();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editSubscription(id, duration, amount, planName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.editSubscription(id, duration, amount, planName);
            }
            catch (error) {
            }
        });
    }
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.deleteSubscription(id);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    activateSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.activateSubscription(id);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deactivateSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.deactivateSubscription(id);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //...............recruiter side ........................
    getAllSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.subscriptionRepository.getAllSubscriptions();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    subscriptionPayment(item, user) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [lineItem],
                    mode: "payment",
                    success_url: `${process.env.CORS_URL}/recruiter/success`,
                    cancel_url: `${process.env.CORS_URL}/recruiter/cancel`,
                });
                return session.id;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    webHook(item, event, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateSubPlan(userId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.updateSubPlan(userId, item);
        });
    }
    getCurrentSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(userId);
                if (user) {
                    const subScr = yield this.subscriptionRepository.getSubscriptionById(user.subscription.sub_Id);
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
                            };
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
                    }
                    else
                        return {
                            success: false,
                            message: 'plan is not exists!!!'
                        };
                }
                return {
                    success: false,
                    message: 'user has not purchased subscription plan!'
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map