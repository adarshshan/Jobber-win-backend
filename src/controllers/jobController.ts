import { Request, Response } from "express";
import JobService from "../service/jobService";
import { NotFoundError, DatabaseError } from '../utils/errors';

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
            res.json({ success: true, data: jobs, message: 'Landing page jobs fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in landingPageJobs controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching landing page jobs.' });
            } else if (error instanceof Error) {
                console.error("Error in landingPageJobs controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching landing page jobs.' });
            } else {
                console.error("Unexpected error in landingPageJobs controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching landing page jobs.' });
            }
        }
    }
    async getAllJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const search: any = req.query.search;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.getAllJobs(search, userId);
            res.json({ success: true, data: result, message: 'All job details fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllJobs controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching job details.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllJobs controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching job details.' });
            } else {
                console.error("Unexpected error in getAllJobs controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching job details.' });
            }
        }
    }
    async getSingleJobDetails(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const result = await this.jobService.getSingleJobDetails(jobId);
            res.json({ success: true, data: result, message: 'Job details fetched successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Job not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getSingleJobDetails controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching job details.' });
            } else if (error instanceof Error) {
                console.error("Error in getSingleJobDetails controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching job details.' });
            } else {
                console.error("Unexpected error in getSingleJobDetails controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching job details.' });
            }
        }
    }
    async applyJOb(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const userId = req.userId;
            const formData: JobBodyInterface = req.body;
            if (!userId || !jobId) {
                return res.status(400).json({ success: false, message: 'User ID or Job ID is not available.' });
            }
            const result = await this.jobService.applyJOb(jobId, userId, formData);
            res.json({ success: true, data: result, message: 'Job application sent successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Job or user not found for application.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in applyJOb controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while applying for job.' });
            } else if (error instanceof Error) {
                console.error("Error in applyJOb controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while applying for job.' });
            } else {
                console.error("Unexpected error in applyJOb controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while applying for job.' });
            }
        }
    }
    async getApplied(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.getApplied(userId);
            res.json({ success: true, data: result, message: 'Applied jobs fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getApplied controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching applied jobs.' });
            } else if (error instanceof Error) {
                console.error("Error in getApplied controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching applied jobs.' });
            } else {
                console.error("Unexpected error in getApplied controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching applied jobs.' });
            }
        }
    }
    async getAllApplications(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.getAllApplications(userId);
            res.json({ success: true, data: result, message: 'All applications fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllApplications controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching applications.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllApplications controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching applications.' });
            }
            else {
                console.error("Unexpected error in getAllApplications controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching applications.' });
            }
        }
    }
    async saveJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { jobId } = req.params;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.saveJobs(userId, jobId);
            res.json({ success: true, data: result, message: 'Job saved successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in saveJobs controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while saving job.' });
            } else if (error instanceof Error) {
                console.error("Error in saveJobs controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while saving job.' });
            } else {
                console.error("Unexpected error in saveJobs controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while saving job.' });
            }
        }
    }
    async unSaveJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { jobId } = req.params;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.unSaveJobs(userId, jobId);
            res.json({ success: true, data: result, message: 'Job removed from saved list successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in unSaveJobs controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while unsaving job.' });
            } else if (error instanceof Error) {
                console.error("Error in unSaveJobs controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while unsaving job.' });
            } else {
                console.error("Unexpected error in unSaveJobs controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while unsaving job.' });
            }
        }
    }
    async getAllSavedJobs(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.getAllSavedJobs(userId);
            res.json({ success: true, data: result, message: 'Saved jobs fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getAllSavedJobs controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching saved jobs.' });
            } else if (error instanceof Error) {
                console.error("Error in getAllSavedJobs controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching saved jobs.' });
            } else {
                console.error("Unexpected error in getAllSavedJobs controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching saved jobs.' });
            }
        }
    }
    async reportJob(req: Request, res: Response) {
        try {
            const { reason } = req.body;
            const { jobId } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.jobService.reportJob(reason, jobId, userId);
            res.json(result);
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in reportJob controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error during job report.' });
            } else if (error instanceof Error) {
                console.error("Error in reportJob controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred during job report.' });
            } else {
                console.error("Unexpected error in reportJob controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred during job report.' });
            }
        }
    }
    async getJobsByDate(req: Request, res: Response) {
        try {
            const { num } = req.params;
            if (!num) {
                return res.status(400).json({ success: false, message: 'Number of days is required.' });
            }
            const result = await this.jobService.getJobsByDate(num);
            res.json({ success: true, data: result, message: 'Jobs by date fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getJobsByDate controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching jobs by date.' });
            } else if (error instanceof Error) {
                console.error("Error in getJobsByDate controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching jobs by date.' });
            } else {
                console.error("Unexpected error in getJobsByDate controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching jobs by date.' });
            }
        }
    }
    async getJobsByExperience(req: Request, res: Response) {
        try {
            const { start, end } = req.params;
            const result = await this.jobService.getJobsByExperience(start, end);
            res.json({ success: true, data: result, message: 'Jobs by experience fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getJobsByExperience controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching jobs by experience.' });
            } else if (error instanceof Error) {
                console.error("Error in getJobsByExperience controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching jobs by experience.' });
            } else {
                console.error("Unexpected error in getJobsByExperience controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching jobs by experience.' });
            }
        }
    }
}

export default JobController;