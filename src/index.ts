import fastify from "./app";
import { fastifyJwt } from "@fastify/jwt";
import FastifyFormBody from "@fastify/formbody";
import getDrivers from "./routes/drivers/drivers.get";
import registerUser from "./routes/auth/auth.register";
import getToken from "./routes/auth/auth.get-token";
import verifyToken from "./routes/auth/auth.verify-token";

import jwtAuth from "./plugins/jwtAuth";

fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});

fastify.register(jwtAuth);

fastify.register(FastifyFormBody);

fastify.register(registerUser);
fastify.register(getToken);
fastify.register(verifyToken);
fastify.register(getDrivers);
