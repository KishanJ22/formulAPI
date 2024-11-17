import express, { Request, Response } from "express";
import { driverRouter } from "./drivers/drivers.router";
import { circuitRouter } from "./circuits/circuits.router";
import { PORT } from "./config";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({ message: "Welcome to FormulAPI!" });
});

app.get("/health", (req: Request, res: Response) => {
    res.send({
        message: "Ready to receive requests",
        version: `${process.env.npm_package_version}`,
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}

driverRouter(app);
circuitRouter(app);
