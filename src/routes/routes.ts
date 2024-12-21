import { FastifyInstance } from "fastify";
import jwtAuth from "../plugins/jwtAuth.js";
import getRoot from "./getRoot.js";
import getHealth from "./health.js";
import getDrivers from "./drivers/drivers.get.js";
import getCircuits from "./circuits/circuits.get.js";
import getMetrics from "./metrics.js";
import getConstructors from "./constructors/constructors.get.js";
import getRaces from "./races/races.get.js";
import getGrandPrix from "./grand-prix/grand-prix.get.js";

const registerRoutes = async (fastify: FastifyInstance) => {
    fastify.register(getRoot);
    fastify.register(getHealth);
    fastify.register(getMetrics);
    fastify.register(jwtAuth);

    fastify.register(getDrivers);
    fastify.register(getCircuits);
    fastify.register(getConstructors);
    fastify.register(getGrandPrix);
    fastify.register(getRaces);
};

export default registerRoutes;
