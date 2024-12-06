import { type Driver, driver } from "./DriverSchema.js";
import { getDriversFromDb } from "./drivers.model.js";
import {
    invalidQuery,
    type InvalidQuerySchema,
    internalServerError,
    type InternalServerErrorSchema,
} from "../../utils/Error.js";
import { type Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const notFound = Type.Object({
    message: Type.Literal("No Drivers Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const getDrivers = (fastify: FastifyInstance) => {
    fastify.get<{
        Querystring: Driver;
        Reply:
            | { data: Driver[] }
            | NotFoundSchema
            | InvalidQuerySchema
            | InternalServerErrorSchema;
    }>(
        "/drivers",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(driver) }),
                    400: invalidQuery,
                    404: notFound,
                    500: internalServerError,
                },
                querystring: {
                    type: "object",
                    properties: driver.properties,
                },
            },
        },
        async (request, reply) => {
            try {
                const drivers = await getDriversFromDb();

                if (request.query && Object.keys(request.query).length > 0) {
                    const query: Partial<Driver> = request.query;
                    const queryKeys = Object.keys(query) as (keyof Driver)[];

                    if (
                        !queryKeys.every((key) =>
                            Object.keys(driver.properties).includes(key),
                        )
                    ) {
                        return reply
                            .status(400)
                            .send({ message: "Invalid Search Query" });
                    }

                    const filteredDrivers = drivers.filter((driver: Driver) => {
                        return queryKeys.every(
                            (key) =>
                                query[key]?.toString() ===
                                driver[key]?.toString(),
                        );
                    });

                    if (filteredDrivers.length === 0) {
                        return reply
                            .status(404)
                            .send({ message: "No Drivers Found" });
                    }

                    return reply.status(200).send({ data: filteredDrivers });
                } else {
                    return reply.status(200).send({ data: drivers });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply
                    .status(500)
                    .send({ message: "Internal Server Error" });
            }
        },
    );
};

export default getDrivers;
