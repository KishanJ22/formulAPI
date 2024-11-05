import { prisma } from "../../config.js";
import { type Circuit, circuit } from "./schemas/CircuitSchema.js";
import { invalidQuery, type InvalidQuerySchema, internalServerError, type InternalServerErrorSchema } from "../../utils/Error.js";
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
                const circuits = await prisma.circuit.findMany();

                const formattedCircuits: Circuit[] = circuits.map((circuit) => ({
                    ...circuit,
                    latitude: circuit.latitude.toNumber(),
                    longitude: circuit.longitude.toNumber(),
                }));

                if (request.query && Object.keys(request.query).length > 0) {
                    const query: Partial<Circuit> = request.query;
                    const queryKeys = Object.keys(query) as (keyof Circuit)[];

                    if (
                        !queryKeys.every((key) =>
                            Object.keys(circuit.properties).includes(key),
                        )
                    ) {
                        return reply.status(400).send({ message: "Invalid Search Query" });
                    }

                    const filteredCircuits = formattedCircuits.filter((circuit) =>
                        queryKeys.every(
                            (key) => circuit[key] === query[key],
                        ),
                    );

                    if (filteredCircuits.length === 0) {
                        return reply.status(404).send({ message: "No Circuits Found" });
                    }

                    return reply.status(200).send({ data: filteredCircuits });
                }

                return reply.status(200).send({ data: formattedCircuits });
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }
        },
    )
};

export default getCircuits;