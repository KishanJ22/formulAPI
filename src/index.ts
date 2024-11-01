import fastify from "./app";

import getDrivers from "./routes/drivers/drivers.get";

fastify.register(getDrivers);
