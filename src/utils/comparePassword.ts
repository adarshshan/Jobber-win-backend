import bcrypt from 'bcrypt';

interface compareInterface {
    compare(password: string, hashedPassword: string): Promise<boolean>
}

class Encrypt implements compareInterface {
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default Encrypt;