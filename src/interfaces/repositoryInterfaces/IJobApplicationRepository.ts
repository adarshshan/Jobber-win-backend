
export interface IJobApplicationRepository {
    getAllApplications(userId: string, userSide?: boolean): Promise<any[] | undefined>; // Return type is complex due to populate, leaving as any for now
    getMonthlyApplicationCount(): Promise<any[] | undefined>;
    getDailyApplicationCount(): Promise<any[] | undefined>;
    getYearlyApplicationCount(): Promise<any[] | undefined>;
    getGraphData(recruiterId: string): Promise<any[] | undefined>;
}