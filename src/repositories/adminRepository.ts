import Admin from '../interfaces/entityInterface/Iadmin';
import AdminModel, { AdminInterface } from '../models/adminModel';

class AdminRepository {
    async isAdminExist(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email: email });
        if (admin) return admin as Admin
        else return null;
    }
    async saveAdmin(adminData: Admin): Promise<Admin | null> {
        try {
            const newAdmin = new AdminModel(adminData);
            await newAdmin.save();
            return newAdmin as Admin;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}

export default AdminRepository;