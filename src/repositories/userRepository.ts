import UserInterface, { IUserCreateData } from '../interfaces/entityInterface/Iuser';
import { SubInterface } from '../interfaces/serviceInterfaces/subscription';
import userModel from '../models/userModel';
import mongoose from 'mongoose';


import { IUserRepository } from "../interfaces/repositoryInterfaces/IuserRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class UserRepository implements IUserRepository {
    async emailExistCheck(email: string): Promise<UserInterface> {
        try {
            const userFound = await userModel.findOne({ email });
            if (!userFound) {
                throw new NotFoundError(`User with email ${email} not found.`);
            }
            return userFound as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error; // Re-throw NotFoundError
            }
            console.error("Error in emailExistCheck:", error); // Use console.error for errors
            throw new DatabaseError(`Failed to check email existence for ${email}.`, error as Error);
        }
    }
    async saveUser(userData: IUserCreateData): Promise<UserInterface> {
        try {
            const newUser = new userModel(userData);
            await newUser.save();
            return newUser as UserInterface;
        } catch (error) {
            console.error("Error in saveUser:", error);
            throw new DatabaseError(`Failed to save user with email ${userData.email}.`, error as Error);
        }
    }
    async getAllUsers(search: string | undefined, userId: string): Promise<UserInterface[]> {
        try {
            const keyword = search ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            } : {};
            const allUsers = await userModel.find(keyword).find({ _id: { $ne: userId } });
            return allUsers as UserInterface[];
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw new DatabaseError(`Failed to retrieve all users.`, error as Error);
        }
    }
    async getUserById(id: string): Promise<UserInterface> {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new NotFoundError(`User with ID ${id} not found.`);
            }
            return user as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getUserById:", error);
            throw new DatabaseError(`Failed to retrieve user with ID ${id}.`, error as Error);
        }
    }
    async getApplied(userId: string): Promise<any[]> {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const UserId = new ObjectId(userId);

            const user = await userModel.aggregate([
                { $match: { _id: UserId } },
                { $unwind: "$appliedJobs" },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "appliedJobs.jobId",
                        foreignField: "_id",
                        as: "appliedJobs.jobDetails"
                    }
                },
                {
                    $addFields: {
                        "appliedJobs.jobDetails": { $arrayElemAt: ["$appliedJobs.jobDetails", 0] }
                    }
                },
                { $sort: { "appliedJobs.appliedAt": -1 } },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        role: { $first: "$role" },
                        profile_picture: { $first: "$profile_picture" },
                        cover_image: { $first: "$cover_image" },
                        skills: { $first: "$skills" },
                        aboutInfo: { $first: "$aboutInfo" },
                        appliedJobs: { $push: "$appliedJobs" }
                    }
                }
            ]);
            if (user[0]?.appliedJobs === undefined) return [];
            else return user[0]?.appliedJobs;
        } catch (error) {
            console.error("Error in getApplied:", error);
            throw new DatabaseError(`Failed to retrieve applied jobs for user ID ${userId}.`, error as Error);
        }
    }
    async changeAboutInfo(id: string, text: string): Promise<string> {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { aboutInfo: text }, { new: true });
            if (!updated) {
                throw new NotFoundError(`User with ID ${id} not found for updating about info.`);
            }
            return text;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in changeAboutInfo:", error);
            throw new DatabaseError(`Failed to change about info for user ID ${id}.`, error as Error);
        }
    }
    async setProfilePic(pic: string, id: string): Promise<UserInterface> {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { profile_picture: pic }, { new: true });
            if (!updated) {
                throw new NotFoundError(`User with ID ${id} not found for setting profile picture.`);
            }
            return updated as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in setProfilePic:", error);
            throw new DatabaseError(`Failed to set profile picture for user ID ${id}.`, error as Error);
        }
    }
    async deleteProfilePic(userId: string): Promise<any> { // Mongoose UpdateWriteOpResult or similar
        try {
            const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { profile_picture: "" } });
            if (updatedUser.matchedCount === 0) {
                throw new NotFoundError(`User with ID ${userId} not found for deleting profile picture.`);
            }
            return updatedUser;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in deleteProfilePic:", error);
            throw new DatabaseError(`Failed to delete profile picture for user ID ${userId}.`, error as Error);
        }
    }
    async addSkill(id: string, skill: string): Promise<UserInterface> {
        try {
            const updated = await userModel.findOneAndUpdate({ _id: id }, { $addToSet: { skills: skill } }, { new: true });
            if (!updated) {
                throw new NotFoundError(`User with ID ${id} not found for adding skill.`);
            }
            return updated as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in addSkill:", error);
            throw new DatabaseError(`Failed to add skill for user ID ${id}.`, error as Error);
        }
    }
    async getAllSkill(userId: string): Promise<string[]> {
        try {
            const data = await userModel.findOne({ _id: userId }, { _id: 0, skills: 1 });
            if (!data) {
                throw new NotFoundError(`User with ID ${userId} not found for retrieving skills.`);
            }
            const skills = data.skills;
            return skills || []; // Ensure an empty array is returned if skills is null/undefined
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getAllSkill:", error);
            throw new DatabaseError(`Failed to retrieve skills for user ID ${userId}.`, error as Error);
        }
    }
    async removeSkill(id: string, skill: string): Promise<any> { // Mongoose UpdateWriteOpResult or similar
        try {
            const updated = await userModel.updateOne({ _id: id }, { $pull: { skills: skill } });
            if (updated.matchedCount === 0) {
                throw new NotFoundError(`User with ID ${id} not found for removing skill.`);
            }
            return updated;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in removeSkill:", error);
            throw new DatabaseError(`Failed to remove skill for user ID ${id}.`, error as Error);
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string): Promise<UserInterface> {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    name: name,
                    phoneNumber: phoneNumber,
                    gender: gender,
                    location: location,
                    headLine: headLine,
                    qualification: qualification,
                },
                { new: true }
            );
            if (!updatedUser) {
                throw new NotFoundError(`User with ID ${userId} not found for updating details.`);
            }
            return updatedUser as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in editUserDetails:", error);
            throw new DatabaseError(`Failed to edit user details for user ID ${userId}.`, error as Error);
        }
    }
    async updateNewPassword(password: string, userId: string): Promise<UserInterface> {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { password: password },
                { new: true }
            );
            if (!updatedUser) {
                throw new NotFoundError(`User with ID ${userId} not found for updating password.`);
            }
            return updatedUser as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in updateNewPassword:", error);
            throw new DatabaseError(`Failed to update password for user ID ${userId}.`, error as Error);
        }
    }

    async saveJob(userId: string, jobId: string): Promise<{ success: boolean; data?: UserInterface; message: string }> {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError(`User with ID ${userId} not found for saving job.`);
            }

            const savedJobs = user.savedJobs?.some(job => job.jobId.toString() === jobId);

            if (!savedJobs) {
                const updatedUser = await userModel.findByIdAndUpdate(
                    userId,
                    { $addToSet: { savedJobs: { jobId: jobId } } },
                    { new: true }
                );
                return { success: true, data: updatedUser as UserInterface, message: 'successfully saved the job' };
            } else {
                return { success: false, message: 'already saved the job' };
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in saveJob:", error);
            throw new DatabaseError(`Failed to save job for user ID ${userId}.`, error as Error);
        }
    }

    async unsaveJob(userId: string, jobId: string): Promise<UserInterface> {
        try {
            const user = await userModel.findByIdAndUpdate(
                userId,
                { $pull: { savedJobs: { jobId: jobId } } },
                { new: true }
            );
            if (!user) {
                throw new NotFoundError(`User with ID ${userId} not found for unsaving job.`);
            }
            return user as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in unsaveJob:", error);
            throw new DatabaseError(`Failed to unsave job for user ID ${userId}.`, error as Error);
        }
    }
    async getAllSavedJobs(userId: string): Promise<any[]> {
        try {
            const allData = await userModel.findById(userId)
                .populate('savedJobs.jobId');
            if (!allData) {
                throw new NotFoundError(`User with ID ${userId} not found for retrieving saved jobs.`);
            }
            const savedJobs = allData.savedJobs?.map((item) => item.jobId);
            return savedJobs || [];
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getAllSavedJobs:", error);
            throw new DatabaseError(`Failed to retrieve saved jobs for user ID ${userId}.`, error as Error);
        }
    }

    async appliedJob(userId: string, jobId: string): Promise<UserInterface> {
        try {
            const user = await userModel.findByIdAndUpdate(
                userId,
                { $push: { appliedJobs: { jobId: jobId } } },
                { new: true }
            );
            if (!user) {
                throw new NotFoundError(`User with ID ${userId} not found for applying job.`);
            }
            return user as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in appliedJob:", error);
            throw new DatabaseError(`Failed to apply job for user ID ${userId}.`, error as Error);
        }
    }
    //.............subscription//................

    async updateSubPlan(userId: string, item: SubInterface): Promise<void> {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $set: { subscription: { sub_Id: item._id, purchased_At: Date.now() } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new NotFoundError(`User with ID ${userId} not found for updating subscription plan.`);
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in updateSubPlan:", error);
            throw new DatabaseError(`Failed to update subscription plan for user ID ${userId}.`, error as Error);
        }
    }
}

export default UserRepository;