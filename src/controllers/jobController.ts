import { Request, Response } from "express";
import JobService from "../service/jobService";


class JobController {
    constructor(private jobService: JobService) { }

    async getAllJobs(req: Request, res: Response) {
        try {
            const result = await this.jobService.getAllJobs();
            if (result) res.json({ success: true, data: result, message: 'Successfully fetched all job details' });
            else res.json({ success: false, message: "somthing went wrong while fetching the job details!" });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error occured!' });
        }
    }
    async getSingleJobDetails(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const result = await this.jobService.getSingleJobDetails(jobId);
            if (result) res.json({ success: true, data: result, message: 'success' });
            else res.json({ success: false, message: 'somthing trouble while fetching the job details' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error occured!' });
        }
    }
}

export default JobController;