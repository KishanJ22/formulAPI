import type { SignOptions } from "@fastify/jwt";
import fastify from "../../app";
import { getUserByUsername, getUserKey } from "./auth.model";
import {
    getTokenBody,
    getTokenResponse,
    invalidCredentials,
    missingFields,
    userNotFound,
} from "./schema/AuthSchema";
import type {
    GetTokenBodySchema,
    GetTokenResponseSchema,
    InvalidCredentialsSchema,
    MissingFieldsSchema,
    UserNotFoundSchema,
} from "./schema/AuthSchema";

const getToken = () => {
    fastify.post<{
        Body: GetTokenBodySchema;
        Reply:
            | GetTokenResponseSchema
            | MissingFieldsSchema
            | InvalidCredentialsSchema
            | UserNotFoundSchema;
    }>(
        "/auth/get-token",
        {
            schema: {
                body: getTokenBody,
                response: {
                    200: getTokenResponse,
                    400: missingFields,
                    401: invalidCredentials,
                    404: userNotFound,
                },
            },
        },
        async (request, reply) => {
            const { username, key } = request.body;

            if (!username || !key) {
                return reply
                    .status(400)
                    .send({ message: "Missing required fields" });
            }

            const user = await getUserByUsername(username);

            if (!user) {
                return reply.status(401).send({ message: "User not found" });
            }

            const secret = await getUserKey(username);

            if (secret !== key) {
                return reply
                    .status(401)
                    .send({ message: "Invalid credentials" });
            }

            const userDetails = {
                username: user.username,
                firstname: user.first_name,
                lastname: user.last_name,
                role: user.role,
            };

            const options: SignOptions = {
                algorithm: "HS256",
                expiresIn: "1h",
                iss: "auth-service",
                sub: user.username as string,
                notBefore: 0,
            };

            const token = fastify.jwt.sign(userDetails, options);

            return reply
                .status(200)
                .send({ token, tokenType: "Bearer", expiresIn: "1 hour" });
        },
    );
};

export default getToken;
