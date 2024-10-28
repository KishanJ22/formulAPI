import { PORT as port } from "./config";
import fastify, { FastifyInstance } from "fastify";

const app: FastifyInstance = fastify({
    logger: true,
});

app.get("/", async (request, reply) => {
    reply.send({ message: "Welcome to FormulAPI!" });
});

app.listen({ port }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
});

export default app;
