import fastify from "../../app";
import { prisma } from "../../config";
import { type Driver, driver } from "./schemas/DriverSchema";
import { Decimal } from "@prisma/client/runtime/library";

import { type Static, Type } from "@sinclair/typebox";

const notFound = Type.Object({
    message: Type.Literal("No Drivers Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const invalidQuery = Type.Object({
    message: Type.Literal("Invalid Search Query"),
});

type InvalidQuerySchema = Static<typeof invalidQuery>;

export default fastify.get<{ Reply: { drivers: Driver[] } | NotFoundSchema | InvalidQuerySchema }>(
    "/drivers",
    {
        schema: {
            response: {
                200: Type.Object({ drivers: Type.Array(driver) }),
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

        drivers.forEach((driver) => {
            driver.total_points = driver.total_points as number;
            driver.total_championship_points = Number(driver.total_championship_points);
        });

        return reply.status(200).send({ drivers });
    },
);
