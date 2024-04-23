import UserInterface from '../interfaces/entityInterface/Iuser';
import userModel from '../models/userModel';


class UserRepository {
    async emailExistCheck(email: string): Promise<UserInterface | null> {
        try {
            console.log(email); console.log('your email');
            const userFound = await userModel.findOne({ email: email });
            return userFound as UserInterface;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async saveUser(userData: UserInterface): Promise<UserInterface | null> {
        try {
            const newUser = new userModel(userData);
            await newUser.save();
            return newUser as UserInterface
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getUserById(id: string): Promise<UserInterface | null> {
        try {
            return await userModel.findById(id);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async changeAboutInfo(id: string, text: string): Promise<string | undefined> {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { aboutInfo: text }, { new: true });
            if (updated) return text
        } catch (error) {
            console.log(error as Error)
        }
    }
    async setProfilePic(pic: string, id: string) {
        try {
            console.log('Yess Its at the end...'); console.log(`data at ${pic + id}`)
            const updated = await userModel.findByIdAndUpdate(id, { profile_picture: pic });
            console.log(updated); console.log('yes this is the updated result;')
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addSkill(id: string, skill: string) {
        try {
            const updated = await userModel.findOneAndUpdate({ _id: id }, { $addToSet: { skills: skill } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllSkill(userId: string) {
        try {
            console.log(userId + 'from the end of the line...');
            const data = await userModel.findOne({ _id: userId }, { _id: 0, skills: 1 });
            const skills = data?.skills;
            return skills;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default UserRepository;