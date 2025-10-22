import { IAdminRepository } from "../interfaces/repositoryInterfaces/IAdminRepository";
import Admin from "../interfaces/entityInterface/Iadmin";
import { AdminAuthResponse, IUsersAndCount } from "../interfaces/serviceInterfaces/IadminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { IApiRes } from "../interfaces/common/Icommon";
import { IReportRepository } from "../interfaces/repositoryInterfaces/IReportRepository";
import JobRepository from "../repositories/jobRepository";
import { IPostRepository } from "../interfaces/repositoryInterfaces/IPostRepository";
import { IJobApplicationRepository } from "../interfaces/repositoryInterfaces/IJobApplicationRepository";
import { IJobReportRepository } from "../interfaces/repositoryInterfaces/IJobReportRepository";



class AdminService {
    constructor(private adminReopsitory: IAdminRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,
        private jobReportRepository: IJobReportRepository,
        private reportRepository: IReportRepository,
        private jobRepository: JobRepository,
        private postRepository: IPostRepository,
        private jobApplicationRepository: IJobApplicationRepository) { }

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
    async barChart() {
        try {
            const monthly = await this.jobApplicationRepository.getMonthlyApplicationCount();
            const dayly = await this.jobApplicationRepository.getDailyApplicationCount();
            const yearly = await this.jobApplicationRepository.getYearlyApplicationCount();
            return { day: dayly, month: monthly, year: yearly };
        } catch (error) {
            console.log(error as Error);
            throw new Error('Something went wrong');
        }
    }
    async lineChart() {
        try {
            const monthly = await this.jobRepository.getMonthlyJobPostCount()
            const dayly = await this.jobRepository.getDailyJobPostCount()
            const yearly = await this.jobRepository.getYearlyJobPostCount()
            return { day: dayly, month: monthly, year: yearly };
        } catch (error) {
            console.log(error as Error);
            throw new Error('Something went wrong');
        }
    }
    async pieChart() {
        try {

        } catch (error) {
            console.log(error as Error)
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
    async blockNunblockUser(userId: string) {
        try {
            return await this.adminReopsitory.blockNunblockUser(userId);
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