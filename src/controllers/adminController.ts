import { Request, Response } from "express";

class adminController {
    constructor() { }
    
    async adminLogin(req: Request, res: Response) {
        res.send('admin login')
    }
}

export default adminController;