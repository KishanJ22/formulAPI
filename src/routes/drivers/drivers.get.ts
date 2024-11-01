import fastify from "../../app";
import { prisma } from "../../config";
import { type Driver, driver } from "./schemas/DriverSchema";

import { type Static, Type } from "@sinclair/typebox";

const notFound = Type.Object({
    message: Type.Literal("No Drivers Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const invalidQuery = Type.Object({
    message: Type.Literal("Invalid Search Query"),
});

type InvalidQuerySchema = Static<typeof invalidQuery>;

export const getDrivers = async () => {
    fastify.get<{
        Reply: { data: Driver[] } | NotFoundSchema | InvalidQuerySchema;
    }>(
        "/drivers",
        {
            schema: {
                response: {
                    200: Type.Object({ data: Type.Array(driver) }),
                    400: invalidQuery,
                    404: notFound,
                },
            },
        },
        async (request, reply) => {
            const drivers = await prisma.driver.findMany();

            if (drivers.length === 0) {
                return reply.status(404).send({ message: "No Drivers Found" });
            }

            const formattedDrivers: Driver[] = drivers.map((driver) => {
                return {
                    ...driver,
                    total_points: driver.total_points.toNumber(),
                    total_championship_points:
                        driver.total_championship_points.toNumber(),
                };
            });

            return reply.status(200).send({ data: formattedDrivers });
        },
    );
};
