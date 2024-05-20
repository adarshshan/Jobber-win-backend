import { Request } from "express";
import AdminModel, { AdminInterface } from "../models/adminModel";
import AdminRepository from "../repositories/adminRepository";
import Admin from "../interfaces/entityInterface/Iadmin";
import { AdminAuthResponse, IUsersAndCount } from "../interfaces/serviceInterfaces/IadminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { IApiRes } from "../interfaces/common/Icommon";
import ReportRepository, { JobReportRepository } from "../repositories/reportRepository";
import JobRepository from "../repositories/jobRepository";
import PostRepository from "../repositories/postRepository";



class AdminService {
    constructor(private adminReopsitory: AdminRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,
        private jobReportRepository: JobReportRepository,
        private reportRepository: ReportRepository,
        private jobRepository: JobRepository,
        private postRepository: PostRepository) { }

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
                        message: 'Incorrect password!'
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
    async getUserList(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<IUsersAndCount>> {
        try {
            if (isNaN(page)) page = 1;
            if (isNaN(limit)) limit = 10;
            if (!searchQuery) searchQuery = '';
            const users = await this.adminReopsitory.getUserList(page, limit, searchQuery);
            const usersCount = await this.adminReopsitory.getUserCount(searchQuery);

            return {
                status: STATUS_CODES.OK,
                data: { users, usersCount },
                message: 'success',
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error occured.');
        }
    }
    async blockNunblockUser(userId: string): Promise<void> {
        try {
            await this.adminReopsitory.blockNunblockUser(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllJobReports() {
        try {
            return await this.jobReportRepository.getAllJobReports();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllPostReports() {
        try {
            return await this.reportRepository.getAllPostReports();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changeReportStatus(jobId: string) {
        try {
            return await this.jobRepository.changeReportStatus(jobId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJobReport(reportId: string) {
        try {
            return await this.jobReportRepository.deleteJobReport(reportId);
        } catch (error) {
            console.log(error as Error)
        }
    }
    async deletePostReport(reportId: string) {
        try {
            return await this.reportRepository.deletePostReport(reportId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changePostReportStatus(postId: string) {
        try {
            return await this.postRepository.changePostReportStatus(postId);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default AdminService;