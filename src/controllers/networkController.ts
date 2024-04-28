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
    async sendRequest(req: Request, res: Response) {
        try {
            const { receiverId } = req.body;
            const senderId = req.userId;
            if (senderId) {
                const result = await this.networkService.sendRequest(receiverId, senderId);
                if (result) res.json({ success: true, data: result.sender, message: 'request has been sent.' });
                else res.json({ success: false, message: 'somthing went wrong while sending the send request.' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error!' });
        }
    }
    async getAllRequests(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.getAllRequests(userId);
                if (result) res.json({ success: true, data: result, message: 'request data fetched successfully.' });
                else res.json({ success: false, message: 'Somthing went wrong while fetching data.' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal Error' });
        }
    }
    async addToFriend(req: Request, res: Response) {
        try {
            const { friendId } = req.params;
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.addToFriend(userId, friendId);
                if (result) res.json({ success: true, data: result, message: 'user added to the friend list.' });
                else res.json({ success: false, message: 'Somthing went wrong while adding user to the friend list.' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal Error occured' });
        }
    }
    async getAllFriends(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.getAllFriends(userId);
                if (result) res.json({ success: true, data: result, message: 'Friend list fetched.' });
                else res.json({ success: false, message: 'Failed To fetch the friend list!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal Error' });
        }
    }
    async unFriend(req: Request, res: Response) {
        try {
            const id = req.params.id
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.unFriend(id, userId);
                if (result) res.json({ success: true, message: 'successfull' });
                else res.json({ success: false, message: 'somthing went wrong while unfriend' });
            }

        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: "Internal error" });
        }
    }
    async removeRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.removeRequest(id, userId);
                if (result) res.json({ success: true, message: 'user Removed from the request list.' });
                else res.json({ success: false, message: 'somthing went wrong while removing the user from the list!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error!' });
        }
    }
    async getAllsendRequests(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.networkService.getAllsendRequests(userId);
                if (result) res.json({ success: true, data: result, message: 'successful' });
                else res.json({ success: false, message: 'somthing went wrong while fetching the sendrequestes!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error!' });
        }
    }
    async withdrawSentRequest(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            if (userId) {
                const result = await this.networkService.withdrawSentRequest(userId, id);
                if (result) res.json({ success: true, message: 'successfully withdraw the request.' });
                else res.json({ success: false, message: 'somthing went while withdrawing the request!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal Error occured!' });
        }
    }
}

export default NetworkController;