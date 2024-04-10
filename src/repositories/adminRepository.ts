import AdminModel, { adminInterface } from '../models/adminModel';

class AdminRepository {
    async isAdminExist(email: string): Promise<adminInterface | null> {
        const admin = await AdminModel.findOne({ email: email });
        if (admin) return admin;
        else return null;
    }
}

export default AdminRepository;