import type { FastifyInstance } from "fastify";
import {
    invalidQuery,
    type InvalidQuerySchema,
    internalServerError,
    type InternalServerErrorSchema,
} from "../../utils/Error.js";
import { getRacesForSeason } from "./races.model.js";
import {
    type Race,
    race,
    type GetRacesQuery,
    getRacesQuery,
} from "./racesSchema.js";
import { Type } from "@sinclair/typebox";

const getRaces = (fastify: FastifyInstance) => {
    fastify.get<{
        QueryString: GetRacesQuery;
        Reply:
            | { data: Race[] }
            | InvalidQuerySchema
            | InternalServerErrorSchema;
    }>(
        "/races",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(race) }),
                    400: invalidQuery,
                    500: internalServerError,
                },
                querystring: {
                    type: "object",
                    required: ["season"],
                    properties: getRacesQuery.properties,
                },
            },
        },
        async (request, reply) => {
            const { season } = request.query as GetRacesQuery;
            let races : Race[];

            try {
                if (!season) {
                    return reply
                        .status(400)
                        .send({ message: "Invalid Search Query" });
                }

                races = await getRacesForSeason(season);
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }

            return reply.status(200).send({ data: races });
        },
    );
};

export default getRaces;
