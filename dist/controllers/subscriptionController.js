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
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    createSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const result = yield this.subscriptionService.createSubscription(data);
                if (result)
                    res.json({ success: true, data: result, message: 'Subscription plan created Successfully!' });
                else
                    res.json({ success: false, message: 'Failed to create the subscription plan!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error' });
            }
        });
    }
    getSubscriptionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.subscriptionService.getSubscriptionList();
                if (result)
                    res.json({ success: true, data: result, message: 'Data fetched successfully' });
                else
                    res.json({ success: false, message: 'Something went wrong while fetching the subscription plans' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured...' });
            }
        });
    }
    editSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { duration, amount, planName } = req.body;
                const result = yield this.subscriptionService.editSubscription(id, duration, amount, planName);
                if (result)
                    res.json({ success: true, data: result, message: 'Edited successfully' });
                else
                    res.json({ success: false, message: 'Something went wrong while updating the subscriptioni plan!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    deleteSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.subscriptionService.deleteSubscription(id);
                if (result)
                    res.json({ success: true, message: 'Subscription deleted successfully' });
                else
                    res.json({ success: false, message: 'something went wrong while deleting the subscription' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    activateSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.subscriptionService.activateSubscription(id);
                if (result)
                    res.json({ success: true, message: 'Subscription Activated successfully!' });
                else
                    res.json({ success: false, message: 'Something went wrong while activating the subscription plan!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server Error occured!' });
            }
        });
    }
    deactivateSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.subscriptionService.deactivateSubscription(id);
                console.log(result);
                console.log('tis isthe ist h data ...');
                if (result)
                    res.json({ success: true, message: 'Subscription plan deactivated!' });
                else
                    res.json({ success: false, message: 'Something went wrong while deactivating the Subscription plan!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server ERror occured!' });
            }
        });
    }
    //recuriter side 
    getAllSubscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.subscriptionService.getAllSubscriptions();
                if (result)
                    res.json({ success: true, data: result, message: 'Success' });
                else
                    res.json({ success: false, message: 'Something went wrong while fetching the subscriptioin details. please try again!' });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'internal server error occured!' });
            }
        });
    }
    subscriptionPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { item } = req.body;
                const user = req.user;
                req.app.locals.subItem = item;
                req.app.locals.userId = req.userId;
                const expirationMinutes = 5;
                setTimeout(() => {
                    delete req.app.locals.subItem;
                }, expirationMinutes * 60 * 60 * 1000);
                if (user) {
                    const id = yield this.subscriptionService.subscriptionPayment(item, user);
                    res.json({ id: id });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    webHook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.app.locals.userId;
                const event = req.body;
                const item = req.app.locals.subItem;
                switch (event.type) {
                    case 'charge.updated':
                        console.log('charge.updated....');
                        const paymentDetails = event.data.object;
                        yield this.subscriptionService.updateSubPlan(userId, item);
                        break;
                    case 'checkout.session.completed':
                        const paymentIntent = event.data.object;
                        console.log('checkout.session.completed ...');
                        break;
                    case 'payment_intent.succeeded':
                        console.log('payment_intent.succeeded...');
                        break;
                    case 'payment_intent.payment_failed':
                        console.log('payment_intent.payment_failed');
                        break;
                    case 'charge.succeeded':
                        console.log('charge.succeeded...');
                        break;
                    case 'payment_intent.requires_action':
                        console.log('payment_intent.requires_action....');
                        break;
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                        break;
                }
                res.json({ success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCurrentSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const result = yield this.subscriptionService.getCurrentSubscription(userId);
                    if (result)
                        res.json(result);
                    else
                        res.json({ success: false, message: 'somethingwent wrong while fetching the current subscription plan.' });
                }
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = SubscriptionController;
//# sourceMappingURL=subscriptionController.js.map