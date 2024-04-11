import UserInterface from "../interfaces/entityInterface/Iuser";
import { UserAuthResponse } from "../interfaces/serviceInterfaces/IuserService";
import UserRepository from "../repositories/userRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";

const { OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;



class userService {
    constructor(private userRepository: UserRepository) { }

    async userLogin(email: string, password: string) {
        try {

        } catch (error) {
            console.log(error);
            console.log('.......error from ')
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
    async saveUser(userData: UserInterface): Promise<UserAuthResponse> {
        try {
            const user = await this.userRepository.saveUser(userData);
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    userId: userData.id,
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { status: INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal server error' } };
        }
    }
    // async userSignup()
}

export default userService;