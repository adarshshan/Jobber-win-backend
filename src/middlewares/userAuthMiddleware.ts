import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import UserRepository from '../repositories/userRepository';

const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {

    let token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
    }
    try {
        const decoded = jwt.verifyToken(token);


        if (decoded) {
            let user = await userRepository.getUserById(decoded.toString());
            console.log('user details is below');
            console.log(user);
            if (user?.isBlocked) {
                return res.status(401).send({ success: false, message: "User is blocked by admin!" })
            } else {
                console.log('hey im reached here...');
                req.userId = decoded.toString();
                next();
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" })
        }

    } catch (err) {
        console.log(err); console.log('error is in the catch block!');
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}

export default userAuth;