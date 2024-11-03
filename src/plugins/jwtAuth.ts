import {
    FastifyInstance,
    FastifyRequest,
    FastifyReply,
    FastifyError,
} from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify: FastifyInstance) => {
    fastify.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                fastify.log.error(err);
                const { message, statusCode } = err as FastifyError;
                reply.status(statusCode ?? 500).send({ message });
            }
        },
    );
});
