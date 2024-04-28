

class RecruiterRepository {

    async getAllJobs() {
        try {
            console.log('reached at the end of the line at getAllJobs function...');
        } catch (error) {
            console.log(error as Error);
        }
    }
    async postNewJob() {
        try {
            console.log('reached at the end of the line at postNewJob function');
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteJob() {
        try {
            console.log('reached at the end of the line at deleteJob function');
        } catch (error) {
            console.log(error as Error)
        }
    }
    async editJobs() {
        try {
            console.log('reached at the end of the line at editJobs function');
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default RecruiterRepository;