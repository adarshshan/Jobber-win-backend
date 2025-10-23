
export interface IJobApplicationRepository {
    getAllApplications(userId: string, userSide?: boolean): Promise<any[]>; // Return type is complex due to populate, leaving as any for now
    getMonthlyApplicationCount(): Promise<any[]>;
    getDailyApplicationCount(): Promise<any[]>;
    getYearlyApplicationCount(): Promise<any[]>;
    getGraphData(recruiterId: string): Promise<any[]>;
}