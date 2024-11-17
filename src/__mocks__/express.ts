import express, {type Express} from "express";
import { driverRouter } from "../drivers/drivers.router";
import { circuitRouter } from "../circuits/circuits.router";

let connection: any;

export const createmockApp = async (): Promise<Express> => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    driverRouter(app);
    circuitRouter(app);

    connection = app.listen(3000, () => {
        console.log("App listening on port 3000");
    });

    return app;
};

export const closemockApp = async () => {
    await connection.close();
};
