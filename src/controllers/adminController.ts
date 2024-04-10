import { Request, Response } from "express";
import AdminService from "../service/adminService";

class adminController {
    constructor(private adminService: AdminService) { }

    async adminLogin(req: Request, res: Response) {
        res.send('admin login')
    }
    async adminSignup(req:Request,res:Response){
        req.app.locals.adminData=req.body;
        await this.adminService.adminSignup(req.app.locals.adminData);
    }
    async getSubscriptionList(req: Request, res: Response) {

    }
    async deleteSubscription(req: Request, res: Response) {

    }
    async editSubscription(req: Request, res: Response) {

    }
    async createSubscription(req: Request, res: Response) {

    }
    //users
    getUserList(req: Request, res: Response) {

    }
    blockUser(req: Request, res: Response) {

    }
    sentNotification(req: Request, res: Response) {

    }
}

export default adminController;