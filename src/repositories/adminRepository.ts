import Admin from '../interfaces/entityInterface/Iadmin';
import UserInterface from '../interfaces/entityInterface/Iuser';
import AdminModel, { AdminInterface } from '../models/adminModel';
import userModel from '../models/userModel';

import { IAdminRepository } from "../interfaces/repositoryInterfaces/IAdminRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';

class AdminRepository implements IAdminRepository {
    async isAdminExist(email: string): Promise<Admin> {
        try {
            const admin = await AdminModel.findOne({ email });
            if (!admin) {
                throw new NotFoundError(`Admin with email ${email} not found.`);
            }
            return admin as Admin;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in isAdminExist:", error);
            throw new DatabaseError(`Failed to check admin existence for ${email}.`, error as Error);
        }
    }
    async saveAdmin(adminData: Admin): Promise<Admin> {
        try {
            const newAdmin = new AdminModel(adminData);
            await newAdmin.save();
            return newAdmin as Admin;
        } catch (error) {
            console.error("Error in saveAdmin:", error);
            throw new DatabaseError(`Failed to save admin with email ${adminData.email}.`, error as Error);
        }
    }
    async getUserList(page: number, limit: number, searchQuery: string): Promise<UserInterface[]> {
        try {
            const regex = new RegExp(searchQuery, 'i');
            const result = await userModel.find(
                {
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-password')
                .exec();
            return result as UserInterface[];
        } catch (error) {
            console.error("Error in getUserList:", error);
            throw new DatabaseError(`Failed to retrieve user list with search query "${searchQuery}".`, error as Error);
        }
    }
    async getUserCount(searchQuery: string): Promise<number> {
        try {
            const regex = new RegExp(searchQuery, 'i');
            return await userModel.find(
                {
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }).countDocuments();
        } catch (error) {
            console.error("Error in getUserCount:", error);
            throw new DatabaseError(`Failed to retrieve user count with search query "${searchQuery}".`, error as Error);
        }
    }
    async blockNunblockUser(userId: string): Promise<UserInterface> {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError(`User with ID ${userId} not found for block/unblock operation.`);
            }
            user.isBlocked = !user.isBlocked;
            await user.save();
            return user as UserInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in blockNunblockUser:", error);
            throw new DatabaseError(`Failed to block/unblock user with ID ${userId}.`, error as Error);
        }
    }
    async getAdminById(id: string): Promise<AdminInterface> {
        try {
            const admin = await AdminModel.findById(id);
            if (!admin) {
                throw new NotFoundError(`Admin with ID ${id} not found.`);
            }
            return admin as AdminInterface;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error("Error in getAdminById:", error);
            throw new DatabaseError(`Failed to retrieve admin with ID ${id}.`, error as Error);
        }
    }
}

export default AdminRepository;