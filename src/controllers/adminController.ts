import { Request, Response } from "express";
import AdminService from "../service/adminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/otpGenerator";
import { NotFoundError, DatabaseError } from '../utils/errors';

const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class adminController {
    constructor(private adminService: AdminService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async adminLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const loginStatus = await this.adminService.adminLogin(email, password); // This now returns AdminAuthResponse or throws error

            const time = this.milliseconds(23, 30, 0);
            res.status(loginStatus.status).cookie('admin_access_token', loginStatus.data.token, {
                expires: new Date(Date.now() + time),
                sameSite: 'none',
                secure: true
            }).json(loginStatus);

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed: Admin not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in adminLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during login.' });
            } else if (error instanceof Error) { // Catching generic errors thrown by service for failed authentication
                res.status(UNAUTHORIZED).json({ success: false, message: error.message || 'Authentication failed.' });
            } else {
                console.error("Unexpected error in adminLogin controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred.' });
            }
        }
    }
    async adminSignup(req: Request, res: Response): Promise<void> {
        console.log('Hello world... how are you ...');
        try {
            const existingAdmin = await this.adminService.adminSignup(req.body);

            if (!existingAdmin) { // If existingAdmin is null, it means email does not exist, proceed with OTP
                req.app.locals.newAdmin = true;
                req.app.locals.adminData = req.body;
                req.app.locals.email = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);
                req.app.locals.otp = otp;

                const expirationMinutes = 2;
                setTimeout(() => {
                    delete req.app.locals.otp;
                }, expirationMinutes * 60 * 1000);

                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'Email is already in use!' });
            }
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in adminSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during signup.' });
            } else if (error instanceof Error) {
                console.error("Error in adminSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during signup.' });
            } else {
                console.error("Unexpected error in adminSignup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during signup.' });
            }
        }
    }
    async veryfyOtp(req: Request, res: Response) {
        try {
            const { otp } = req.body;
            const isNewAdmin = req.app.locals.newAdmin;
            const savedAdmin = req.app.locals.adminData;
            if (otp === Number(req.app.locals.otp)) {
                if (isNewAdmin) {
                    const newAdminResponse = await this.adminService.saveAdmin(savedAdmin); // This will now throw DatabaseError on failure
                    req.app.locals = {};
                    res.status(OK).json(newAdminResponse);
                } else {
                    res.status(OK).json({ success: true, message: 'Admin verified.' });
                }
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during OTP verification.' });
            } else if (error instanceof Error) {
                console.error("Error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during OTP verification.' });
            } else {
                console.error("Unexpected error in veryfyOtp controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during OTP verification.' });
            }
        }
    }

    //................dashboard................//
    async barChart(req: Request, res: Response) {
        try {
            const result = await this.adminService.barChart();
            res.json({ success: true, data: result, message: 'Data fetched successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in barChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching bar chart data.' });
            } else if (error instanceof Error) {
                console.error("Error in barChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching bar chart data.' });
            } else {
                console.error("Unexpected error in barChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching bar chart data.' });
            }
        }
    }
    async lineChart(req: Request, res: Response) {
        try {
            const result = await this.adminService.lineChart();
            res.json({ success: true, data: result, message: 'Data fetched successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in lineChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching line chart data.' });
            } else if (error instanceof Error) {
                console.error("Error in lineChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching line chart data.' });
            } else {
                console.error("Unexpected error in lineChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching line chart data.' });
            }
        }
    }
    async pieChart(req: Request, res: Response) {
        try {
            const result = await this.adminService.pieChart();
            res.json({ success: true, data: result, message: 'Data fetched successfully' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in pieChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching pie chart data.' });
            } else if (error instanceof Error) {
                console.error("Error in pieChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching pie chart data.' });
            } else {
                console.error("Unexpected error in pieChart controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching pie chart data.' });
            }
        }
    }

    //users
    async getUserList(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const searchQuery = req.query.searchQuery as string | undefined;
            const data = await this.adminService.getUserList(page, limit, searchQuery ?? '');
            res.status(OK).json({ success: true, data: data, message: 'User list fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getUserList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching user list.' });
            } else if (error instanceof Error) {
                console.error("Error in getUserList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching user list.' });
            } else {
                console.error("Unexpected error in getUserList controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching user list.' });
            }
        }
    }
    async getAllJobReports(req: Request, res: Response) {
        try {
            const result: any = await this.adminService.getAllJobReports();
            res.json({ success: true, data: result, message: 'Job reports fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllJobReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching job reports.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllJobReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching job reports.' });
            } else {
                console.error("Unexpected error in getAllJobReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching job reports.' });
            }
        }
    }
    async changeReportStatus(req: Request, res: Response) {
        try {
            console.log(req.params.jobId);
            const result = await this.adminService.changeReportStatus(req.params.jobId);
            res.json({ success: true, data: result, message: 'Report status changed successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Job not found for changing report status.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in changeReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during report status change.' });
            } else if (error instanceof Error) {
                console.error("Error in changeReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during report status change.' });
            } else {
                console.error("Unexpected error in changeReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during report status change.' });
            }
        }
    }
    async deleteJobReport(req: Request, res: Response) {
        try {
            const reportId = req.params.reportId;
            const result = await this.adminService.deleteJobReport(reportId);
            res.json({ success: true, data: result, message: 'Job report closed successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in deleteJobReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during job report deletion.' });
            } else if (error instanceof Error) {
                console.error("Error in deleteJobReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during job report deletion.' });
            } else {
                console.error("Unexpected error in deleteJobReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during job report deletion.' });
            }
        }
    }
    async deletePostReport(req: Request, res: Response) {
        try {
            const reportId = req.params.reportId;
            const result = await this.adminService.deletePostReport(reportId);
            res.json({ success: true, data: result, message: 'Post report closed successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in deletePostReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during post report deletion.' });
            } else if (error instanceof Error) {
                console.error("Error in deletePostReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during post report deletion.' });
            } else {
                console.error("Unexpected error in deletePostReport controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during post report deletion.' });
            }
        }
    }
    async changePostReportStatus(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const result = await this.adminService.changePostReportStatus(postId);
            res.json({ success: true, data: result, message: 'Post report status changed successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in changePostReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during post report status change.' });
            } else if (error instanceof Error) {
                console.error("Error in changePostReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during post report status change.' });
            } else {
                console.error("Unexpected error in changePostReportStatus controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during post report status change.' });
            }
        }
    }
    async getAllPostReports(req: Request, res: Response) {
        try {
            const result = await this.adminService.getAllPostReports();
            res.json({ success: true, data: result, message: 'Post reports fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllPostReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching post reports.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllPostReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching post reports.' });
            } else {
                console.error("Unexpected error in getAllPostReports controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching post reports.' });
            }
        }
    }
    async blockNunblockUser(req: Request, res: Response) {
        try {
            const result = await this.adminService.blockNunblockUser(req.params.userId as string);
            res.json({ success: true, data: result, message: 'User block/unblock status updated successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'User not found for block/unblock operation.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in blockNunblockUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during block/unblock operation.' });
            } else if (error instanceof Error) {
                console.error("Error in blockNunblockUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during block/unblock operation.' });
            } else {
                console.error("Unexpected error in blockNunblockUser controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during block/unblock operation.' });
            }
        }
    }
    async adminLogout(req: Request, res: Response) {
        try {
            res.cookie('admin_access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true, message: 'logout sucessfully' })
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' })
        }
    }
    sentNotification(req: Request, res: Response) {

    }
}

export default adminController;