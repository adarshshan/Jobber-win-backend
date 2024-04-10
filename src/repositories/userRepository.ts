import userModel from '../models/userModel';


class UserRepository {
    async emailExistCheck(email: string) {
        try {
            const userFound = await userModel.findOne({ email: email });
            return userFound;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    sample(email: string, password: string) {
        console.log(`your email is ${email} and your password is ${password}`);
    }
}

export default UserRepository;