import { PORT as port, logger } from "./config";
import fastify, { FastifyInstance } from "fastify";

const app: FastifyInstance = fastify({
    logger,
});

app.listen({ port }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

app.get("/", async (request, reply) => {
    reply.status(200).send({ message: "Welcome to FormulAPI!" });
});

export default app;
