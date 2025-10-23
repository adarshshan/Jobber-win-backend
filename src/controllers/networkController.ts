import { Request, Response } from "express";
import NetworkService from "../service/networkService";
import { NotFoundError, DatabaseError } from '../utils/errors';


class NetworkController {
    constructor(private networkService: NetworkService) { }

    async getAllUsers(req: Request, res: Response) {
        try {
            const search: any = req.query.search;
            if (!req.userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.getAllUsers(search, req.userId);
            res.json({ success: true, data: result, message: 'Users fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllUsers controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching users.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllUsers controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching users.' });
            } else {
                console.error("Unexpected error in getAllUsers controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching users.' });
            }
        }
    }
    async getUserProfile(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const result = await this.networkService.getUserProfile(userId);
            res.json({ success: true, data: result, message: 'User profile fetched successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'User profile not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getUserProfile controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching user profile.' });
            } else if (error instanceof Error) {
                console.error("Error in getUserProfile controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching user profile.' });
            } else {
                console.error("Unexpected error in getUserProfile controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching user profile.' });
            }
        }
    }
    async getUserPostsById(req: Request, res: Response) {
        try {
            const result = await this.networkService.getUserPostsById(req.params.userId);
            res.json({ success: true, data: result, message: 'User posts fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getUserPostsById controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching user posts.' });
            } else if (error instanceof Error) {
                console.error("Error in getUserPostsById controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching user posts.' });
            } else {
                console.error("Unexpected error in getUserPostsById controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching user posts.' });
            }
        }
    }
    async sendRequest(req: Request, res: Response) {
        try {
            const { receiverId } = req.body;
            const senderId = req.userId;
            if (!senderId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: Sender ID not found.' });
            }
            const result = await this.networkService.sendRequest(receiverId, senderId);
            res.json({ success: true, data: result, message: 'Connection request sent successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Receiver not found for sending request.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in sendRequest controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while sending request.' });
            } else if (error instanceof Error) {
                console.error("Error in sendRequest controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while sending request.' });
            } else {
                console.error("Unexpected error in sendRequest controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while sending request.' });
            }
        }
    }
    async getAllRequests(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.getAllRequests(userId);
            res.json({ success: true, data: result, message: 'Connection requests fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllRequests controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching connection requests.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllRequests controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching connection requests.' });
            } else {
                console.error("Unexpected error in getAllRequests controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching connection requests.' });
            }
        }
    }
    async addToFriend(req: Request, res: Response) {
        try {
            const { friendId } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.addToFriend(userId, friendId);
            res.json({ success: true, data: result, message: 'User added to friend list successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'User or friend not found for adding to friend list.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in addToFriend controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while adding user to friend list.' });
            } else if (error instanceof Error) {
                console.error("Error in addToFriend controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while adding user to friend list.' });
            } else {
                console.error("Unexpected error in addToFriend controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while adding user to friend list.' });
            }
        }
    }
    async getAllFriends(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.getAllFriends(userId);
            res.json({ success: true, data: result, message: 'Friend list fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllFriends controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching friend list.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllFriends controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching friend list.' });
            } else {
                console.error("Unexpected error in getAllFriends controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching friend list.' });
            }
        }
    }
    async unFriend(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.unFriend(id, userId);
            res.json({ success: true, data: result, message: 'User unfriended successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Connection not found for unfriending.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in unFriend controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while unfriending user.' });
            } else if (error instanceof Error) {
                console.error("Error in unFriend controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while unfriending user.' });
            } else {
                console.error("Unexpected error in unFriend controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while unfriending user.' });
            }
        }
    }
    async removeRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.removeRequest(id, userId);
            res.json({ success: true, data: result, message: 'Connection request removed successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Connection request not found for removal.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in removeRequest controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while removing connection request.' });
            } else if (error instanceof Error) {
                console.error("Error in removeRequest controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while removing connection request.' });
            } else {
                console.error("Unexpected error in removeRequest controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while removing connection request.' });
            }
        }
    }
    async getAllsendRequests(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.getAllsendRequests(userId);
            res.json({ success: true, data: result, message: 'Sent requests fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllsendRequests controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching sent requests.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllsendRequests controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching sent requests.' });
            } else {
                console.error("Unexpected error in getAllsendRequests controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching sent requests.' });
            }
        }
    }
    async withdrawSentRequest(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.networkService.withdrawSentRequest(userId, id);
            res.json({ success: true, data: result, message: 'Sent request withdrawn successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Sent request not found for withdrawal.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in withdrawSentRequest controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error during sent request withdrawal.' });
            } else if (error instanceof Error) {
                console.error("Error in withdrawSentRequest controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred during sent request withdrawal.' });
            } else {
                console.error("Unexpected error in withdrawSentRequest controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred during sent request withdrawal.' });
            }
        }
    }
}

export default NetworkController;