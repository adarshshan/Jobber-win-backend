import { NextFunction, Request, Response } from "express"
import userService from "../service/userService"
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";
import { UserAuthResponse } from "../interfaces/serviceInterfaces/IuserService";
import { UserInfo } from "os";
import UserInterface from "../interfaces/entityInterface/Iuser";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;

class userController {
    constructor(private userServices: userService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: { email: string; password: string } = req.body;
            const loginStatus = await this.userServices.userLogin(email, password);
            if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object' && 'token' in loginStatus.data) {
                if (!loginStatus.data.success) {
                    res.status(UNAUTHORIZED).json({ success: false, message: loginStatus.data.message });
                    return;
                }
                const time = this.milliseconds(23, 30, 0);
                res.status(loginStatus.status).cookie('access_token', loginStatus.data.token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true
                }).json(loginStatus);
            } else {
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication error' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' })
        }
    }



    async googleLogin(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        try {
            const user = await this.userServices.getUserByEmail(email);
            if (user) {
                const token = this.userServices.generateToken(user.id);
                const { password, ...rest } = user;
                const time = this.milliseconds(23, 30, 0);
                res.status(OK).cookie('access_token', token, {
                    expires: new Date(Date.now() + time),
                    httpOnly: true
                }).json(rest);
            } else {
                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = this.userServices.hashPassword(generatedPassword);

                const newUser: UserAuthResponse | undefined = await this.userServices.saveUser({
                    email: email,
                    password: hashedPassword,
                })

            }
        } catch (error) {
            next(error);
        }
    }
    async userSingnup(req: Request, res: Response): Promise<void> {
        try {
            req.app.locals.userData = req.body;
            const newUser = await this.userServices.userSignup(req.app.locals.userData);
            if (!newUser) {
                req.app.locals.newUser = true;
                req.app.locals.userData = req.body;
                req.app.locals.userEmail = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);
                req.app.locals.userOtp = otp;

                const expirationMinutes = 5;
                setTimeout(() => {
                    delete req.app.locals.userOtp;
                }, expirationMinutes * 60 * 1000);

                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
            }
        } catch (error) {
            console.log(error as Error)
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }
    async veryfyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp } = req.body;
            const isNuewUser = req.app.locals.newUser;
            const savedUser = req.app.locals.userData;
            if (otp === Number(req.app.locals.userOtp)) {
                if (isNuewUser) {
                    const newUser = await this.userServices.saveUser(savedUser);
                    req.app.locals = {};
                    const time = this.milliseconds(23, 30, 0);
                    res.status(OK).cookie('access_token', newUser?.data.token, {
                        expires: new Date(Date.now() + time),
                        httpOnly: true
                    }).json(newUser);
                } else {
                    const time = this.milliseconds(23, 30, 0);
                    res.status(OK).cookie('access_token', isNuewUser.data.token, {
                        expires: new Date(Date.now() + time),
                        httpOnly: true
                    }).json({ success: true, message: 'old user verified' });
                }
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const currentUser = await this.userServices.getProfile(req.userId);
            console.log(currentUser); console.log('this is the result.');
            if (!currentUser) res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed..!' });
            else if (currentUser?.isBlocked) res.status(UNAUTHORIZED).json({ success: false, message: 'user has been blocked by the admin!' });
            else res.status(OK).json(currentUser);
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
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
    async logout(req: Request, res: Response) {
        try {
            res.cookie('access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true, message: 'user logout - clearing cookie' })
        } catch (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

}

export default userController