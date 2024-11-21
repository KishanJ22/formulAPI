import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const logger = {
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
        },
    },
};

export const envOptions = {
    dotenv: true,
    schema: {
        type: "object",
        required: ["HOST", "PORT", "JWT_SECRET", "DATABASE_URL"],
        properties: {
            HOST: {
                type: "string",
            },
            PORT: {
                type: "string",
                default: "3000",
            },
            JWT_SECRET: {
                type: "string",
            },
            DATABASE_URL: {
                type: "string",
            },
        },
    },
};
