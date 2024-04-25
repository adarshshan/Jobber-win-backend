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
}

export default NetworkService;