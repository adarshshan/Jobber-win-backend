import UserInterface from "../entityInterface/Iuser";

export interface UserAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: UserInterface,
        userId?: string;
        token?: string;
    };
}