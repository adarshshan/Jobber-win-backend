



class userService {
    constructor(private userRepository:any) { }
    
    async userLogin(email: string, password: string) {
        try {
            
        } catch (error) {
            console.log(error);
            console.log('.......error from ')
        }
    }
    async userSignup(userData: { name: string, phone: number, password: string, location: string, email: string }) {
        // const user=await this.userRepository.
    }
    
    async isEmailExist(){

    }
    // async userSignup()
}

export default userService;