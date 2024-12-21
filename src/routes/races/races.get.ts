import type { FastifyInstance } from "fastify";
import {
    type InternalServerErrorSchema,
    internalServerError,
    type InvalidQuerySchema,
    invalidQuery,
} from "../../utils/Error.js";
import {
    getRacesByYear,
    getRacesByRaceWinner,
    getRacesByYearAndRaceWinner,
    getRacesByGrandPrix,
} from "./races.model.js";
import {
    type GetRacesQuery,
    getRacesQuery,
    type Race,
    race,
    type RacesNotFound,
    racesNotFound,
} from "./racesSchema.js";
import { Type } from "@sinclair/typebox";

const getRaces = (fastify: FastifyInstance) => {
    fastify.get<{
        QueryString: GetRacesQuery;
        Reply:
            | { data: Race[] }
            | InvalidQuerySchema
            | RacesNotFound
            | InternalServerErrorSchema;
    }>(
        "/races",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(race) }),
                    400: invalidQuery,
                    404: racesNotFound,
                    500: internalServerError,
                },
                querystring: {
                    type: "object",
                    properties: getRacesQuery.properties,
                },
            },
        },
        async (request, reply) => {
            let races: Race[] = [];
            const { year, raceWinnerId, grandPrixId } =
                request.query as GetRacesQuery;

            if (!year && !raceWinnerId && !grandPrixId) {
                return reply
                    .status(400)
                    .send({ message: "Invalid Search Query" });
            }

            try {
                if (year && raceWinnerId) {
                    races = await getRacesByYearAndRaceWinner(
                        raceWinnerId,
                        year,
                    );
                } else if (year) {
                    races = await getRacesByYear(year);
                } else if (raceWinnerId) {
                    races = await getRacesByRaceWinner(raceWinnerId);
                }

                if (grandPrixId) {
                    races = await getRacesByGrandPrix(grandPrixId);
                }
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }

            if (races.length === 0) {
                return reply
                    .status(404)
                    .send({ message: "Unable to find races" });
            }

            return reply.status(200).send({ data: races });
        },
    );
};

export default getRaces;
