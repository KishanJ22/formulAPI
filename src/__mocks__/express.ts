import express, { type Express } from "express";
import { driverRouter } from "../drivers/drivers.router";
import { circuitRouter } from "../circuits/circuits.router";

let connection: any;

export const createmockApp = async (serverPort: number) => {
    const app: Express = express();
    app.use(express.urlencoded({ extended: true }));
    driverRouter(app);
    circuitRouter(app);

    connection = app.listen(serverPort);

    return connection.address();
};

export const closemockApp = async () => {
    await connection.close();
};
