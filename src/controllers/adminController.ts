import { Request, Response } from "express";
import AdminService from "../service/adminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";

const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class adminController {
    constructor(private adminService: AdminService) { }

    async adminLogin(req: Request, res: Response) {
        req.app.locals.adminLoginData = req.body;
        await this.adminService.adminLogin(req.app.locals.adminLoginData, req);
    }
    async adminSignup(req: Request, res: Response) {
        try {
            const admin = await this.adminService.adminSignup(req.body);
            if (!admin) {
                req.app.locals.newAdmin = true;
                req.app.locals.adminData = req.body;
                req.app.locals.email = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);
                req.app.locals.otp = otp;

                const expirationMinutes = 2;
                setTimeout(() => {
                    delete req.app.locals.otp;
                }, expirationMinutes * 60 * 1000);

                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

            } else {
                res.status(BAD_REQUEST).json({ message: 'Email is already exist !' });
            }
        } catch (error) {
            console.log(error as Error)
            res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
        }
    }
    async veryfyOtp(req: Request, res: Response) {
        try {
            const { otp } = req.body;
            const isNewAdmin = req.app.locals.newAdmin;
            const savedAdmin = req.app.locals.adminData;
            console.log(otp, isNewAdmin, savedAdmin);
            console.log(req.app.locals.otp);
            if (otp === Number(req.app.locals.otp)) {
                if (isNewAdmin) {
                    const newAdmin = await this.adminService.saveAdmin(savedAdmin);
                    req.app.locals = {};
                    res.status(OK).json(newAdmin);
                } else {
                    res.status(OK).json();
                }
            } else {
                res.status(BAD_REQUEST).json({ message: 'Incorrect otp !' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal server Error.' });
        }
    }

    async getSubscriptionList(req: Request, res: Response) {

    }
    async deleteSubscription(req: Request, res: Response) {

    }
    async editSubscription(req: Request, res: Response) {

    }
    async createSubscription(req: Request, res: Response) {

    }
    //users
    getUserList(req: Request, res: Response) {

    }
    blockUser(req: Request, res: Response) {

    }
    sentNotification(req: Request, res: Response) {

    }
}

export default adminController;