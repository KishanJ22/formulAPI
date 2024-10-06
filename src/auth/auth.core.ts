import { NextFunction, Request, Response } from "express";
import { createUser, getUserKey, getSingleUser, getUsers } from "./auth.model";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { setAsyncLocalStorage } from "../plugins/local-storage";

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

export const authenticateUser = async (username: string) => {
    const user = await getSingleUser(username);
    if (!user) {
        return false;
    }
    const secret = await getUserKey(username);
    if (!secret) {
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
