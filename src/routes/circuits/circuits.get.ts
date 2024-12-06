import { getCircuitsFromDb } from "./circuits.model.js";
import { type Circuit, circuit } from "./CircuitSchema.js";
import {
    invalidQuery,
    type InvalidQuerySchema,
    internalServerError,
    type InternalServerErrorSchema,
} from "../../utils/Error.js";
import { type Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const notFound = Type.Object({
    message: Type.Literal("No Circuits Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const getCircuits = (fastify: FastifyInstance) => {
    fastify.get<{
        QueryString: Circuit;
        Reply:
            | { data: Circuit[] }
            | NotFoundSchema
            | InvalidQuerySchema
            | InternalServerErrorSchema;
    }>(
        "/circuits",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: circuit.properties,
                },
                response: {
                    200: Type.Object({ data: Type.Array(circuit) }),
                    400: invalidQuery,
                    404: notFound,
                    500: internalServerError,
                },
            },
        },
        async (request, reply) => {
            try {
                const circuits = await getCircuitsFromDb();

                if (request.query && Object.keys(request.query).length > 0) {
                    const query: Partial<Circuit> = request.query;
                    const queryKeys = Object.keys(query) as (keyof Circuit)[];

                    if (
                        !queryKeys.every((key) =>
                            Object.keys(circuit.properties).includes(key),
                        )
                    ) {
                        return reply
                            .status(400)
                            .send({ message: "Invalid Search Query" });
                    }

                    const filteredCircuits = circuits.filter((circuit) =>
                        queryKeys.every((key) => circuit[key] === query[key]),
                    );

                    if (filteredCircuits.length === 0) {
                        return reply
                            .status(404)
                            .send({ message: "No Circuits Found" });
                    }

                    return reply.status(200).send({ data: filteredCircuits });
                }

                return reply.status(200).send({ data: circuits });
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }
        },
    );
};

export default getCircuits;
