import { NextFunction, Request, Response } from "express";
import { getAuthSecret, getSingleUser } from "./auth.model";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { setAsyncLocalStorage } from "../plugins/local-storage";

const jwtSecret = process.env.JWT_SECRET ?? "";

export const authenticateUser = async (username: string, key: string) => {
    const user = await getSingleUser(username);
    if (!user) {
        return false;
    }
    const secrets = await getAuthSecret(username);
    const userSecret = secrets.find((secret: any) => secret.key === key);
    if (!userSecret) {
        return false;
    }
    return generateJwt(username);
};

export const generateJwt = async (username: string) => {
    const user = await getSingleUser(username);
    if (!user) {
        return false;
    }
    const userDetails = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
    };
    const options = {
        subject: user.username as string,
        algorithm: "HS256" as const,
        issuer: "auth-service",
        expiresIn: "1h",
    };
    const token = sign(userDetails, jwtSecret, options);
    return { access_token: token, token_type: "Bearer", expires_in: 3600 };
};

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({ error: "No Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verify(token, jwtSecret) as JwtPayload;
        saveUserInLocalStorage(decoded);
        next();
    } catch {
        return res.status(401).send({ error: "Invalid token" });
    }
};

export const saveUserInLocalStorage = (decodedToken: JwtPayload) => {
    setAsyncLocalStorage({
        username: decodedToken.username,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        role: decodedToken.role,
    });
};
