import { NextFunction, Request, Response } from "express"
import userService from "../service/userService"
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";
import { UserAuthResponse } from "../interfaces/serviceInterfaces/IuserService";
import { NotFoundError, DatabaseError } from '../utils/errors';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;

class userController {
    constructor(private userServices: userService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: { email: string; password: string } = req.body;
            const loginStatus = await this.userServices.userLogin(email, password); // This now returns UserAuthResponse or throws error

            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

            res.status(loginStatus.status).cookie('access_token', loginStatus.data.token, {
                maxAge: accessTokenMaxAge,
                sameSite: 'none',
                secure: true
            }).cookie('refresh_token', loginStatus.data.refreshToken, {
                maxAge: refreshTokenMaxAge,
                sameSite: 'none',
                secure: true
            }).json(loginStatus);

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed: User not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in userLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during login.' });
            } else if (error instanceof Error) { // Catching generic errors thrown by service for failed authentication
                res.status(UNAUTHORIZED).json({ success: false, message: error.message || 'Authentication failed.' });
            } else {
                console.error("Unexpected error in userLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred.' });
            }
        }
    }



    async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, email, googlePhotoUrl } = req.body;
        const accessTokenMaxAge = 30 * 60 * 1000;
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
        try {
            let user;
            try {
                user = await this.userServices.getUserByEmail(email);
            } catch (error) {
                if (error instanceof NotFoundError) {
                    // User not found, proceed to create new user
                    user = null;
                } else {
                    throw error; // Re-throw other errors
                }
            }

            if (user) {
                if (user.isBlocked) {
                    res.status(UNAUTHORIZED).json({ success: false, message: 'user has been blocked by admin.' });
                    return;
                } else {
                    const token = this.userServices.generateToken(user.id);
                    const refreshToken = this.userServices.generateRefreshToken(user.id);
                    const data = {
                        success: true,
                        message: 'Success',
                        userId: user.id,
                        token: token,
                        refreshToken,
                        data: user
                    };
                    res.status(OK).cookie('access_token', token, {
                        maxAge: accessTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).cookie('refresh_token', refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).json(data);
                }
            } else {
                // Create new user
                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = await this.userServices.hashPassword(generatedPassword);

                const newUserResponse: UserAuthResponse = await this.userServices.saveUser({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    profile_picture: googlePhotoUrl
                });
                if (newUserResponse.data.data) {
                    res.status(OK).cookie('access_token', newUserResponse.data.token, {
                        maxAge: accessTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).cookie('refresh_token', newUserResponse.data.refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).json(newUserResponse.data);
                } else {
                    res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to create new user.' });
                }
            }
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in googleLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during Google login.' });
            } else if (error instanceof Error) {
                console.error("Error in googleLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during Google login.' });
            } else {
                console.error("Unexpected error in googleLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during Google login.' });
            }
        }
    }

    async userSingnup(req: Request, res: Response): Promise<void> {
        try {
            req.app.locals.userData = req.body;
            const existingUser = await this.userServices.userSignup(req.app.locals.userData);

            if (!existingUser) { // If existingUser is null, it means email does not exist, proceed with OTP
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
            if (error instanceof DatabaseError) {
                console.error("Database error in userSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during signup.' });
            } else if (error instanceof Error) {
                console.error("Error in userSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during signup.' });
            } else {
                console.error("Unexpected error in userSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during signup.' });
            }
        }
    }
    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const email = req.app.locals.userEmail;
            const otp = await generateAndSendOTP(email);
            req.app.locals.userOtp = otp;
            req.app.locals.resendOtp = otp;

            const expirationMinutes = 5;
            setTimeout(() => {
                delete req.app.locals.userOtp;
                delete req.app.locals.resendOtp;
            }, expirationMinutes * 60 * 1000);

        } catch (error) {
            console.log(error as Error);
        }
    }
    async ForgotresentOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            req.app.locals.userEmail = email;
            if (!email) return res.status(BAD_REQUEST).json({ success: false, message: 'please enter the email' });

            const user = await this.userServices.getUserByEmail(email); // This will now throw NotFoundError if user not found

            const otp = await generateAndSendOTP(email);
            req.app.locals.resendOtp = otp;

            const expirationMinutes = 5;
            setTimeout(() => {
                delete req.app.locals.resendOtp;
            }, expirationMinutes * 60 * 1000);

            res.status(OK).json({ success: true, data: user, message: 'OTP sent for verification...' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User with email does not exist!' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in ForgotresentOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error occurred during OTP resend!' });
            } else if (error instanceof Error) {
                console.error("Error in ForgotresentOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during OTP resend!' });
            } else {
                console.error("Unexpected error in ForgotresentOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during OTP resend!' });
            }
        }
    }
    async VerifyForgotOtp(req: Request, res: Response) {
        try {
            const otp = req.body.otp;
            if (!otp) return res.json({ success: false, message: 'Please enter the otp!' });
            if (!req.app.locals.resendOtp) return res.json({ success: false, message: 'Otp is expired!' });
            if (otp === req.app.locals.resendOtp) res.json({ success: true, message: 'both otp are same.' });
            else res.json({ success: false, message: 'Entered otp is not correct!' })
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async updateNewPassword(req: Request, res: Response) {
        try {
            const { password, userId } = req.body;
            const result = await this.userServices.updateNewPassword(password, userId);
            res.json({ success: true, data: result, message: 'Password updated successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for password update.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in updateNewPassword controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during password update.' });
            } else if (error instanceof Error) {
                console.error("Error in updateNewPassword controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during password update.' });
            } else {
                console.error("Unexpected error in updateNewPassword controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during password update.' });
            }
        }
    }
    async veryfyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { otp } = req.body;
            const isNewUser = req.app.locals.newUser;
            const savedUser = req.app.locals.userData;

            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

            if (otp === Number(req.app.locals.userOtp)) {
                if (isNewUser) {
                    const newUserResponse = await this.userServices.saveUser(savedUser); // This will now throw DatabaseError on failure
                    req.app.locals = {};
                    res.status(OK).cookie('access_token', newUserResponse.data.token, {
                        maxAge: accessTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).cookie('refresh_token', newUserResponse.data.refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        sameSite: 'none',
                        secure: true
                    }).json(newUserResponse);
                } else {
                    // This part of the logic seems to assume isNewUser holds user data for old user verification.
                    // If isNewUser is a boolean, this logic needs adjustment. Assuming it's a boolean for now.
                    // If it's an old user, the token/refreshToken should come from a login process, not isNewUser.
                    // For now, I'll keep the existing structure but note this as a potential area for review.
                    res.status(OK).json({ success: true, message: 'Old user verified' });
                }
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during OTP verification.' });
            } else if (error instanceof Error) {
                console.error("Error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during OTP verification.' });
            } else {
                console.error("Unexpected error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during OTP verification.' });
            }
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const currentUser = await this.userServices.getProfile(req.userId);
            if (!currentUser) { // This case should ideally be handled by NotFoundError from service
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed: User not found.' });
                return;
            }
            if (currentUser.isBlocked) {
                res.status(UNAUTHORIZED).json({ success: false, message: 'User has been blocked by the admin!' });
                return;
            }
            res.status(OK).json(currentUser);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed: User not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getProfile controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching profile.' });
            } else if (error instanceof Error) {
                console.error("Error in getProfile controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching profile.' });
            } else {
                console.error("Unexpected error in getProfile controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching profile.' });
            }
        }
    }

    async editUserDetails(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const { name, phoneNumber, gender, location, headLine, qualification } = req.body;
            const result = await this.userServices.editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId);
            res.json({ success: true, data: result, message: 'Details successfully updated.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for updating details.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in editUserDetails controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during details update.' });
            } else if (error instanceof Error) {
                console.error("Error in editUserDetails controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during details update.' });
            } else {
                console.error("Unexpected error in editUserDetails controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during details update.' });
            }
        }
    }
    async changeAboutInfo(req: Request, res: Response) {
        try {
            const text = req.body.aboutInfo;
            const id = req.params.id;
            const edited = await this.userServices.changeAboutInfo(id, text);
            res.json({ success: true, about: edited, message: 'About information successfully updated.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for updating about information.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in changeAboutInfo controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during about information update.' });
            } else if (error instanceof Error) {
                console.error("Error in changeAboutInfo controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during about information update.' });
            }
            else {
                console.error("Unexpected error in changeAboutInfo controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during about information update.' });
            }
        }
    }
    async setProfilePic(req: Request, res: Response) {
        try {
            const { pic, id } = req.body;
            const result = await this.userServices.setProfilePic(pic, id);
            res.json({ success: true, data: result, message: 'Profile picture updated successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for updating profile picture.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in setProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during profile picture update.' });
            } else if (error instanceof Error) {
                console.error("Error in setProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during profile picture update.' });
            } else {
                console.error("Unexpected error in setProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during profile picture update.' });
            }
        }
    }
    async reportUser(req: Request, res: Response) {
        try {
            const { reason } = req.body;
            const { postId } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User not authenticated.' });
            }
            const result = await this.userServices.reportUser(postId, reason, userId);
            return res.json({ success: true, data: result, message: 'User reported successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in reportUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during user report.' });
            } else if (error instanceof Error) {
                console.error("Error in reportUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during user report.' });
            } else {
                console.error("Unexpected error in reportUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during user report.' });
            }
        }
    }
    async deleteProfilePic(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const result = await this.userServices.deleteProfilePic(userId);
            res.json({ success: true, data: result, message: 'Profile picture removed successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for deleting profile picture.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in deleteProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during profile picture deletion.' });
            } else if (error instanceof Error) {
                console.error("Error in deleteProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during profile picture deletion.' });
            } else {
                console.error("Unexpected error in deleteProfilePic controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during profile picture deletion.' });
            }
        }
    }
    async addSkill(req: Request, res: Response) {
        try {
            const { skill } = req.body;
            const { id } = req.params;
            const result = await this.userServices.addSkill(id, skill);
            res.json({ success: true, data: result, message: 'Skill added successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for adding skill.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in addSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during skill addition.' });
            } else if (error instanceof Error) {
                console.error("Error in addSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during skill addition.' });
            } else {
                console.error("Unexpected error in addSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during skill addition.' });
            }
        }
    }
    async getAllSkill(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.userServices.getAllSkill(id);
            res.json({ success: true, data: result, message: 'Skills retrieved successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for retrieving skills.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getAllSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during skill retrieval.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during skill retrieval.' });
            } else {
                console.error("Unexpected error in getAllSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during skill retrieval.' });
            }
        }
    }
    async removeSkill(req: Request, res: Response) {
        try {
            const { skill, id } = req.params;
            const result = await this.userServices.removeSkill(id, skill);
            res.json({ success: true, data: result, message: 'Skill removed successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for removing skill.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in removeSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during skill removal.' });
            } else if (error instanceof Error) {
                console.error("Error in removeSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during skill removal.' });
            } else {
                console.error("Unexpected error in removeSkill controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during skill removal.' });
            }
        }
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
                maxAge: 0
            }).cookie('refresh_token', '', {
                maxAge: 0
            })
            res.status(200).json({ success: true, message: 'user logout - clearing cookie' })
        } catch (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

}

export default userController