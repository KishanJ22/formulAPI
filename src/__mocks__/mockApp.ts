import { envOptions as options } from "../config.js";
import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import registerRoutes from "../routes/routes.js";
import jwtAuth from "../plugins/jwtAuth.js";

const mockApp: FastifyInstance = fastify();

mockApp.register(fastifyEnv, options);
await mockApp.after();

mockApp.register(FastifyFormBody);
mockApp.register(registerRoutes);
mockApp.register(jwtAuth);
mockApp.register(fastifyJwt, {
    secret: mockApp.config.JWT_SECRET,
});

export const loadMockApp = async () => {
    await mockApp.ready();
    return mockApp;
};

export default loadMockApp;
