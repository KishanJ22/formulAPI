import fastify from "./app.js";
import getDrivers from "./routes/drivers/drivers.get.js";
import registerUser from "./routes/auth/auth.register.js";
import getToken from "./routes/auth/auth.get-token.js";
import verifyToken from "./routes/auth/auth.verify-token.js";

fastify.register(registerUser);
fastify.register(getToken);
fastify.register(verifyToken);

fastify.register(getDrivers);
