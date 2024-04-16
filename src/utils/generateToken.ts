import { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

export class CreateJWT {
    generateToken(payload: string | undefined): string | undefined {
        return jwt.sign(payload, process.env.JWT_SECRET as Secret);
    }
    verifyToken(token: string): JwtPayload | null {
        try {
            let secret = process.env.JWT_SECRET;
            console.log(`secret code is ${secret}`);
            const decoded = jwt.verify(token, secret) as JwtPayload;
            console.log('your code is checking...');
            console.log(decoded);console.log('this')
            return decoded;
        } catch (err) {
            console.error('Error while verifying JWT token:', err);
            return null;
        }
    }
}
