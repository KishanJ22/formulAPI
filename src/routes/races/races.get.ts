import type { FastifyInstance } from "fastify";
import {
    internalServerError,
    type InternalServerErrorSchema,
} from "../../utils/Error.js";
import { getRacesForSeason } from "./races.model.js";
import {
    type SeasonNotProvided,
    seasonNotProvided,
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
            | SeasonNotProvided
            | RacesNotFound
            | InternalServerErrorSchema;
    }>(
        "/races",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(race) }),
                    400: seasonNotProvided,
                    404: racesNotFound,
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
            let races: Race[] = [];
            const { season } = request.query as GetRacesQuery;

            if (!season) {
                return reply
                    .status(400)
                    .send({ message: "Season not provided in search query" });
            }

            try {
                if (season) {
                    races = await getRacesForSeason(season);
                }
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
