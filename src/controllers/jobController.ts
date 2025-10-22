import { Request, Response } from "express";
import JobService from "../service/jobService";

export interface JobBodyInterface {
    resume: string;
    qualification: string;
    experience: number;
}

class JobController {
    constructor(private jobService: JobService) { }


    async landingPageJobs(req: Request, res: Response) {
        try {
            let search: any = req.query.search;
            const jobs = await this.jobService.landingPageJobs(search);
            if (jobs) res.json({ success: true, data: jobs, message: 'messages fetched successfully' });
            else res.json({ success: false, message: 'Something went wrong!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error occured!' });
        }
    }
    async getAllJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const search: any = req.query.search;
            if (userId) {
                const result = await this.jobService.getAllJobs(search, userId);
                if (result) res.json({ success: true, data: result, message: 'Successfully fetched all job details' });
                else res.json({ success: false, message: "somthing went wrong while fetching the job details!" });
            }
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
    async getApplied(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.jobService.getApplied(userId);
                if (result) res.json({ success: true, data: result, message: 'Successful' });
                else res.json({ success: false, message: 'Sorry there is not any applied jobs!' });
            } else res.json({ success: false, message: 'userId is not available!' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error occured!' });
        }
    }
    async getAllApplications(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.jobService.getAllApplications(userId);
                if (result) res.json({ success: true, data: result, message: 'success' });
                else res.json({ success: false, message: 'Something went wrong while fetching the details!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error!' });
        }
    }
    async saveJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { jobId } = req.params;
            if (userId) {
                const result = await this.jobService.saveJobs(userId, jobId);
                return res.json(result);
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async unSaveJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { jobId } = req.params;
            if (userId) {
                const result = await this.jobService.unSaveJobs(userId, jobId);
                if (result) res.json({ success: true, data: result, message: 'job removed from the list.' });
                else res.json({ success: false, message: 'something went wrong while removing the saved job!' });
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal Server error occured!' });
        }
    }
    async getAllSavedJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                const result = await this.jobService.getAllSavedJobs(userId);
                if (result) res.json({ success: true, data: result, message: 'Data fetched successfully' })
                else res.json({ success: false, message: 'something went wrong!' })
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal server error' });
        }
    }
    async reportJob(req: Request, res: Response) {
        try {
            const { reason } = req.body;
            const { jobId } = req.params;
            const userId = req.userId;
            if (userId) {
                const result = await this.jobService.reportJob(reason, jobId, userId);
                res.json(result);
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'internal server Error' });
        }
    }
    async getJobsByDate(req: Request, res: Response) {
        try {
            const { num } = req.params;
            if (num) {
                const result = await this.jobService.getJobsByDate(num);
                if (result) res.json({ success: true, data: result, message: 'successful' });
                else res.json({ success: false, message: 'Something went wrong!' })
            }
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Inernal server Error!' });
        }
    }
    async getJobsByExperience(req: Request, res: Response) {
        try {
            const { start, end } = req.params;
            const result = await this.jobService.getJobsByExperience(start, end);
            if (result) res.json({ success: true, data: result, message: 'successful' });
            else res.json({ success: false, message: 'Something went wrong...' });
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server Error' });
        }
    }
}

export default JobController;