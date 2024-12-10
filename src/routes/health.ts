import { prisma } from "../config.js";
import type { FastifyInstance } from "fastify";

export default async function getHealth(app: FastifyInstance) {
    app.get("/health", async (request, reply) => {
        // Check if the API is healthy by querying the database
        const getData = await prisma.driver.findFirst();

        if (getData) {
            return reply.status(200).send({ message: "API is healthy" });
        } else {
            return reply.status(500).send({ message: "API is unhealthy" });
        }
    });
}
