import type { FastifyInstance } from "fastify";

export default async function getRoot(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        return reply.status(200).send({ message: "Welcome to FormulAPI!" });
    });
}

