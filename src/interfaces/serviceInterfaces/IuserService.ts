

interface UserInterface {
    id?: string | undefined;
    name?: string;
    email: string;
    phone?: number;
    password?: string | Promise<string>;
    designation?: string;
    about?: string;
    profile_picture?: string;
    skills?: string[];
    isBlocked?: boolean;
}

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