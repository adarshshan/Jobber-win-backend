import { Document } from "mongoose";
import Admin from "../entityInterface/Iadmin";
import UserInterface from "../entityInterface/Iuser";
import { AdminInterface } from "../../models/adminModel";

export interface IAdminRepository {
    isAdminExist(email: string): Promise<Admin | null>;
    saveAdmin(adminData: Admin): Promise<Admin | null>;
    getUserList(page: number, limit: number, searchQuery: string): Promise<(UserInterface & Document)[]>;
    getUserCount(searchQuery: string): Promise<number>;
    blockNunblockUser(userId: string): Promise<(UserInterface & Document) | null>;
    getAdminById(id: string): Promise<(AdminInterface & Document) | null>;
}