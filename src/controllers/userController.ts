import { Request, Response } from "express"

class userController {
    constructor() { }

    async userLogin(req: Request, res: Response) {
        res.send('code is absolutely fine...');
    }
    async userSingnup(req: Request, res: Response) {
        res.send('hellow');
    }
}

export default userController