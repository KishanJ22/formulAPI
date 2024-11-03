import { type Static, Type } from "@sinclair/typebox";
import fastify from "../../app.js";
import { prisma } from "../../config.js";
import { type Driver, driver } from "./schemas/DriverSchema.js";
import { invalidQuery, type InvalidQuerySchema, internalServerError, type InternalServerErrorSchema } from "../../utils/Error.js";

const notFound = Type.Object({
    message: Type.Literal("No Drivers Found"),
});

type NotFoundSchema = Static<typeof notFound>;

const getDrivers = () => {
    fastify.get<{
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
            },
        },
        async (request, reply) => {
            try {
                const drivers = await prisma.driver.findMany();

                if (drivers.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "No Drivers Found" });
                }

                const formattedDrivers: Driver[] = drivers.map((driver) => ({
                    ...driver,
                    total_points: driver.total_points.toNumber(),
                    total_championship_points:
                        driver.total_championship_points.toNumber(),
                }));

                return reply.status(200).send({ data: formattedDrivers });
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
