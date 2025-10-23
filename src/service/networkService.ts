import { INetworkRepository } from "../interfaces/repositoryInterfaces/INetworkRepository";
import UserRepository from "../repositories/userRepository";
import { NotFoundError, DatabaseError } from '../utils/errors';



class NetworkService {
    constructor(private networkRepository: INetworkRepository, private userRepository: UserRepository) { }

    async getAllUsers(search: string | undefined, userId: string): Promise<any[]> {
        try {
            return await this.userRepository.getAllUsers(search, userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllUsers:", error);
            throw new Error("An unexpected error occurred while retrieving all users."); // Re-throw generic error
        }
    }
    async getUserProfile(userId: string): Promise<any> {
        try {
            return await this.networkRepository.getUserProfile(userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getUserProfile:", error);
            throw new Error("An unexpected error occurred while retrieving user profile."); // Re-throw generic error
        }
    }
    async getUserPostsById(userId: string): Promise<any[]> {
        try {
            return await this.networkRepository.getUserPostsById(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getUserPostsById:", error);
            throw new Error("An unexpected error occurred while retrieving user posts."); // Re-throw generic error
        }
    }
    async sendRequest(receiverId: string, senderId: string): Promise<any> {
        try {
            return await this.networkRepository.sendRequest(receiverId, senderId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in sendRequest:", error);
            throw new Error("An unexpected error occurred while sending connection request."); // Re-throw generic error
        }
    }
    async getAllRequests(userId: string): Promise<any[]> {
        try {
            return await this.networkRepository.getAllRequests(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllRequests:", error);
            throw new Error("An unexpected error occurred while retrieving all connection requests."); // Re-throw generic error
        }
    }
    async addToFriend(userId: string, friendId: string): Promise<any> {
        try {
            return await this.networkRepository.addToFriend(userId, friendId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in addToFriend:", error);
            throw new Error("An unexpected error occurred while adding friend."); // Re-throw generic error
        }
    }
    async getAllFriends(userId: string): Promise<any[]> {
        try {
            return await this.networkRepository.getAllFriends(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllFriends:", error);
            throw new Error("An unexpected error occurred while retrieving all friends."); // Re-throw generic error
        }
    }
    async unFriend(id: string, userId: string): Promise<any> {
        try {
            return await this.networkRepository.unFriend(id, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in unFriend:", error);
            throw new Error("An unexpected error occurred while unfriending user."); // Re-throw generic error
        }
    }
    async removeRequest(id: string, userId: string): Promise<any> {
        try {
            return await this.networkRepository.removeRequest(id, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in removeRequest:", error);
            throw new Error("An unexpected error occurred while removing connection request."); // Re-throw generic error
        }
    }
    async getAllsendRequests(userId: string): Promise<any[]> {
        try {
            return await this.networkRepository.getAllsendRequests(userId);
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in getAllsendRequests:", error);
            throw new Error("An unexpected error occurred while retrieving all sent requests."); // Re-throw generic error
        }
    }
    async withdrawSentRequest(userId: string, id: string): Promise<any> {
        try {
            return await this.networkRepository.withdrawSentRequest(userId, id);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof DatabaseError) {
                throw error; // Re-throw specific errors
            }
            console.error("Unexpected error in withdrawSentRequest:", error);
            throw new Error("An unexpected error occurred while withdrawing sent request."); // Re-throw generic error
        }
    }
}

export default NetworkService;