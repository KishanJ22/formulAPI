import express, { Request, Response, Router } from "express";
import { getAllDrivers, getOneDriver } from "./drivers.core";

export const driverRouter = (app: Router) => {
    const router = express.Router();
    const base = "/drivers";
    app.use(base, router);

    router.get("/", async (req: Request, res: Response) => {
        let drivers;
        try {
            if(Object.keys(req.query).length > 0) {
                const searchQuery: any = req.query;
                drivers = await getAllDrivers(searchQuery);
            } else {
                drivers = await getAllDrivers();
            }
        } catch (err: any) {
            if (err.message == "No Drivers Found") {
                res.status(404).send({ message: "No Drivers Found" });
            } else if (err.message == "Invalid Search Query") {
                res.status(404).send({ message: "Invalid Search Query" });
            } else {
                res.status(500).send({ message: "Something went wrong" });
            }
        }
        res.status(200).send(drivers);
    });

    router.get("/:driverId", async (req: Request, res: Response) => {
        const driverParam = req.params.driverId;
        let driver;
        try {
            driver = await getOneDriver(driverParam);
        } catch (err: any) {
            if (err.message == "No Driver Found") {
                res.status(404).send({ message: "No Driver Found" });
            } else {
                res.status(500).send({ message: "Something went wrong" });
            }
        }
        res.status(200).send(driver);
    });
};
