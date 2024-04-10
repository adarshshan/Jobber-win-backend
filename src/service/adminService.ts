import AdminModel, { adminInterface } from "../models/adminModel";
import AdminRepository from "../repositories/adminRepository";



class AdminService {
    constructor(private adminReopsitory: AdminRepository) { }

    async adminSignup(adminData: adminInterface) {
        const admin = await AdminModel.create([adminData]);
        if (admin) {
            console.log(admin);
        }
    }
}

export default AdminService;