import { sign, verify } from "jsonwebtoken";
import User from "src/model/User";

export  const generateToken = (userInfo:User) => {
    if (!userInfo) {
        return null;
    }

    return sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const verifyToken = (username:string, token:string) => {
    return verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: "Invalid token",
                error: error,
            };
        }

        if (response.username !== username) {
            return {
                verified: false,
                message: "Invalid user",
            };
        }

        return {
            verified: true,
            message: "verified",
        };
    });
};