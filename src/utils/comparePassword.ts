import bcrypt from 'bcrypt';

interface compareInterface {
    compare(password: string, hashedPassword: string): Promise<boolean>
}

class Encrypt implements compareInterface {
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default Encrypt;