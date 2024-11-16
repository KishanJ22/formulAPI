import { logger, envOptions as options } from "../config.js";
import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import fastifyAutoload from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const mockApp: FastifyInstance = fastify({
    logger,
});

mockApp.register(fastifyEnv, options);
await mockApp.after();

const __dirname = dirname(fileURLToPath(import.meta.url));

mockApp.register(fastifyAutoload, {
    dir: join(__dirname, "../routes"),
});

mockApp.register(fastifyJwt, {
    secret: mockApp.config.JWT_SECRET,
});

mockApp.register(FastifyFormBody);

mockApp.listen({ port: mockApp.config.PORT }, function (err) {
    if (err) {
        mockApp.log.error(err);
        process.exit(1);
    }
});

export default mockApp;
