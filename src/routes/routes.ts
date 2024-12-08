import { FastifyInstance } from "fastify";
import getRoot from "./getRoot.js";
import getHealth from "./health.js";
import getDrivers from "./drivers/drivers.get.js";
import getCircuits from "./circuits/circuits.get.js";
import getMetrics from "./metrics.js";
import getConstructors from "./constructors/constructors.get.js";

const registerRoutes = async (fastify: FastifyInstance) => {
    fastify.register(getRoot);
    fastify.register(getHealth);
    fastify.register(getDrivers);
    fastify.register(getCircuits);
    fastify.register(getConstructors);
    fastify.register(getMetrics);
};

export default registerRoutes;
