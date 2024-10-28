import fastify from "./app";

import { driverRouter } from "./routes/drivers/drivers.router";
import { circuitRouter } from "./routes/circuits/circuits.router";
import { authRouter } from "./routes/auth/auth";

fastify.register(driverRouter);
fastify.register(circuitRouter);
fastify.register(authRouter);
