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
    async deleteProfilePic(userId: string) {
        try {
            console.log(userId); console.log('data from delete pic repository');
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
            console.log(userId + 'from the end of the line...');
            const data = await userModel.findOne({ _id: userId }, { _id: 0, skills: 1 });
            const skills = data?.skills;
            return skills;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeSkill(id: string, skill: string) {
        try {
            console.log(skill + '  from the end...');
            const updated = await userModel.updateOne({ _id: id }, { $pull: { skills: skill } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string) {
        try {
            console.log(name, phoneNumber, gender, location, headLine, qualification, userId); console.log('data from the end of the line...');
            const user = await userModel.findById(userId);
            if (user) {
                user.name = name || user.name;
                user.phoneNumber = phoneNumber || user.phoneNumber;
                user.gender = gender || user.gender;
                user.location = location || user.location;
                user.headLine = headLine || user.headLine;
                user.qualification = qualification || user.qualification;
            }
            const updatedUser = await user?.save(); console.log(updatedUser); console.log('user saved');
            return updatedUser
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default UserRepository;