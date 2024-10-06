import express, { Request, Response, Router } from "express";
import { authenticateUser, verifyJwt } from "./auth.core";
import { getAsyncLocalStorage } from "../plugins/local-storage";
import { getUsers } from "./auth.model";

export const authRouter = (app: Router) => {
    const router = express.Router();
    const base = "/auth";
    app.use(base, router);

    router.post("/get-token", async (req: Request, res: Response) => {
        const { username, key } = req.body;
        const authToken = await authenticateUser(username, key);
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
            return res
                .status(200)
                .send({ message: "Token is valid" });
        },
    );
};
