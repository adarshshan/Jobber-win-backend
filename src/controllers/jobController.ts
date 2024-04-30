import { Request, Response } from "express";
import JobService from "../service/jobService";

export interface JobBodyInterface {
    resume: string;
    qualification: string;
    experience: number;
}

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
    async applyJOb(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const userId = req.userId;
            const formData: JobBodyInterface = req.body;
            if (userId && jobId) {
                const result = await this.jobService.applyJOb(jobId, userId, formData);
                if (result) res.json({ success: true, data: result, message: 'Job application has send' });
                else res.json({ success: false, message: 'Somthing went wrong while applying the job!' });
            } else res.json({ success: false, message: 'userId or jobId is not available!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error!' });
        }
    }
    async getSavedAndApplied(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.jobService.getSavedAndApplied(userId);
                if (result) res.json({ success: true, data: result, message: 'Successful' });
                else res.json({ success: false, message: 'Something went wrong while fetching saved and applied jobs!' });
            } else res.json({ success: false, message: 'userId is not available!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
}

export default JobController;