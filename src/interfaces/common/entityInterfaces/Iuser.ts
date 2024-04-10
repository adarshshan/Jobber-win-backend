import { Date, ObjectId } from "mongoose";


interface userInterface {
    id?: string,
    name?: string,
    email?: string,
    password?: string,
    phone?: number,
    gender?: string,
    role?: string,
    image: string,
    isBlocked?: boolean,
    location?: string,
    appliedJobs?: appliedJObs[],
}

export interface appliedJObs {
    appliedAt: ObjectId;
    savedAt: Date
}
export interface SavedJob {
    jobId: ObjectId;
    savedAt: Date;
}

export default userInterface;