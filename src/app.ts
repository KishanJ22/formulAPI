import { logger, envOptions as options } from "./config.js";
import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import fastifyAutoload from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/routes.js";
import { prisma } from "./config.js";

const app: FastifyInstance = fastify({
    logger,
});

app.register(fastifyEnv, options);
await app.after(); // This is required to load the environment variables before the plugins

app.register(fastifyAutoload, {
    dir: join(dirname(fileURLToPath(import.meta.url)), "plugins"),
    ignorePattern: /.*(test|spec).js/,
});
app.register(registerRoutes);
app.register(FastifyFormBody);
app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
});

app.get("/", async (request, reply) => {
    return { message: "Welcome to FormulAPI!" };
});

app.get("/health", async (request, reply) => {
    const getData = await prisma.driver.findFirst();
    if (getData) {
        return reply.status(200).send({ message: "API is healthy" });
    } else {
        return reply.status(500).send({ message: "API is unhealthy" });
    }
});

export const loadApp = async () => {
    await app.ready();
    return app;
};

export default loadApp;
