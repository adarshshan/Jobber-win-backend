import { Request, Response } from "express";
import ChatService from "../service/chatService";
import { NotFoundError, DatabaseError } from '../utils/errors';
import { STATUS_CODES } from "../constants/httpStatusCodes";
const { UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES


class ChatController {
    constructor(private chatService: ChatService) { }

    async accessChat(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const current_userId = req.userId;

            if (!userId) return res.status(BAD_REQUEST).json({ success: false, message: 'userId is undefined' });
            if (!current_userId) return res.status(UNAUTHORIZED).json({ success: false, message: 'User is not logged in' });

            let chat;
            try {
                chat = await this.chatService.accessChat(userId, current_userId);
            } catch (error) {
                if (error instanceof NotFoundError) {
                    // If chat not found, create a new one
                    const chatData = {
                        chatName: "sender", // Or a more appropriate default name
                        isGroupChat: false,
                        users: [current_userId, userId],
                    };
                    chat = await this.chatService.saveChat(chatData);
                } else {
                    throw error; // Re-throw other errors
                }
            }
            res.json({ success: true, data: chat, message: 'Chat accessed successfully.' });

        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in accessChat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while accessing chat.' });
            } else if (error instanceof Error) {
                console.error("Error in accessChat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while accessing chat.' });
            } else {
                console.error("Unexpected error in accessChat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while accessing chat.' });
            }
        }
    }
    async fetchChats(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User is not logged in' });
            }
            const chat = await this.chatService.fetchChats(userId);
            res.json({ success: true, data: chat, message: 'Chats fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in fetchChats controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching chats.' });
            } else if (error instanceof Error) {
                console.error("Error in fetchChats controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching chats.' });
            } else {
                console.error("Unexpected error in fetchChats controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching chats.' });
            }
        }
    }
    async createGroupchat(req: Request, res: Response) {
        try {
            let { name, users } = req.body;
            if (!name || !users) return res.status(BAD_REQUEST).json({ success: false, message: 'Please enter all required fields.' });

            let parsedUsers: string[];
            try {
                parsedUsers = JSON.parse(users);
            } catch (jsonError) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid users format.' });
            }

            if (parsedUsers.length < 2) return res.status(BAD_REQUEST).json({ success: false, message: 'More than 2 users are required to form a group chat.' });

            // Assuming req.user contains the ID of the current user
            if (req.userId) {
                parsedUsers.push(req.userId);
            } else {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User not authenticated.' });
            }

            const newGroupchat = await this.chatService.createGroupChat(name, parsedUsers, req.userId);
            res.json({ success: true, data: newGroupchat, message: 'Group chat created successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in createGroupchat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while creating group chat.' });
            } else if (error instanceof Error) {
                console.error("Error in createGroupchat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while creating group chat.' });
            } else {
                console.error("Unexpected error in createGroupchat controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while creating group chat.' });
            }
        }
    }
    async renameGroup(req: Request, res: Response) {
        try {
            const { chatId, chatName } = req.body;
            const result = await this.chatService.renameGroup(chatId, chatName);
            res.json({ success: true, data: result, message: 'Group chat renamed successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Chat not found for renaming.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in renameGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error during group chat renaming.' });
            } else if (error instanceof Error) {
                console.error("Error in renameGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred during group chat renaming.' });
            } else {
                console.error("Unexpected error in renameGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred during group chat renaming.' });
            }
        }
    }
    async addToGroup(req: Request, res: Response) {
        try {
            const { chatId, userId } = req.body;
            if (!chatId || !userId) return res.status(BAD_REQUEST).json({ success: false, message: 'Please enter the input fields!' });
            const result = await this.chatService.addToGroup(chatId, userId);
            res.json({ success: true, data: result, message: 'User added to group successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Chat or user not found for adding to group.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in addToGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while adding user to group.' });
            } else if (error instanceof Error) {
                console.error("Error in addToGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while adding user to group.' });
            } else {
                console.error("Unexpected error in addToGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while adding user to group.' });
            }
        }
    }
    async removeFromGroup(req: Request, res: Response) {
        try {
            const { chatId, userId } = req.body;
            const result = await this.chatService.removeFromGroup(chatId, userId);
            res.json({ success: true, data: result, message: 'User removed from group successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(BAD_REQUEST).json({ success: false, message: 'Chat or user not found for removing from group.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in removeFromGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while removing user from group.' });
            } else if (error instanceof Error) {
                console.error("Error in removeFromGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while removing user from group.' });
            } else {
                console.error("Unexpected error in removeFromGroup controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while removing user from group.' });
            }
        }
    }
    async postShareSuggestedUsers(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User is not logged in.' });
            }
            const result = await this.chatService.postShareSuggestedUsers(userId);
            res.json({ success: true, data: result, message: 'Suggested users for post share fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in postShareSuggestedUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching suggested users.' });
            } else if (error instanceof Error) {
                console.error("Error in postShareSuggestedUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching suggested users.' });
            } else {
                console.error("Unexpected error in postShareSuggestedUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching suggested users.' });
            }
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(UNAUTHORIZED).json({ success: false, message: 'User is not logged in.' });
            }
            const search: any = req.query.search;
            const result = await this.chatService.getAllUsers(search, userId);
            res.json({ success: true, data: result, message: 'Users fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error while fetching users.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || 'An unexpected error occurred while fetching users.' });
            } else {
                console.error("Unexpected error in getAllUsers controller:", error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred while fetching users.' });
            }
        }
    }
}

export default ChatController;