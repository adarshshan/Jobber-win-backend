import { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

const generateToken = (id: string|undefined):string|undefined => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
const generateTokenForAdmin = (id: string | number) => {
    return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, { expiresIn: "30d" });
}
export class createJWT {
    generateToken = (payload: any): string => {
        const jwtSecret = process.env.JWT_SECRET
        return jwt.sign(payload, jwtSecret as Secret, { expiresIn: '5h' });
    };
}

export {
    generateToken,
    generateTokenForAdmin
};