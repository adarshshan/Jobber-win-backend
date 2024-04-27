import NetworkRepository from "../repositories/networkRepository";



class NetworkService {
    constructor(private networkRepository: NetworkRepository) { }

    async getAllUsers(userId: string) {
        try {
            return await this.networkRepository.getAllUsers(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getUserProfile(userId: string) {
        try {
            return await this.networkRepository.getUserProfile(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getUserPostsById(userId: string) {
        try {
            return await this.networkRepository.getUserPostsById(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async sendRequest(receiverId: string, senderId: string) {
        try {
            return await this.networkRepository.sendRequest(receiverId, senderId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllRequests(userId: string) {
        try {
            return await this.networkRepository.getAllRequests(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async addToFriend(userId: string, friendId: string) {
        try {
            return await this.networkRepository.addToFriend(userId, friendId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllFriends(userId: string) {
        try {
            return await this.networkRepository.getAllFriends(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async unFriend(id: string, userId: string) {
        try {
            return await this.networkRepository.unFriend(id, userId);
        } catch (error) {
            console.log(error as Error)
        }
    }
    async removeRequest(id: string, userId: string) {
        try {
            return await this.networkRepository.removeRequest(id, userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllsendRequests(userId: string) {
        try {
            return await this.networkRepository.getAllsendRequests(userId);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async withdrawSentRequest(userId: string, id: string) {
        try {
            return await this.networkRepository.withdrawSentRequest(userId, id);
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default NetworkService;