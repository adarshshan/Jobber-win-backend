import { Request, Response } from "express";
import AdminService from "../service/adminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";

const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class adminController {
    constructor(private adminService: AdminService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async adminLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const loginStatus = await this.adminService.adminLogin(email, password);
            if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object' && 'token' in loginStatus.data) {
                const time = this.milliseconds(23, 30, 0);
                res.status(loginStatus.status).cookie('admin_access_token', loginStatus.data.token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true
                }).json(loginStatus);
            } else {
                res.status(UNAUTHORIZED).json(loginStatus);
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }
    async adminSignup(req: Request, res: Response): Promise<void> {
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
                res.status(BAD_REQUEST).json({ success: false, message: 'Email is already exist !' });
            }
        } catch (error) {
            console.log(error as Error)
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error' })
        }
    }
    async veryfyOtp(req: Request, res: Response) {
        try {
            const { otp } = req.body;
            const isNewAdmin = req.app.locals.newAdmin;
            const savedAdmin = req.app.locals.adminData;
            if (otp === Number(req.app.locals.otp)) {
                if (isNewAdmin) {
                    const newAdmin = await this.adminService.saveAdmin(savedAdmin);
                    req.app.locals = {};
                    res.status(OK).json(newAdmin);
                } else {
                    res.status(OK).json();
                }
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
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
    async getUserList(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const searchQuery = req.query.searchQuery as string | undefined
            const data = await this.adminService.getUserList(page, limit, searchQuery);
            res.status(OK).json(data);
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' })
        }
    }
    async blockNunblockUser(req: Request, res: Response): Promise<void> {
        try {
            await this.adminService.blockNunblockUser(req.params.userId as string);
            res.status(OK).json({
                success: true,
                message: 'block or unblocked the user'
            })
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }
    async adminLogout(req: Request, res: Response) {
        try {
            res.cookie('admin_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true, message: 'logout sucessfully' })
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' })
        }
    }
    sentNotification(req: Request, res: Response) {

    }
}

export default adminController;