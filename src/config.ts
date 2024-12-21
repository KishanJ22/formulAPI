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

export const openapi = {
    info: {
        title: "FormulAPI",
        version: "1.0.0",
        description: "API for getting Formula One data",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server",
        },
        {
            url: "https://formulapi-dev.kjet.dev:3000",
            description: "Development server",
        },
    ],
    tags: [
        {
            name: "drivers",
            description: "Driver related endpoints",
        },
        {
            name: "constructors",
            description: "Constructor related endpoints",
        },
        {
            name: "circuits",
            description: "Circuit related endpoints",
        },
        {
            name: "races",
            description: "Race related endpoints",
        },
        {
            name: "grand-prix",
            description: "Grand Prix related endpoints",
        },
    ],
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
            NODE_ENV: {
                type: "string",
                default: "development",
            }
        },
    },
};
