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
            const updated = await userModel.findByIdAndUpdate(id, { profile_picture: pic });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteProfilePic(userId: string) {
        try {
            const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { profile_picture: "" } });
            return updatedUser;
        } catch (error) {
            console.log(error);
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
            const data = await userModel.findOne({ _id: userId }, { _id: 0, skills: 1 });
            const skills = data?.skills;
            return skills;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeSkill(id: string, skill: string) {
        try {
            const updated = await userModel.updateOne({ _id: id }, { $pull: { skills: skill } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string) {
        try {
            console.log(name, phoneNumber, gender, location, headLine, qualification, userId);
            const user = await userModel.findById(userId);
            if (user) {
                user.name = name || user.name;
                user.phoneNumber = phoneNumber || user.phoneNumber;
                user.gender = gender || user.gender;
                user.location = location || user.location;
                user.headLine = headLine || user.headLine;
                user.qualification = qualification || user.qualification;
            }
            const updatedUser = await user?.save();
            return updatedUser
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default UserRepository;