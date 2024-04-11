

interface Admin {
    id?: string;
    username?: string;
    password?: string;
    email: string;
    matchPassword?: (enteredPassword: string) => Promise<boolean>;
}

export default Admin;