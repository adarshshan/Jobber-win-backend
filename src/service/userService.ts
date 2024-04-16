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
        try {
            const user = await this.userRepository.saveUser(userData);
            const token = this.createjwt.generateToken(user?.id);
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    userId: userData.id,
                    token: token
                }
            }

        } catch (error) {
            console.log(error as Error);
            return { status: INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal server error' } };
        }
    }
    async getUserByEmail(email: string): Promise<UserInterface | null> {
        return this.userRepository.emailExistCheck(email);
    }
    generateToken(payload: string | undefined): string | undefined {
        if (payload) return this.createjwt.generateToken(payload);
    }
    hashPassword(password: string) {
        return this.encrypt.hashPassword(password);
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
}

export default userService;