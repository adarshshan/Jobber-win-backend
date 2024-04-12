import { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

export class CreateJWT {
    generateToken(payload: string | undefined): string | undefined {
        return jwt.sign(payload, process.env.JWT_SECRET as Secret);
    }
}
