


class userService {
    constructor(private userRepository: any) { }
    async userLogin(email: string, password: string) {
        try {
            this.userRepository.sample(email, password);
        } catch (error) {
            console.log(error);
            console.log('.......error from ')
        }
    }
    async userSignup(name: string, email: string, phone: string, password: string, location: string) {
        console.log(name, location, phone, email);
    }
    // async userSignup()
}

export default userService;