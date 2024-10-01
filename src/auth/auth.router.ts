import express, { Request, Response, Router } from "express";
import { authenticateUser } from "./auth.core";

export const authRouter = (app: Router) => {
    const router = express.Router();
    const base = "/auth";
    app.use(base, router);

    router.post("/get-token", async (req: Request, res: Response) => {
        const { username, key } = req.body;
        const authToken = await authenticateUser(username, key);
        if (authToken) {
            res.status(200).send({ authToken });
        } else {
            res.status(401).send({ message: "Failed to authenticate" });
        }
    });
};
