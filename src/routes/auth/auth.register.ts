import { FastifyInstance } from "fastify";
import { prisma } from "../../config.js";
import { getUserById, getUserByUsername, getUserKey } from "./auth.model.js";
import {
    registrationBody,
    successfulRegistration,
    usernameExists,
    missingFields,
    errorCreatingUser,
} from "./schema/AuthSchema.js";
import type {
    RegistrationBodySchema,
    SuccessfulRegistrationSchema,
    UsernameExistsSchema,
    MissingFieldsSchema,
    ErrorCreatingUserSchema,
} from "./schema/AuthSchema.js";

const createUserRecord = async (
    id: string,
    username: string,
    first_name: string,
    last_name: string,
) => {
    const raw_user_meta_data = {
        username,
        first_name,
        last_name,
        role: "authenticated",
    };

    const created_at = new Date();

    await prisma.auth_users.create({
        data: {
            id,
            raw_user_meta_data,
            created_at,
        },
    });
};

const registerUser = (fastify: FastifyInstance) => {
    fastify.post<{
        Body: RegistrationBodySchema;
        Reply:
            | SuccessfulRegistrationSchema
            | UsernameExistsSchema
            | MissingFieldsSchema
            | ErrorCreatingUserSchema;
    }>(
        "/auth/register",
        {
            schema: {
                body: registrationBody,
                response: {
                    200: successfulRegistration,
                    409: usernameExists,
                    400: missingFields,
                    500: errorCreatingUser,
                },
            },
        },
        async (request, reply) => {
            const { username, first_name, last_name } = request.body;

            if (!username || !first_name || !last_name) {
                fastify.log.error("Missing required fields");
                return reply
                    .status(400)
                    .send({ message: "Missing required fields" });
            }

            if (await getUserByUsername(username)) {
                fastify.log.error(`Username '${username}' already exists`);
                return reply
                    .status(409)
                    .send({ message: "Username already exists" });
            }

            let userId = crypto.randomUUID();

            if (await getUserById(userId)) {
                userId = crypto.randomUUID();
            }

            try {
                await createUserRecord(userId, username, first_name, last_name);

                const api_key = await getUserKey(username);

                return reply.status(200).send({
                    message: "User created successfully",
                    username,
                    api_key,
                });
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Error creating user" });
            }
        },
    );
};

export default registerUser;
