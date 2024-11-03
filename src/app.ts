import { logger, envOptions as options } from "./config.js";

import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import fastifyAutoload from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app: FastifyInstance = fastify({
    logger,
});

app.register(fastifyEnv, options);
await app.after();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.register(fastifyAutoload, {
    dir: join(__dirname, "plugins"),
});

app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
});

app.register(FastifyFormBody);

app.listen({ port: app.config.PORT }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

app.get("/", async (request, reply) => {
    reply.status(200).send({ message: "Welcome to FormulAPI!" });
});

export default app;
