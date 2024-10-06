import express, { Request, Response, Router } from "express";
import { authenticateUser, verifyJwt, registerUser } from "./auth.core";
import { getAsyncLocalStorage } from "../plugins/local-storage";
import { getUsers } from "./auth.model";

export const authRouter = (app: Router) => {
    const router = express.Router();
    const base = "/auth";
    app.use(base, router);

    router.post("/register", async (req: Request, res: Response) => {
        const { username, first_name, last_name } = req.body;
        const user = await registerUser(username, first_name, last_name);
        if (user) {
            return res.status(201).send(user);
        }
        return res.status(400).send({ message: "Failed to create user" });
    });

    router.post("/get-token", async (req: Request, res: Response) => {
        const { username } = req.body;
        const authToken = await authenticateUser(username);
        if (authToken) {
            return res.status(200).send({ authToken });
        } else {
            return res.status(401).send({ message: "Failed to authenticate" });
        }
    });

    router.get("/get-users", verifyJwt, async (req: Request, res: Response) => {
        const store = getAsyncLocalStorage();
        if (store.role !== "admin") {
            return res.status(401).send({ error: "Unauthorized" });
        }
        const data = await getUsers();
        return res.status(200).send({ data });
    });

    router.get(
        "/verify-token",
        verifyJwt,
        async (req: Request, res: Response) => {
            const store = getAsyncLocalStorage();
            try {
                return res
                    .status(200)
                    .send({ message: "Token is valid", userDetails: store });
            } catch {
                return res.status(401).send({ message: "Token is invalid" });
            }
        },
    );
};
