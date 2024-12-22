import { logger, envOptions as options, openapi } from "./config.js";
import fastify, { FastifyInstance } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import registerRoutes from "./routes/routes.js";
import fastifySwagger from "@fastify/swagger";
import { writeFile } from "fs";

const app: FastifyInstance = fastify({
    logger: logger[process.env.NODE_ENV as keyof typeof logger] ?? true,
});

app.register(fastifySwagger, { openapi });
app.register(fastifyEnv, options);
await app.after(); // This is required to load the environment variables before the plugins
app.register(registerRoutes);
app.register(FastifyFormBody);
app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
});

const generateApiSpec = () => {
    const specFilePath = "./docs/openapi.json";
    const apiSpec = JSON.stringify(app.swagger(), null, 2);
    
    writeFile(specFilePath, apiSpec, (err) => {
        if (err) {
            return app.log.error(err);
        }

        app.log.debug(`OpenAPI spec written to ${specFilePath}`);
    });
};

export const loadApp = async () => {
    await app.ready();
    
    if (app.config.NODE_ENV == "development") {
        generateApiSpec();
    }
    
    return app;
};

export default loadApp;
