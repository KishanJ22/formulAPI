import express, { Response } from "express";
import { driverRouter } from "./drivers/drivers.router";
import { circuitRouter } from "./circuits/circuits.router";
import axios from "axios";
import http from "http";

const app = express();
const port = process.env.PORT || 3000;
const appUrl = `http://localhost:${port}`;
export const driversAxios = axios.create({
    baseURL: `${appUrl}`,
    httpAgent: new http.Agent({ keepAlive: true }),
});

app.get("/", (res: Response) => {
    res.send({ message: "Welcome to FormulAPI!" });
});

app.get("/health", (res: Response) => {
    res.send({
        message: "Ready to receive requests",
        version: `${process.env.npm_package_version}`,
    });
});

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};

driverRouter(app);
circuitRouter(app);