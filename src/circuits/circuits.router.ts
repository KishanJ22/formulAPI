import express, { Request, Response, Router } from "express";
import { getAllCircuits, getOneCircuit } from "./circuits.core";

export const circuitRouter = (app: Router) => {
    const router = express.Router();
    const base = "/circuits";
    app.use(base, router);

    router.get("/", async (req: Request, res: Response) => {
        let circuits;
        try {
            if(Object.keys(req.query).length > 0) {
                const searchQuery: any = req.query;
                circuits = await getAllCircuits(searchQuery);
            } else {
                circuits = await getAllCircuits();
            }
        } catch (err: any) {
            if (err.message == "No Circuits Found") {
                res.status(404).send({ message: "No Circuits Found" });
            } else {
                res.status(500).send({ message: "Something went wrong" });
            }
        }
        res.status(200).send(circuits);
    });

    router.get("/:circuitId", async (req: Request, res: Response) => {
        const circuitParam = req.params.circuitId;
        let circuit;
        try {
            circuit = await getOneCircuit(circuitParam);
        } catch (err: any) {
            if (err.message == "No Circuit Found") {
                res.status(404).send({ message: "No Circuit Found" });
            } else {
                res.status(500).send({ message: "Something went wrong" });
            }
        }
        res.status(200).send(circuit);
    });

    return router;
};