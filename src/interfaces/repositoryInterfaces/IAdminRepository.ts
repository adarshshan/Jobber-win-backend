import Admin from "../entityInterface/Iadmin";
import UserInterface from "../entityInterface/Iuser";
import { AdminInterface } from "../../models/adminModel";

export interface IAdminRepository {
    isAdminExist(email: string): Promise<Admin>;
    saveAdmin(adminData: Admin): Promise<Admin>;
    getUserList(page: number, limit: number, searchQuery: string): Promise<UserInterface[]>;
    getUserCount(searchQuery: string): Promise<number>;
    blockNunblockUser(userId: string): Promise<UserInterface>;
    getAdminById(id: string): Promise<AdminInterface>;
}