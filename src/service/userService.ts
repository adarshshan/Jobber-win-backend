import UserInterface from "../interfaces/entityInterface/Iuser";
import { UserAuthResponse } from "../interfaces/serviceInterfaces/IuserService";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;



class userService {
    constructor(private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT) { }

    async userLogin(email: string, password: string): Promise<UserAuthResponse | undefined> {
        try {
            const user: UserInterface | null = await this.userRepository.emailExistCheck(email);
            const token = this.createjwt.generateToken(user?.id);
            if (user && user.isBlocked) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'You have been blocked by the admin !',
                        token: token,
                        data: user
                    }
                } as const;
            }
            if (user?.password && password) {
                const passwordMatch = await this.encrypt.compare(password, user.password as string);
                if (passwordMatch) {
                    const token = this.createjwt.generateToken(user.id);
                    console.log(`your token is ${token}`);
                    return {
                        status: OK,
                        data: {
                            success: true,
                            message: 'Authentication Successful !',
                            data: user,
                            userId: user.id,
                            token: token
                        }
                    } as const;
                } else {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'Authentication failed...',
                        }
                    } as const;
                }
            }
        } catch (error) {
            console.log(error as Error);
            console.log('.......error from ')
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server Error!',
                }
            } as const;
        }
    }

    async userSignup(userData: UserInterface): Promise<UserInterface | null> {
        try {
            return await this.userRepository.emailExistCheck(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }
    async saveUser(userData: UserInterface): Promise<UserAuthResponse | undefined> {
        console.log(userData);
        try {
            const user = await this.userRepository.saveUser(userData); console.log(user)
            if (user) {
                const token = this.createjwt.generateToken(user?.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
                        userId: userData.id,
                        token: token,
                        data: user
                    }
                }
            }


        } catch (error) {
            console.log(error as Error);
            return { status: INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal server error' } };
        }
    }
    async changeAboutInfo(id: string, text: string): Promise<string | undefined> {
        try {
            const changed = await this.userRepository.changeAboutInfo(id, text);
            return changed
        } catch (error) {
            console.log(error as Error);
        }
    }
    async setProfilePic(pic: string, id: string) {
        try {
            console.log(`data received at service ${pic + id}`);
            const result = await this.userRepository.setProfilePic(pic, id);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProfilePic(userId: string) {
        try {
            return await this.userRepository.deleteProfilePic(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getUserByEmail(email: string): Promise<UserInterface | null> {
        console.log(email + 'from service');
        return this.userRepository.emailExistCheck(email);
    }
    generateToken(payload: string | undefined): string | undefined {
        if (payload) return this.createjwt.generateToken(payload);
    }
    async hashPassword(password: string) {
        return await this.encrypt.hashPassword(password);
    }
    getProfile(id: string | undefined): Promise<UserInterface | null> | null {
        try {
            if (!id) return null;
            return this.userRepository.getUserById(id);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async addSkill(id: string, skill: string) {
        try {
            console.log(skill);
            const result = await this.userRepository.addSkill(id, skill);
            return result;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllSkill(userId: string) {
        try {
            return await this.userRepository.getAllSkill(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeSkill(id: string, skill: string) {
        try {
            console.log(skill);
            return await this.userRepository.removeSkill(id, skill);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string) {
        try {
            return await this.userRepository.editUserDetails(name, phoneNumber, gender, location, headLine, qualification, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default userService;