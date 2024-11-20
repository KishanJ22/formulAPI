import "@fastify/jwt";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            username: string;
            firstname: string;
            lastname: string;
            role: string;
            iss: string;
            iat: number;
            exp: number;
        }
    }
};