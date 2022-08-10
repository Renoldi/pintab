import { hashSync, compareSync } from "bcryptjs";

export const hashPass = async (password: string) => {
    return hashSync(password.trim(), 10);
}

export const verify = async (password: string, systemPass: string) => {
    return compareSync(password.trim(), systemPass);
}

