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
        Reply:
            | { data: Circuit[] }
            | NotFoundSchema
            | InvalidQuerySchema
            | InternalServerErrorSchema;
    }>(
        "/circuits",
        {
            schema: {
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

                if (circuits.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "No Circuits Found" });
                }

                const formattedCircuits: Circuit[] = circuits.map((circuit) => ({
                    ...circuit,
                    latitude: circuit.latitude.toNumber(),
                    longitude: circuit.longitude.toNumber(),
                }));

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