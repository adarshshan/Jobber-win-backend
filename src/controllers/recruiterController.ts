import { Request, Response } from "express";
import RecruiterService from "../service/recruiterService";
import { NotFoundError, DatabaseError } from "../utils/errors";
import { bucket } from "../config/firebase";

export interface JobInterface {
  title: string;
  company_name: string;
  industry: string;
  job_img: string;
  description: string;
  total_vaccancy?: number;
  location?: string;
  job_type: "part-time" | "full-time" | "remote";
  experience: number;
  min_salary: number;
  max_salary: number;
}

class RecruiterController {
  constructor(private recruiterService: RecruiterService) {}

  async getAllJobs(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication Error: User ID not found.",
        });
      }
      const result = await this.recruiterService.getAllJobs(userId);
      res.json({
        success: true,
        data: result,
        message: "All jobs fetched successfully",
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error("Database error in getAllJobs controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching jobs.",
        });
      } else if (error instanceof Error) {
        console.error("Error in getAllJobs controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "An unexpected error occurred while fetching jobs.",
        });
      } else {
        console.error("Unexpected error in getAllJobs controller:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred while fetching jobs.",
        });
      }
    }
  }

  async postNewJob(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { data } = req.body;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication Error: User ID not found.",
        });
      }

      // const isSubscribed = await this.recruiterService.isSubscribed(userId);
      // console.log(`isSubscribed: ${isSubscribed}`);
      // if (!isSubscribed.success) {
      //   return res.status(403).json(isSubscribed);
      // }

      const result = await this.recruiterService.postNewJob(data, userId);
      res.json({
        success: true,
        data: result,
        message: "Job posted successfully",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: "Resource not found for posting job.",
        });
      } else if (error instanceof DatabaseError) {
        console.error("Database error in postNewJob controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error while posting job.",
        });
      } else if (error instanceof Error) {
        console.error("Error in postNewJob controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message || "An unexpected error occurred while posting job.",
        });
      } else {
        console.error("Unexpected error in postNewJob controller:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred while posting job.",
        });
      }
    }
  }
  async editJobs(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { data, jobId } = req.body;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication Error: User ID not found.",
        });
      }
      const result = await this.recruiterService.editJobs(data, jobId);
      res.json({
        success: true,
        data: result,
        message: "Job details updated successfully.",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res
          .status(404)
          .json({ success: false, message: "Job not found for editing." });
      } else if (error instanceof DatabaseError) {
        console.error("Database error in editJobs controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error while editing job.",
        });
      } else if (error instanceof Error) {
        console.error("Error in editJobs controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message || "An unexpected error occurred while editing job.",
        });
      } else {
        console.error("Unexpected error in editJobs controller:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred while editing job.",
        });
      }
    }
  }
  async getAllApplications(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication Error: User ID not found.",
        });
      }
      const result = await this.recruiterService.getAllApplications(userId);
      res.json({
        success: true,
        data: result,
        message: "All applications fetched successfully.",
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error(
          "Database error in getAllApplications controller:",
          error
        );
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching applications.",
        });
      } else if (error instanceof Error) {
        console.error("Error in getAllApplications controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "An unexpected error occurred while fetching applications.",
        });
      } else {
        console.error(
          "Unexpected error in getAllApplications controller:",
          error
        );
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred while fetching applications.",
        });
      }
    }
  }
  async changeStatus(req: Request, res: Response) {
    try {
      const { status, applicationId } = req.params;
      const result = await this.recruiterService.changeStatus(
        status,
        applicationId
      );
      res.json({
        success: true,
        data: result,
        message: "Application status changed successfully.",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: "Application not found for status change.",
        });
      } else if (error instanceof DatabaseError) {
        console.error("Database error in changeStatus controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error while changing application status.",
        });
      } else if (error instanceof Error) {
        console.error("Error in changeStatus controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "An unexpected error occurred while changing application status.",
        });
      } else {
        console.error("Unexpected error in changeStatus controller:", error);
        res.status(500).json({
          success: false,
          message:
            "An unexpected error occurred while changing application status.",
        });
      }
    }
  }
  async getGraphData(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication Error: User ID not found.",
        });
      }
      const result = await this.recruiterService.getGraphData(userId);
      res.json({
        success: true,
        data: result,
        message: "Graph data fetched successfully.",
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error("Database error in getGraphData controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error while fetching graph data.",
        });
      } else if (error instanceof Error) {
        console.error("Error in getGraphData controller:", error);
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "An unexpected error occurred while fetching graph data.",
        });
      } else {
        console.error("Unexpected error in getGraphData controller:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred while fetching graph data.",
        });
      }
    }
  }
  async uploadLogo(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) return res.status(400).send("No file uploaded");

      const firebaseFile = bucket.file(
        `company_logo/${Date.now()}-${file.originalname}`
      );

      await firebaseFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Make file public
      await firebaseFile.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket?.name}/${firebaseFile?.name}`;
      if (bucket?.name && firebaseFile?.name) {
        res.status(200).json({
          success: true,
          data: publicUrl,
          message: "Logo uploaded successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to upload logo",
        });
      }
    } catch (error) {
      console.log(error as Error);
      res.status(500).json({
        success: false,
        message: "Error uploading logo",
      });
    }
  }
}

export default RecruiterController;
