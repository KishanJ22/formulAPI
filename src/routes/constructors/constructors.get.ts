import { type Constructor, constructor } from "./ConstructorSchema.js";
import { getConstructorsFromDb } from "./constructors.model.js";
import {
    invalidQuery,
    type InvalidQuerySchema,
    internalServerError,
    type InternalServerErrorSchema,
} from "../../utils/Error.js";
import { type Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const notFound = Type.Object({
    message: Type.Literal("No Constructors Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const getConstructors = (fastify: FastifyInstance) => {
    fastify.get<{
        Querystring: Constructor;
        Reply:
            | { data: Constructor[] }
            | NotFoundSchema
            | InvalidQuerySchema
            | InternalServerErrorSchema;
    }>(
        "/constructors",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(constructor) }),
                    400: invalidQuery,
                    404: notFound,
                    500: internalServerError,
                },
                querystring: {
                    type: "object",
                    properties: constructor.properties,
                },
            },
        },
        async (request, reply) => {
            try {
                const constructors = await getConstructorsFromDb();

                if (request.query && Object.keys(request.query).length > 0) {
                    const query: Partial<Constructor> = request.query;
                    const queryKeys = Object.keys(
                        query,
                    ) as (keyof Constructor)[];

                    if (
                        !queryKeys.every((key) =>
                            Object.keys(constructor.properties).includes(key),
                        )
                    ) {
                        return reply
                            .status(400)
                            .send({ message: "Invalid Search Query" });
                    }

                    const filteredConstructors = constructors.filter(
                        (constructor: Constructor) => {
                            return queryKeys.every(
                                (key) => constructor[key] === query[key],
                            );
                        },
                    );

                    if (filteredConstructors.length === 0) {
                        return reply
                            .status(404)
                            .send({ message: "No Constructors Found" });
                    }

                    return reply
                        .status(200)
                        .send({ data: filteredConstructors });
                }

                return reply.status(200).send({ data: constructors });
            } catch (error) {
                console.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }
        },
    );
};

export default getConstructors;
