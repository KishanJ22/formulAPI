import { prisma } from "../../config.js";
import { type Driver, driver } from "./schemas/DriverSchema.js";
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
                const drivers = await prisma.driver.findMany();

                const formattedDrivers: Driver[] = drivers.map((driver) => ({
                    ...driver,
                    date_of_birth: driver.date_of_birth.toISOString(),
                    date_of_death: driver.date_of_death?.toISOString() ?? null,
                    total_points: driver.total_points.toNumber(),
                    total_championship_points: driver.total_championship_points.toNumber(),
                }));

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

                    const filteredDrivers = formattedDrivers.filter(
                        (driver: Driver) => {
                            return queryKeys.every(
                                (key) =>
                                    query[key]?.toString() ===
                                    driver[key]?.toString(),
                            );
                        },
                    );

                    if (filteredDrivers.length === 0) {
                        return reply
                            .status(404)
                            .send({ message: "No Drivers Found" });
                    }

                    return reply.status(200).send({ data: filteredDrivers });
                } else {
                    return reply.status(200).send({ data: formattedDrivers });
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
