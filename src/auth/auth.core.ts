import { getAuthSecret, getSingleUser } from "./auth.model";
import { sign } from "jsonwebtoken";

export const authenticateUser = async (
    username: string,
    key: string,
): Promise<string | false> => {
    const user = await getSingleUser(username);
    if (!user) {
        return false;
    }
    const secrets = await getAuthSecret(username);
    const userSecret = secrets.find((secret: any) => secret.key === key);
    if (!userSecret) {
        return false;
    }
    return generateJwt(username, key);
};

export const generateJwt = async (
    username: string,
    key: string,
): Promise<string | false> => {
    const user = await getSingleUser(username);
    if (!user) {
        return false;
    }
    const token = sign(
        {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        },
        key,
        {
            subject: user.username as string,
            algorithm: "HS256",
            issuer: "auth-service",
            expiresIn: "1h",
        },
    );
    return token;
};
