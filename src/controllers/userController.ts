import { Request, Response } from "express"
import userService from "../service/userService"
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";
const { BAD_REQUEST, OK,INTERNAL_SERVER_ERROR } = STATUS_CODES;

class userController {
    constructor(private userServices: userService) { }

    async userLogin(req: Request, res: Response) {
        this.userServices.userLogin('adarshshanu', 'shanshanu');
    }
    async googleLogin(req: Request, res: Response) {
        console.log('googleLogin..')
    }
    async userSingnup(req: Request, res: Response) {
        req.app.locals.userData = req.body;
        const newUser = await this.userServices.userSignup(req.app.locals.userData);
        if (!newUser) {
            req.app.locals.newUser = true;
            req.app.locals.userData = req.body;
            req.app.locals.userEmail = req.body.email;
            const otp = await generateAndSendOTP(req.body.email);
            req.app.locals.userOtp = otp;

            const expirationMinutes = 2;
            setTimeout(() => {
                delete req.app.locals.userOtp;
            }, expirationMinutes * 60 * 1000);

            res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

        } else {
            res.status(BAD_REQUEST).json({ message: 'The email is already in use!' });
        }
    }
    async veryfyOtp(req: Request, res: Response) {
        try {
            const { otp } = req.body;
            const isNuewUser = req.app.locals.newUser;
            const savedUser = req.app.locals.userData;
            console.log(otp, isNuewUser, savedUser);
            console.log(req.app.locals.userOtp);
            if (otp === Number(req.app.locals.userOtp)) {
                if (isNuewUser) {
                    const newUser = await this.userServices.saveUser(savedUser);
                    req.app.locals = {};
                    res.status(OK).json(newUser);
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
    
    async profile(req: Request, res: Response) {
        console.log('profile page .....')
    }
    async editUserDetails(req: Request, res: Response) {
        console.log('edit user detailss.....')
    }
    async changeAboutInfo(req: Request, res: Response) {
        console.log('change the about information...');
    }
    async setProfilePic(req: Request, res: Response) {
        console.log('set the new profile pic...');
    }
    async addSkill(req: Request, res: Response) {
        console.log('add skill')
    }
    async removeSkill(req: Request, res: Response) {
        console.log('remove skill')
    }
    async forgotPassword(req: Request, res: Response) {
        console.log('forgot password password...');
    }
    async changePassword(req: Request, res: Response) {
        console.log('change password...');
    }

}

export default userController