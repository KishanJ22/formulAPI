import { FastifyInstance } from "fastify";
import getToken from "./auth/auth.get-token.js";
import registerUser from "./auth/auth.register.js";
import verifyToken from "./auth/auth.verify-token.js";
import getDrivers from "./drivers/drivers.get.js";
import getCircuits from "./circuits/circuits.get.js";

const registerRoutes = async (fastify: FastifyInstance) => {
    await fastify.register(registerUser);
    await fastify.register(getToken);
    await fastify.register(verifyToken);
    await fastify.register(getDrivers);
    await fastify.register(getCircuits);
}

export default registerRoutes;