import { Request, Response } from "express"
import userService from "../service/userService";

class userController {
    constructor(private userServices: userService) { }

    async userLogin(req: Request, res: Response) {
        this.userServices.userLogin('adarshshanu', 'shanshanu');
    }
    async googleLogin(req: Request, res: Response) {
        console.log('googleLogin..')
    }
    async userSingnup(req: Request, res: Response) {
        req.app.locals.userData = req.body;
        this.userServices.userSignup(req.app.locals.userData);
    }
    async profile(req: Request, res: Response) {
        console.log('profile page .....')
    }
    async editUserDetails(req: Request, res: Response) {
        console.log('edit user detailss.....')
    }
    async changeAboutInfo(req: Request, res: Response) {
        console.log('change the about information...');
    }
    async setProfilePic(req: Request, res: Response) {
        console.log('set the new profile pic...');
    }
    async addSkill(req: Request, res: Response) {
        console.log('add skill')
    }
    async removeSkill(req: Request, res: Response) {
        console.log('remove skill')
    }
    async forgotPassword(req: Request, res: Response) {
        console.log('forgot password password...');
    }
    async changePassword(req: Request, res: Response) {
        console.log('change password...');
    }

}

export default userController