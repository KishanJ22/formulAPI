import express, { Request, Response, Router } from "express";
import { getSecret } from "./auth.core";

export const authRouter = (app: Router) => {
    const router = express.Router();
    const base = "/auth";
    app.use(base, router);

    router.post("/get-user-key", async (req: Request, res: Response) => {
        const { username, key } = req.body;
        const userKey = await getSecret(username, key);
        if (userKey) {
            res.status(200).send({ message: "Authentication successful" });
        } else {
            res.status(400).send({ message: "Failed to authenticate" });
        }
    });
};
