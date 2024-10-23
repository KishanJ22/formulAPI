import express, { Request, Response, Router, NextFunction } from "express";
import {
    getAsyncLocalStorage,
    setAsyncLocalStorage,
} from "../plugins/local-storage";
import {
    createUser,
    getUserByUsername,
    getUserById,
    getUserKey,
    getUsers,
} from "./auth.model";
import { sign, verify, JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET ?? "";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).send({ message: "No Authorization header" });
    }

    try {
        const decoded = verify(
            authHeader.split(" ")[1],
            jwtSecret,
        ) as JwtPayload;

        if (!decoded.username) {
            return res.status(401).send({ message: "Invalid token" });
        }

        setAsyncLocalStorage({
            username: decoded.username,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            role: decoded.role,
        });

        next();
    } catch {
        return res.status(500).send({ message: "Error verifying token" });
    }
};

export const authRouter = (app: Router) => {
    const router = express.Router();
    const base = "/auth";

    app.use(base, router);

    router.post("/register", async (req: Request, res: Response) => {
        const { username, first_name, last_name } = req.body;

        if (!username || !first_name || !last_name) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        let userId = crypto.randomUUID();

        if (await getUserByUsername(username)) {
            return res.status(409).send({ message: "Username already exists" });
        }

        if (await getUserById(userId)) {
            userId = crypto.randomUUID(); // Generate a new UUID if the current one is already in use
        }

        try {
            await createUser(userId, username, first_name, last_name);

            const api_key = await getUserKey(username);

            return res
                .status(200)
                .send({ message: "User created", username, api_key });
        } catch {
            return res.status(500).send({ message: "Error creating user" });
        }
    });

    router.post("/get-token", async (req: Request, res: Response) => {
        const { username, key } = req.body;

        if (!username || !key) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const user = await getUserByUsername(username);

        if (!user) {
            throw new Error("User not found");
        }

        const secret = await getUserKey(username);

        if (secret !== key) {
            return res.status(401).send({ message: "Invalid key" });
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

        try {
            return res.status(200).send({
                token: sign(userDetails, jwtSecret, options),
                tokenType: "Bearer",
                expiresIn: "1 hour",
            });
        } catch {
            return res.status(500).send({ message: "Error creating token" });
        }
    });

    router.get(
        "/verify-token",
        verifyUser,
        async (req: Request, res: Response) => {
            const store = getAsyncLocalStorage();

            try {
                return res
                    .status(200)
                    .send({ message: "Token is valid", userDetails: store });
            } catch {
                return res
                    .status(500)
                    .send({ message: "Error verifying token" });
            }
        },
    );

    router.get(
        "/get-users",
        verifyUser,
        async (req: Request, res: Response) => {
            const store = getAsyncLocalStorage();

            if (store.role !== "admin") {
                return res.status(403).send({ message: "You have insufficient permissions to access this resource" });
            }

            try {
                return res.status(200).send(await getUsers());
            } catch {
                return res
                    .status(500)
                    .send({ message: "Error fetching users" });
            }
        },
    );

    return router;
};
