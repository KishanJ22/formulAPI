import { logger, envOptions as options } from "./config.js";
import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import registerRoutes from "./routes/routes.js";

const app: FastifyInstance = fastify({
    logger,
});

app.register(fastifyEnv, options);
await app.after(); // This is required to load the environment variables before the plugins

app.register(registerRoutes);
app.register(FastifyFormBody);
app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
});

export const loadApp = async () => {
    await app.ready();
    return app;
};

export default loadApp;
