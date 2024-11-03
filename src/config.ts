import { PrismaClient } from "@prisma/client";

export const PORT = Number(process.env.PORT ?? 3000);
export const APP_URL = process.env.APP_URL;
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
