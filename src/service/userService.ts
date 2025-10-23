import UserInterface, { IUserCreateData } from "../interfaces/entityInterface/Iuser";
import { UserAuthResponse } from "../interfaces/serviceInterfaces/IuserService";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IuserRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { IReportRepository } from "../interfaces/repositoryInterfaces/IReportRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;



class userService {
    constructor(private userRepository: IUserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,
        private reportRepository: IReportRepository) { }

    async userLogin(email: string, password: string): Promise<UserAuthResponse> {
        try {
            const user = await this.userRepository.emailExistCheck(email); // This will now throw NotFoundError if user not found

            if (user.isBlocked) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'You have been blocked by the admin !',
                        token: undefined, // No token if blocked
                        data: user,
                        refreshToken: undefined, // No refresh token if blocked
                    }
                };
            }

            if (user.password && password) {
                const passwordMatch = await this.encrypt.compare(password, user.password as string);
                if (passwordMatch) {
                    const token = this.createjwt.generateToken(user.id);
                    const refreshToken = this.createjwt.generateRefreshToken(user.id);
                    return {
                        status: OK,
                        data: {
                            success: true,
                            message: 'Authentication Successful !',
                            data: user,
                            userId: user.id,
                            token: token,
                            refreshToken: refreshToken
                        }
                    };
                } else {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'Authentication failed...',
                        }
                    };
                }
            } else {
                // Should not happen if emailExistCheck passes and user has password
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Authentication failed due to missing password.',
                    }
                };
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Authentication failed: User not found.',
                    }
                };
            } else if (error instanceof DatabaseError) {
                console.error("Database error in userLogin:", error);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server Error during login!',
                    }
                };
            }
            console.error("Unexpected error in userLogin:", error);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'An unexpected error occurred during login!',
                }
            };
        }
    }

    async userSignup(userData: UserInterface): Promise<UserInterface | null> {
        console.log('its reached inside userSignup');
        try {
            // If emailExistCheck throws NotFoundError, it means the email does not exist, which is good for signup
            const existingUser = await this.userRepository.emailExistCheck(userData.email);
            // If it reaches here, it means a user with this email already exists
            return existingUser;
        } catch (error) {
            if (error instanceof NotFoundError) {
                // Email does not exist, so it's a valid signup scenario
                return null;
            } else if (error instanceof DatabaseError) {
                console.error("Database error in userSignup:", error);
                return null; // Indicate failure to check existence
            }
            console.error("Unexpected error in userSignup:", error);
            return null;
        }
    }
    async saveUser(userData: IUserCreateData): Promise<UserAuthResponse> {
        try {
            const user = await this.userRepository.saveUser(userData); // This will now throw DatabaseError on failure
            const token = this.createjwt.generateToken(user.id);
            const refreshToken = this.createjwt.generateRefreshToken(user.id);
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    userId: user.id,
                    token: token,
                    data: user,
                    refreshToken
                }
            };
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in saveUser:", error);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error while saving user!',
                    }
                };
            }
            console.error("Unexpected error in saveUser:", error);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'An unexpected error occurred while saving user!',
                }
            };
        }
    }
    async changeAboutInfo(id: string, text: string): Promise<string> {
        try {
            const changed = await this.userRepository.changeAboutInfo(id, text);
            return changed;
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in changeAboutInfo:", error);
            throw new Error("An unexpected error occurred while changing about info."); // Re-throw generic error
        }
    }
    async setProfilePic(pic: string, id: string): Promise<UserInterface> {
        try {
            const result = await this.userRepository.setProfilePic(pic, id);
            return result;
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in setProfilePic:", error);
            throw new Error("An unexpected error occurred while setting profile picture."); // Re-throw generic error
        }
    }
    async reportUser(postId: string, reason: string, userId: string): Promise<any> {
        try {
            return await this.reportRepository.reportUser(postId, reason, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in reportUser:", error);
            throw new Error("An unexpected error occurred while reporting user."); // Re-throw generic error
        }
    }
    async deleteProfilePic(userId: string): Promise<any> {
        try {
            return await this.userRepository.deleteProfilePic(userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deleteProfilePic:", error);
            throw new Error("An unexpected error occurred while deleting profile picture."); // Re-throw generic error
        }
    }
    async getUserByEmail(email: string): Promise<UserInterface> {
        try {
            return await this.userRepository.emailExistCheck(email);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getUserByEmail:", error);
            throw new Error("An unexpected error occurred while retrieving user by email."); // Re-throw generic error
        }
    }
    generateToken(payload: string | undefined): string | undefined {
        if (payload) return this.createjwt.generateToken(payload);
    }
    generateRefreshToken(payload: string | undefined): string | undefined {
        if (payload) return this.createjwt.generateRefreshToken(payload);
    }
    async hashPassword(password: string) {
        return await this.encrypt.hashPassword(password);
    }
    async getProfile(id: string | undefined): Promise<UserInterface | null> {
        try {
            if (!id) return null;
            return await this.userRepository.getUserById(id);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getProfile:", error);
            throw new Error("An unexpected error occurred while retrieving user profile."); // Re-throw generic error
        }
    }
    async addSkill(id: string, skill: string): Promise<UserInterface> {
        try {
            const result = await this.userRepository.addSkill(id, skill);
            return result;
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in addSkill:", error);
            throw new Error("An unexpected error occurred while adding skill."); // Re-throw generic error
        }
    }
    async getAllSkill(userId: string): Promise<string[]> {
        try {
            return await this.userRepository.getAllSkill(userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllSkill:", error);
            throw new Error("An unexpected error occurred while retrieving all skills."); // Re-throw generic error
        }
    }
    async removeSkill(id: string, skill: string): Promise<any> {
        try {
            return await this.userRepository.removeSkill(id, skill);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in removeSkill:", error);
            throw new Error("An unexpected error occurred while removing skill."); // Re-throw generic error
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string): Promise<UserInterface> {
        try {
            return await this.userRepository.editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in editUserDetails:", error);
            throw new Error("An unexpected error occurred while editing user details."); // Re-throw generic error
        }
    }
    async updateNewPassword(password: string, userId: string): Promise<UserInterface> {
        try {
            return await this.userRepository.updateNewPassword(password, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in updateNewPassword:", error);
            throw new Error("An unexpected error occurred while updating new password."); // Re-throw generic error
        }
    }
}

export default userService;