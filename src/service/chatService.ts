import ChatRepository from "../repositories/chatRepository";
import UserRepository from "../repositories/userRepository";


class ChatService {
    constructor(private chatRepository: ChatRepository, private userRepository: UserRepository) { }

    async getAllUsers(search: string|undefined,userId:string) {
        try {
            this.userRepository.getAllUsers(search,userId)
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default ChatService;