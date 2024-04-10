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
    async saveUser(userData: { name: string, phone: number, password: string, location: string, email: string }) {
        
    }
}

export default UserRepository;