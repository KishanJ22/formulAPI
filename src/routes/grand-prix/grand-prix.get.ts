import type { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import {
    type GrandPrix,
    grandPrix,
    type GrandPrixNotFound,
    grandPrixNotFound,
} from "./GrandPrixSchema.js";
import { getGrandPrixFromDb } from "./grand-prix.model.js";
import {
    type InternalServerErrorSchema,
    internalServerError,
    type InvalidQuerySchema,
    invalidQuery,
} from "../../utils/Error.js";

const getGrandPrix = (fastify: FastifyInstance) => {
    fastify.get<{
        Reply:
            | { data: GrandPrix[] }
            | GrandPrixNotFound
            | InvalidQuerySchema
            | InternalServerErrorSchema;
        QueryString: GrandPrix;
    }>(
        "/grand-prix",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(grandPrix) }),
                    400: invalidQuery,
                    404: grandPrixNotFound,
                    500: internalServerError,
                },
                querystring: {
                    type: "object",
                    properties: grandPrix.properties,
                },
            },
        },
        async (request, reply) => {
            try {
                const grandPrixFromDb = await getGrandPrixFromDb();

                if (request.query && Object.keys(request.query).length > 0) {
                    const query: Partial<GrandPrix> = request.query;
                    const queryKeys = Object.keys(query) as (keyof GrandPrix)[];

                    if (
                        !queryKeys.every((key) =>
                            Object.keys(grandPrix.properties).includes(key),
                        )
                    ) {
                        return reply
                            .status(400)
                            .send({ message: "Invalid Search Query" });
                    }

                    const filteredGrandPrix = grandPrixFromDb.filter(
                        (gp: GrandPrix) => {
                            return queryKeys.every((key) => {
                                if (key === "totalRacesHeld") {
                                    return (
                                        gp.totalRacesHeld ===
                                        query.totalRacesHeld
                                    );
                                } else {
                                    return gp[key]
                                        ?.toString()
                                        .includes(query[key]?.toString() || "");
                                }
                            });
                        },
                    );

                    if (filteredGrandPrix.length === 0) {
                        return reply
                            .status(404)
                            .send({ message: "No Grand Prix found" });
                    }

                    return reply.status(200).send({ data: filteredGrandPrix });
                }

                return reply.send({ data: grandPrixFromDb });
            } catch (error) {
                fastify.log.error(error);
                return reply.send({ message: "Internal Server Error" });
            }
        },
    );
};

export default getGrandPrix;
