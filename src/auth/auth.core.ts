import { NextFunction, Request, Response } from "express";
import { createUser, getUserKey, getSingleUser, getUsers } from "./auth.model";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { setAsyncLocalStorage } from "../plugins/local-storage";

export interface User {
    username: string;
    first_name: string;
    last_name: string;
    role: string;
}

const jwtSecret = process.env.JWT_SECRET ?? "";

export const registerUser = async (
    username: string,
    first_name: string,
    last_name: string,
) => {
    const users = await getUsers();
    let userId = crypto.randomUUID();
    const userIdExists = users.find((user: any) => user.id === userId);
    if (await getSingleUser(username)) {
        return false;
    }
    if (userIdExists) {
        userId = crypto.randomUUID();
    }
    await createUser(userId, username, first_name, last_name);
    const api_key = await getUserKey(username);
    return { message: "User created", username, api_key };
};

export const authenticateUser = async (username: string, key: string) => {
    if (!username || !key) {
        throw new Error("Username and key are required");
    }
    const getUser = await getSingleUser(username);
    if (!getUser) {
        throw new Error("User not found");
    }
    const user = getUser as User;
    const secret = await getUserKey(username);
    if (secret !== key) {
        throw new Error("Invalid key");
    }
    return generateJwt(user);
};

export const generateJwt = async (user: User) => {
    const userDetails = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
    };
    const options = {
        subject: user.username,
        algorithm: "HS256" as const,
        issuer: "auth-service",
        expiresIn: "1h",
    };
    return {
        token: sign(userDetails, jwtSecret, options),
        tokenType: "Bearer",
        expiresIn: options.expiresIn,
    };
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
