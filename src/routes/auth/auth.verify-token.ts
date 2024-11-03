import fastify from "../../app";
import { validToken, ValidTokenSchema } from "./schema/AuthSchema";

const verifyToken = () => {
    fastify.get<{
        Reply: ValidTokenSchema;
    }>(
        "/auth/verify-token",
        {
            onRequest: [fastify.authenticate],
            schema: {
                response: {
                    200: validToken,
                },
            },
        },
        async (request, reply) => {
            fastify.log.info(request.user);

            const userDetails = {
                username: request.user.username,
                firstname: request.user.firstname,
                lastname: request.user.lastname,
                role: request.user.role,
                expiresAt: new Date(request.user.exp * 1000).toUTCString(),
            }

            return reply
                .status(200)
                .send({ message: "Token is valid", userDetails });
        },
    );
};

export default verifyToken;
