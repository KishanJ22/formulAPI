import fastifyMetrics from "fastify-metrics";
import { FastifyInstance } from "fastify";

export default async function getMetrics(fastify: FastifyInstance) {
    fastify.register(fastifyMetrics, { endpoint: "/metrics" });
}
