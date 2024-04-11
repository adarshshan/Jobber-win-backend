import { Request } from "express";
import AdminModel, { AdminInterface } from "../models/adminModel";
import AdminRepository from "../repositories/adminRepository";
import Admin from "../interfaces/entityInterface/Iadmin";
import { AdminAuthResponse } from "../interfaces/serviceInterfaces/IadminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";



class AdminService {
    constructor(private adminReopsitory: AdminRepository) { }

    async adminLogin(adminLoginData: AdminInterface, req: Request) {
        console.log(req.app.locals.adminLoginData);
        console.log('...............');
        console.log(adminLoginData);
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