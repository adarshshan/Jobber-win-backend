import Admin from "../entityInterface/Iadmin";

export interface AdminAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: Admin,
        adminId?: string;
        token?: string;
    };
}