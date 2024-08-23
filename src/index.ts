import express, { Request, Response } from "express";
import { driverRouter } from "./drivers/drivers.router";
import { circuitRouter } from "./circuits/circuits.router";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send({ hello: "world" });
});

app.get("/health", (req: Request, res: Response) => {
    res.send({
        message: "Ready to receive requests",
        version: `${process.env.npm_package_version}`,
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

driverRouter(app);
circuitRouter(app);