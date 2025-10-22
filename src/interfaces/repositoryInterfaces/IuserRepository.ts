import UserInterface, { IUserCreateData } from "../entityInterface/Iuser";
import { SubInterface } from "../serviceInterfaces/subscription";
import { Document } from "mongoose"; // Import Document for Mongoose types

export interface IUserRepository {
    emailExistCheck(email: string): Promise<(UserInterface & Document) | null | undefined>;
    saveUser(userData: IUserCreateData): Promise<(UserInterface & Document) | null>;
    getAllUsers(search: string | undefined, userId: string): Promise<(UserInterface & Document)[] | undefined>;
    getUserById(id: string): Promise<(UserInterface & Document) | null>;
    getApplied(userId: string): Promise<any[] | undefined>; // Adjust return type if a specific interface exists for applied jobs
    changeAboutInfo(id: string, text: string): Promise<string | undefined>;
    setProfilePic(pic: string, id: string): Promise<(UserInterface & Document) | undefined | null>;
    deleteProfilePic(userId: string): Promise<any>; // Mongoose UpdateWriteOpResult
    addSkill(id: string, skill: string): Promise<(UserInterface & Document) | undefined | null>;
    getAllSkill(userId: string): Promise<string[] | undefined>;
    removeSkill(id: string, skill: string): Promise<any>; // Mongoose UpdateWriteOpResult
    editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string): Promise<(UserInterface & Document) | undefined>;
    updateNewPassword(password: string, userId: string): Promise<(UserInterface & Document) | undefined>;
    saveJob(userId: string, jobId: string): Promise<{ success: boolean; data?: (UserInterface & Document) | null; message: string } | null>;
    unsaveJob(userId: string, jobId: string): Promise<(UserInterface & Document) | null>;
    getAllSavedJobs(userId: string): Promise<any[] | undefined>; // Adjust return type if a specific interface exists for saved jobs
    appliedJob(userId: string, jobId: string): Promise<(UserInterface & Document) | null>;
    updateSubPlan(userId: string, item: SubInterface): Promise<void>;
}
