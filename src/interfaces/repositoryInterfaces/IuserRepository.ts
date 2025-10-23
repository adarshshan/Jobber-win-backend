import UserInterface, { IUserCreateData } from "../entityInterface/Iuser";
import { SubInterface } from "../serviceInterfaces/subscription";

export interface IUserRepository {
    emailExistCheck(email: string): Promise<UserInterface>;
    saveUser(userData: IUserCreateData): Promise<UserInterface>;
    getAllUsers(search: string | undefined, userId: string): Promise<UserInterface[]>;
    getUserById(id: string): Promise<UserInterface>;
    getApplied(userId: string): Promise<any[]>;
    changeAboutInfo(id: string, text: string): Promise<string>;
    setProfilePic(pic: string, id: string): Promise<UserInterface>;
    deleteProfilePic(userId: string): Promise<any>;
    addSkill(id: string, skill: string): Promise<UserInterface>;
    getAllSkill(userId: string): Promise<string[]>;
    removeSkill(id: string, skill: string): Promise<any>;
    editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string): Promise<UserInterface>;
    updateNewPassword(password: string, userId: string): Promise<UserInterface>;
    saveJob(userId: string, jobId: string): Promise<{ success: boolean; data?: UserInterface; message: string }>;
    unsaveJob(userId: string, jobId: string): Promise<UserInterface>;
    getAllSavedJobs(userId: string): Promise<any[]>;
    appliedJob(userId: string, jobId: string): Promise<UserInterface>;
    updateSubPlan(userId: string, item: SubInterface): Promise<void>;
}
