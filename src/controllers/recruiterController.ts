import { Request, Response } from "express";
import RecruiterService from "../service/recruiterService";


class RecruiterController {
    constructor(private recruiterService: RecruiterService) { }

    async getAllJobs(req: Request, res: Response) {
        try {
            const result = await this.recruiterService.getAllJobs();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postNewJob(req: Request, res: Response) {
        try {
            const result = await this.recruiterService.postNewJob();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJob(req:Request,res:Response){
        try {
            
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editJobs(req:Request,res:Response){
        try {
            const result=await this.recruiterService.editJobs();
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterController;