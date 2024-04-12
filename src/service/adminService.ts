import { Request } from "express";
import AdminModel, { AdminInterface } from "../models/adminModel";
import AdminRepository from "../repositories/adminRepository";
import Admin from "../interfaces/entityInterface/Iadmin";
import { AdminAuthResponse } from "../interfaces/serviceInterfaces/IadminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";



class AdminService {
    constructor(private adminReopsitory: AdminRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT) { }

    async adminLogin(email: string, password: string): Promise<AdminAuthResponse | undefined> {
        const admin: Admin | null = await this.adminReopsitory.isAdminExist(email);
        if (admin?.password && password) {
            const passwordMatch = await this.encrypt.compare(password, admin.password);
            if (passwordMatch) {
                const token = this.createjwt.generateToken(admin.id);
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        success: true,
                        message: 'Authentication Successful !',
                        data: admin,
                        adminId: admin.id,
                        token: token
                    }
                } as const;
            } else {
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Authentication failed'
                    }
                } as const;
            }
        }
    }

    async adminSignup(adminData: Admin): Promise<Admin | null> {
        try {
            return await this.adminReopsitory.isAdminExist(adminData.email);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async saveAdmin(adminData: Admin): Promise<AdminAuthResponse> {
        try {
            const admin = await this.adminReopsitory.saveAdmin(adminData);
            return {
                status: STATUS_CODES.OK,
                data: {
                    success: true,
                    message: 'Success',
                    adminId: admin?.id
                }
            }

        } catch (error) {
            console.log(error as Error);
            return { status: STATUS_CODES.INTERNAL_SERVER_ERROR, data: { success: false, message: 'Internal Error.' } };
        }
    }
}

export default AdminService;