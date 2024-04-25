import { Request, Response } from "express";
import NetworkService from "../service/networkService";
import { PostInterface } from "../models/postModel";


class NetworkController {
    constructor(private networkService: NetworkService) { }

    async getAllUsers(req: Request, res: Response) {
        try {
            console.log(req.userId);
            if (req.userId) {
                const result = await this.networkService.getAllUsers(req.userId);
                res.json({ success: true, data: result, message: 'Data Fetched Successfully' });
            } else res.json({ success: false, message: 'Failed to fetch the details' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'somthing went wrong while fetching data' });
        }
    }
    async getUserProfile(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const result = await this.networkService.getUserProfile(userId)
            if (result) res.json({ success: true, data: result, message: 'Data fetched successfully' });
            else res.json({ success: false, message: 'somthing went wrong while fetching the profile details of the user' })
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error' });
        }
    }
    async getUserPostsById(req: Request, res: Response) {
        try {
            const result = await this.networkService.getUserPostsById(req.params.userId);
            if (result) res.json({ success: true, data: result, message: 'postData fetched successfully' });
            else res.json({ success: false, message: 'failed to fetch the posts' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error' });
        }
    }
}

export default NetworkController;