import bcrypt from 'bcrypt';

// Fungsi untuk membuat hash dari password
export function hashPassword(password: string): string {
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}

// Fungsi untuk verifikasi password
export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
    return isMatch;
}