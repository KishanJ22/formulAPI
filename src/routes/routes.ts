import { FastifyInstance } from "fastify";
import getDrivers from "./drivers/drivers.get.js";
import getCircuits from "./circuits/circuits.get.js";

const registerRoutes = async (fastify: FastifyInstance) => {
    fastify.register(getDrivers);
    fastify.register(getCircuits);
};

export default registerRoutes;
