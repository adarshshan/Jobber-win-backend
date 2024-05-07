import { Request, Response } from "express";
import RecruiterService from "../service/recruiterService";
import { json } from "stream/consumers";

export interface JobInterface {
    title: string;
    company_name: string;
    industry: string;
    job_img: string;
    description: string;
    total_vaccancy: number;
    location: string;
    job_type: string;
    experience: number;
    min_salary: number;
    max_salary: number;
}

class RecruiterController {
    constructor(private recruiterService: RecruiterService) { }

    async getAllJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.recruiterService.getAllJobs(userId);
                if (result) res.json({ success: true, data: result, message: 'All jobs fetched successfully' });
                else res.json({ success: false, message: 'Somthing went wrong while fetching the jobs!' });
            } else res.json({ success: false, message: 'Authentication Error occurred' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async postNewJob(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { data } = req.body;
            if (userId) {
                const result = await this.recruiterService.postNewJob(data, userId);
                if (result) res.json({ success: true, data: result, message: 'Job posted successfully' });
                else res.json({ success: false, message: 'Somthing went wrong while posting the job!' });
            } else res.json({ success: false, message: 'Authentication Error!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal Server error occured' });
        }
    }
    async deleteJob(req: Request, res: Response) {
        try {

        } catch (error) {
            console.log(error as Error);
        }
    }
    async editJobs(req: Request, res: Response) {
        try {
            const result = await this.recruiterService.editJobs();
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllApplications(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.recruiterService.getAllApplications(userId);
                if (result) res.json({ success: true, data: result, message: 'success' });
                else res.json({ success: false, message: 'Something went wrong while fetching the applications' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal SErver error occured!' });
        }
    }
    async changeStatus(req: Request, res: Response) {
        try {
            const { status, applicationId } = req.params;
            const result = await this.recruiterService.changeStatus(status, applicationId);
            if (result) res.json({ success: true, data: result, message: 'success' });
            else res.json({ success: false, message: 'Something went wrong while approve/remove' })
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Inernal Server Error occured!' });
        }
    }
}

export default RecruiterController;