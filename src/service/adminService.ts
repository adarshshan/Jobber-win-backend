import { IAdminRepository } from "../interfaces/repositoryInterfaces/IAdminRepository";
import Admin from "../interfaces/entityInterface/Iadmin";
import { AdminAuthResponse, } from "../interfaces/serviceInterfaces/IadminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { IReportRepository } from "../interfaces/repositoryInterfaces/IReportRepository";
import JobRepository from "../repositories/jobRepository";
import { IPostRepository } from "../interfaces/repositoryInterfaces/IPostRepository";
import UserInterface from "../interfaces/entityInterface/Iuser";
import { NotFoundError, DatabaseError } from '../utils/errors';
import { IJobApplicationRepository } from "../interfaces/repositoryInterfaces/IJobApplicationRepository";
import { IJobReportRepository } from "../interfaces/repositoryInterfaces/IJobReportRepository";


const { UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES

class AdminService {
    constructor(private adminRepository: IAdminRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT,
        private jobReportRepository: IJobReportRepository,
        private reportRepository: IReportRepository,
        private jobRepository: JobRepository,
        private postRepository: IPostRepository,
        private jobApplicationRepository: IJobApplicationRepository) { }

    async adminLogin(email: string, password: string): Promise<AdminAuthResponse> {
        try {
            const admin = await this.adminRepository.isAdminExist(email); // This will now throw NotFoundError if admin not found

            if (admin.password && password) {
                const passwordMatch = await this.encrypt.compare(password, admin.password as string);
                if (passwordMatch) {
                    const token = this.createjwt.generateToken(admin.id);
                    const refreshToken = this.createjwt.generateRefreshToken(admin.id);
                    return {
                        status: OK,
                        data: {
                            success: true,
                            message: 'Authentication Successful !',
                            adminId: admin.id,
                            token: token,
                            refreshToken: refreshToken
                        }
                    };
                } else {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'Authentication failed...',
                        }
                    };
                }
            } else {
                // Should not happen if isAdminExist passes and admin has password
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Authentication failed due to missing password.',
                    }
                };
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Authentication failed: Admin not found.',
                    }
                };
            } else if (error instanceof DatabaseError) {
                console.error("Database error in adminLogin:", error);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server Error during login!',
                    }
                };
            }
            console.error("Unexpected error in adminLogin:", error);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'An unexpected error occurred during login!',
                }
            };
        }
    }

    async adminSignup(adminData: Admin): Promise<Admin | null> {
        try {
            // If isAdminExist throws NotFoundError, it means the admin does not exist, which is good for signup
            const existingAdmin = await this.adminRepository.isAdminExist(adminData.email);
            // If it reaches here, it means an admin with this email already exists
            return existingAdmin;
        } catch (error) {
            if (error instanceof NotFoundError) {
                // Admin does not exist, so it's a valid signup scenario
                return null;
            } else if (error instanceof DatabaseError) {
                console.error("Database error in adminSignup:", error);
                return null; // Indicate failure to check existence
            }
            console.error("Unexpected error in adminSignup:", error);
            return null;
        }
    }
    async saveAdmin(adminData: Admin): Promise<AdminAuthResponse> {
        try {
            const admin = await this.adminRepository.saveAdmin(adminData); // This will now throw DatabaseError on failure
            const token = this.createjwt.generateToken(admin.id);
            const refreshToken = this.createjwt.generateRefreshToken(admin.id);
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    adminId: admin.id,
                    token: token,
                    refreshToken
                }
            };
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in saveAdmin:", error);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error while saving admin!',
                    }
                };
            }
            console.error("Unexpected error in saveAdmin:", error);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'An unexpected error occurred while saving admin!',
                }
            };
        }
    }
    async barChart(): Promise<{ day: any; month: any; year: any }> {
        try {
            const monthly = await this.jobApplicationRepository.getMonthlyApplicationCount();
            const dayly = await this.jobApplicationRepository.getDailyApplicationCount();
            const yearly = await this.jobApplicationRepository.getYearlyApplicationCount();
            return { day: dayly, month: monthly, year: yearly };
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in barChart:", error);
            throw new Error("An unexpected error occurred while retrieving bar chart data."); // Re-throw generic error
        }
    }
    async lineChart(): Promise<{ day: any; month: any; year: any }> {
        try {
            const monthly = await this.jobRepository.getMonthlyJobPostCount();
            const dayly = await this.jobRepository.getDailyJobPostCount();
            const yearly = await this.jobRepository.getYearlyJobPostCount();
            return { day: dayly, month: monthly, year: yearly };
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in lineChart:", error);
            throw new Error("An unexpected error occurred while retrieving line chart data."); // Re-throw generic error
        }
    }
    async pieChart(): Promise<any> { // Adjust return type based on actual data structure
        try {
            // Add actual logic here to retrieve pie chart data
            return {}; // Placeholder
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in pieChart:", error);
            throw new Error("An unexpected error occurred while retrieving pie chart data."); // Re-throw generic error
        }
    }
    async getUserList(page: number, limit: number, searchQuery: string): Promise<UserInterface[]> {
        try {
            return await this.adminRepository.getUserList(page, limit, searchQuery);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getUserList:", error);
            throw new Error("An unexpected error occurred while retrieving user list."); // Re-throw generic error
        }
    }
    async blockNunblockUser(userId: string): Promise<UserInterface> {
        try {
            return await this.adminRepository.blockNunblockUser(userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in blockNunblockUser:", error);
            throw new Error("An unexpected error occurred while blocking/unblocking user."); // Re-throw generic error
        }
    }
    async getAllJobReports(): Promise<any[]> {
        try {
            return await this.jobReportRepository.getAllJobReports();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllJobReports:", error);
            throw new Error("An unexpected error occurred while retrieving all job reports."); // Re-throw generic error
        }
    }
    async getAllPostReports(): Promise<any[]> {
        try {
            return await this.reportRepository.getAllPostReports();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllPostReports:", error);
            throw new Error("An unexpected error occurred while retrieving all post reports."); // Re-throw generic error
        }
    }
    async changeReportStatus(jobId: string): Promise<any> {
        try {
            return await this.jobRepository.changeReportStatus(jobId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in changeReportStatus:", error);
            throw new Error("An unexpected error occurred while changing report status."); // Re-throw generic error
        }
    }
    async deleteJobReport(reportId: string): Promise<any> {
        try {
            return await this.jobReportRepository.deleteJobReport(reportId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deleteJobReport:", error);
            throw new Error("An unexpected error occurred while deleting job report."); // Re-throw generic error
        }
    }
    async deletePostReport(reportId: string): Promise<any> {
        try {
            return await this.reportRepository.deletePostReport(reportId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in deletePostReport:", error);
            throw new Error("An unexpected error occurred while deleting post report."); // Re-throw generic error
        }
    }
    async changePostReportStatus(postId: string): Promise<any> {
        try {
            return await this.postRepository.changePostReportStatus(postId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in changePostReportStatus:", error);
            throw new Error("An unexpected error occurred while changing post report status."); // Re-throw generic error
        }
    }
}

export default AdminService;